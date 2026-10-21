import asyncio
import hashlib
import json
import sys
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).parent
BASE_URL = "http://127.0.0.1:5210"
WIDTHS = (1440, 1280, 768, 390)
ROUTES = ("/en", "/ar", "/en/about", "/ar/about")


async def main():
    group = sys.argv[1] if len(sys.argv) > 1 else "before"
    if group not in ("before", "after"):
        raise SystemExit("Usage: python capture.py before|after")
    output = ROOT / "screenshots" / group
    output.mkdir(parents=True, exist_ok=True)
    records = []
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        for route in ROUTES:
            for width in WIDTHS:
                page = await browser.new_page(viewport={"width": width, "height": 1000}, device_scale_factor=1)
                await page.emulate_media(reduced_motion="reduce")
                response = await page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
                await page.evaluate("document.fonts.ready")
                await page.evaluate("""async () => {
                  for (const img of document.images) { img.loading = 'eager'; }
                  await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
                }""")
                await page.wait_for_timeout(100)
                about_route = route.endswith("/about")
                capabilities_hero = (about_route if group == "before" else not about_route)
                hero = page.locator("header.about-page-sec") if capabilities_hero else page.locator("header.home-hero")
                if await hero.count() != 1:
                    hero = page.locator("header.style-5").first
                hero_box = await hero.bounding_box()
                heading = await hero.locator("h1").inner_text()
                images = await page.locator("img").evaluate_all("imgs => imgs.map(i => ({src:i.getAttribute('src'),alt:i.alt,loaded:i.complete&&i.naturalWidth>0}))")
                metrics = await page.evaluate("""() => ({title:document.title,lang:document.documentElement.lang,dir:document.documentElement.dir,scrollWidth:document.documentElement.scrollWidth,bodyHeight:document.body.scrollHeight,h1Count:document.querySelectorAll('h1').length})""")
                safe_route = route.strip("/").replace("/", "-") or "home"
                stem = f"{safe_route}-{width}"
                full_path = output / f"{stem}.png"
                hero_path = output / f"{stem}-hero.png"
                await page.screenshot(path=str(full_path), full_page=True, animations="disabled")
                await hero.screenshot(path=str(hero_path), animations="disabled")
                for path, kind in ((full_path, "fullPage"), (hero_path, "hero")):
                    records.append({
                        "route": route,
                        "viewportWidth": width,
                        "kind": kind,
                        "path": path.relative_to(ROOT).as_posix(),
                        "bytes": path.stat().st_size,
                        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                        "status": response.status if response else None,
                        "heading": heading,
                        "heroTop": round(hero_box["y"]),
                        "heroHeight": round(hero_box["height"]),
                        "imageCount": len(images),
                        "brokenImages": [image["src"] for image in images if not image["loaded"]],
                        **metrics,
                    })
                await page.close()
        await browser.close()
    manifest = {"baseUrl": BASE_URL, "group": group, "viewports": list(WIDTHS), "routes": list(ROUTES), "captures": records}
    (ROOT / f"{group}-captures.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{group}: {len(records)} screenshots; HTTP errors: {sum(item['status'] != 200 for item in records)}; broken-image pages: {sum(bool(item['brokenImages']) for item in records)}")


if __name__ == "__main__":
    asyncio.run(main())
