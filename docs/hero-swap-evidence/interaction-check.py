import asyncio
import json
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).parent
BASE_URL = "http://127.0.0.1:5210"
WIDTHS = (1440, 1280, 1024, 768, 390, 360)
results = []


async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        for locale in ("en", "ar"):
            for width in WIDTHS:
                page = await browser.new_page(viewport={"width": width, "height": 900})
                await page.emulate_media(reduced_motion="reduce")
                errors = []
                page.on("pageerror", lambda error: errors.append(str(error)))

                home_response = await page.goto(f"{BASE_URL}/{locale}", wait_until="networkidle")
                home_header = page.locator("header.about-page-sec")
                home_link = home_header.locator("a").filter(has_text="Discuss Your Project" if locale == "en" else "ناقش مشروعك معنا")
                expected_home = f"/{locale}/contact"
                h1_home = await home_header.locator("h1").count()
                home_href = await home_link.get_attribute("href") if await home_link.count() else None
                capabilities = await home_header.locator("[data-home-capabilities] > div > span:last-child").all_inner_texts()
                home_widths = await page.evaluate("({vw:innerWidth,sw:document.documentElement.scrollWidth})")
                hero_images = await home_header.locator("img").evaluate_all("imgs=>imgs.map(i=>({src:i.src,ok:i.complete&&i.naturalWidth>0}))")
                home_ok = home_response.status == 200 and h1_home == 1 and home_href == expected_home and len(capabilities) == 3 and home_widths["vw"] == home_widths["sw"] and all(img["ok"] for img in hero_images)
                if home_ok:
                    await home_link.click()
                    await page.wait_for_url(f"**{expected_home}")
                results.append({"route": f"/{locale}", "width": width, "check": "hero content, locale, CTA destination, artwork load, and overflow", "passed": home_ok, "status": home_response.status, "headingCount": h1_home, "ctaHref": home_href, "capabilities": capabilities, "brokenHeroImages": [img["src"] for img in hero_images if not img["ok"]], "scrollWidth": home_widths["sw"], "viewportWidth": home_widths["vw"]})

                about_response = await page.goto(f"{BASE_URL}/{locale}/about", wait_until="networkidle")
                about_header = page.locator("header.home-hero")
                about_link = about_header.locator("a").filter(has_text="How We Work" if locale == "en" else "اعرف طريقة شغلنا")
                expected_about = f"/{locale}/how-we-work"
                h1_about = await about_header.locator("h1").count()
                about_href = await about_link.get_attribute("href") if await about_link.count() else None
                about_widths = await page.evaluate("({vw:innerWidth,sw:document.documentElement.scrollWidth})")
                about_images = await about_header.locator("img").evaluate_all("imgs=>imgs.map(i=>({src:i.src,ok:i.complete&&i.naturalWidth>0}))")
                about_ok = about_response.status == 200 and h1_about == 1 and about_href == expected_about and about_widths["vw"] == about_widths["sw"] and all(img["ok"] for img in about_images)
                if about_ok:
                    await about_link.click()
                    await page.wait_for_url(f"**{expected_about}")
                results.append({"route": f"/{locale}/about", "width": width, "check": "hero content, locale, CTA destination, artwork load, and overflow", "passed": about_ok, "status": about_response.status, "headingCount": h1_about, "ctaHref": about_href, "brokenHeroImages": [img["src"] for img in about_images if not img["ok"]], "scrollWidth": about_widths["sw"], "viewportWidth": about_widths["vw"]})
                results[-1]["pageErrors"] = errors
                await page.close()
        await browser.close()

    (ROOT / "interaction-results.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    failed = [item for item in results if not item["passed"] or item.get("pageErrors")]
    print(f"{len(results)-len(failed)}/{len(results)} hero/CTA/viewport checks passed")
    if failed:
        raise SystemExit(json.dumps(failed, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
