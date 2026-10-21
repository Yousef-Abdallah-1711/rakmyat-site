import asyncio
import hashlib
import json
from pathlib import Path
from PIL import Image
from playwright.async_api import async_playwright

BASE_URL = "http://127.0.0.1:5210"
ROOT = Path(__file__).parent
WIDTHS = (1440, 1280, 1024, 768, 390, 360)
BASELINE_HOME_WIDTHS = (1440, 1280, 768, 390)
HOME_WIDTHS = WIDTHS


async def inspect(page, route, width):
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    response = await page.goto(f"{BASE_URL}{route}", wait_until="domcontentloaded", timeout=45000)
    await page.locator("body").wait_for(state="visible")
    await page.evaluate("document.fonts.ready")
    await page.wait_for_timeout(150)
    metrics = await page.evaluate("""() => ({
      title: document.title,
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      viewportWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyHeight: Math.ceil(document.body.scrollHeight),
      heading: document.querySelector('h1')?.innerText ?? '',
      brokenImages: [...document.images].filter(image => image.complete && image.naturalWidth === 0).map(image => image.src),
      navigation: [...document.querySelectorAll('nav .navbar-nav a')].map(a => ({ text: a.innerText.trim(), href: a.getAttribute('href'), current: a.getAttribute('aria-current') })),
      homeSection: (() => { const section = document.querySelector('[data-home-services]'); return section ? { width: Math.round(section.getBoundingClientRect().width), height: Math.round(section.getBoundingClientRect().height) } : null })(),
      processSection: (() => { const section = document.querySelector('[aria-labelledby="how-we-work-home-title"]'); return section ? { width: Math.round(section.getBoundingClientRect().width), height: Math.round(section.getBoundingClientRect().height), steps: section.querySelectorAll('ol > li').length } : null })(),
      processPage: (() => { const overview = document.querySelector('#process-overview-title')?.closest('section'); return overview ? { steps: overview.querySelectorAll('ol > li').length, detailSteps: document.querySelectorAll('[id^="process-step-"]').length } : null })(),
      languageAlternates: [...document.querySelectorAll('link[rel="alternate"]')].map(a => ({ lang: a.hreflang, href: a.href })),
      contactLinks: [...document.querySelectorAll('a[href$="/contact"]')].map(a => a.getAttribute('href'))
    })""")
    if response is None or response.status != 200:
        errors.append(f"HTTP status {response.status if response else 'no response'}")
    if metrics["scrollWidth"] > width:
        errors.append(f"horizontal overflow: {metrics['scrollWidth']} > {width}")
    if metrics["brokenImages"]:
        errors.append(f"broken images: {metrics['brokenImages']}")
    if route.endswith("/how-we-work") and metrics["processPage"] != {"steps": 9, "detailSteps": 9}:
        errors.append(f"unexpected process content: {metrics['processPage']}")
    if route in ("/en", "/ar") and (not metrics["processSection"] or metrics["processSection"]["steps"] != 9):
        errors.append(f"unexpected homepage process content: {metrics['processSection']}")
    return metrics, errors


async def main():
    output = ROOT / "screenshots" / "after"
    output.mkdir(parents=True, exist_ok=True)
    captures = []
    errors = []
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        for locale in ("en", "ar"):
            routes = [(f"/{locale}", width, "home") for width in HOME_WIDTHS]
            routes += [(f"/{locale}/how-we-work", width, "how-we-work") for width in WIDTHS]
            for route, width, group in routes:
                page = await browser.new_page(viewport={"width": width, "height": 1000}, device_scale_factor=1)
                page_errors = []
                page.on("pageerror", lambda error: page_errors.append(str(error)))
                metrics, check_errors = await inspect(page, route, width)
                await page.add_style_tag(content="nextjs-portal { display: none !important; }")
                file_name = f"{locale}-{width}.png"
                await page.screenshot(path=str(output / group / file_name), full_page=True)
                path = output / group / file_name
                path.parent.mkdir(parents=True, exist_ok=True)
                captures.append({"route": route, "viewportWidth": width, "group": group, "path": path.relative_to(ROOT).as_posix(), "bytes": path.stat().st_size, "sha256": hashlib.sha256(path.read_bytes()).hexdigest(), "metrics": metrics})
                if group == "home" and width in (1440, 390):
                    section = page.locator('section[aria-labelledby="how-we-work-home-title"]')
                    focused_path = output / "home-process" / f"{locale}-{width}.png"
                    focused_path.parent.mkdir(parents=True, exist_ok=True)
                    section_box = await section.evaluate("element => { const rect = element.getBoundingClientRect(); return { top: rect.top + window.scrollY, height: rect.height }; }")
                    with Image.open(path) as image:
                        top = round(section_box["top"])
                        height = round(section_box["height"])
                        image.crop((0, top, image.width, min(top + height, image.height))).save(focused_path)
                    captures.append({"route": route, "viewportWidth": width, "group": "home-process", "path": focused_path.relative_to(ROOT).as_posix(), "bytes": focused_path.stat().st_size, "sha256": hashlib.sha256(focused_path.read_bytes()).hexdigest(), "metrics": metrics})
                errors += [{"route": route, "viewportWidth": width, "error": error} for error in check_errors + page_errors]
                print(f"{route} {width}px: scroll={metrics['scrollWidth']} height={metrics['bodyHeight']} process={metrics['processPage'] or metrics['processSection']} errors={len(check_errors) + len(page_errors)}")
                await page.close()

        regression_routes = ["/en/about", "/ar/about", "/en/services", "/ar/services", "/en/portfolio", "/ar/portfolio", "/en/contact", "/ar/contact", "/en/projects/schooly", "/ar/projects/schooly", "/admin/login", "/admin/inquiries"]
        for route in regression_routes:
            page = await browser.new_page(viewport={"width": 1440, "height": 900})
            page_errors = []
            page.on("pageerror", lambda error: page_errors.append(str(error)))
            response = await page.goto(f"{BASE_URL}{route}", wait_until="domcontentloaded", timeout=45000)
            item = {"route": route, "status": response.status if response else None, "title": await page.title(), "scrollWidth": await page.evaluate("document.documentElement.scrollWidth"), "width": 1440, "pageErrors": page_errors}
            if item["status"] != 200 or item["scrollWidth"] > item["width"] or page_errors:
                errors.append({"route": route, "error": item})
            print(f"regression {route}: status={item['status']} overflow={item['scrollWidth'] > item['width']} errors={len(page_errors)}")
            await page.close()

        interactions = []
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        await page.goto(f"{BASE_URL}/en", wait_until="domcontentloaded")
        await page.wait_for_timeout(500)
        home_cta = await page.locator('a[href="/en/how-we-work"]').count()
        await page.get_by_role("button", name="Toggle navigation").click()
        await page.wait_for_function("document.querySelector('#navbarSupportedContent').classList.contains('show')")
        mobile_nav = await page.locator("#navbarSupportedContent").get_by_role("link", name="How We Work").get_attribute("href")
        await page.locator("#navbarSupportedContent").get_by_role("link", name="How We Work").click()
        await page.wait_for_function("!document.querySelector('#navbarSupportedContent').classList.contains('show')")
        await page.wait_for_timeout(400)
        mobile_closed = await page.get_by_role("button", name="Toggle navigation").get_attribute("aria-expanded") == "false"
        await page.get_by_role("button", name="Toggle navigation").click()
        await page.wait_for_function("document.querySelector('#navbarSupportedContent').classList.contains('show')")
        await page.locator(".language-switcher summary").click()
        arabic_switch = await page.locator('.language-switcher a[lang="ar"]').get_attribute("href")
        interactions += [{"check": "home CTA exists", "passed": home_cta > 0}, {"check": "mobile nav target", "passed": mobile_nav == "/en/how-we-work"}, {"check": "mobile menu closes after navigation", "passed": mobile_closed}, {"check": "locale switch preserves process route", "passed": arabic_switch == "/ar/how-we-work"}]
        await page.close()

        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        await page.goto(f"{BASE_URL}/en", wait_until="domcontentloaded")
        await page.wait_for_timeout(500)
        process_cta = page.locator('a[href="/en/how-we-work"]').last
        await process_cta.focus()
        focused = await process_cta.evaluate("element => element === document.activeElement")
        await page.keyboard.press("Enter")
        await page.wait_for_url("**/en/how-we-work")
        interactions.append({"check": "homepage process CTA supports keyboard activation", "passed": focused and page.url.endswith("/en/how-we-work")})
        await page.close()

        for locale in ("en", "ar"):
            page = await browser.new_page(viewport={"width": 768, "height": 900})
            await page.goto(f"{BASE_URL}/{locale}/how-we-work", wait_until="domcontentloaded")
            await page.wait_for_timeout(500)
            nav_current = await page.locator('.navbar-nav a[aria-current="page"]').get_attribute("href")
            contact_ctas = await page.locator(f'a[href="/{locale}/contact"]').count()
            first_faq = page.locator("main details").first
            await first_faq.locator("summary").click()
            faq_open = await first_faq.evaluate("element => element.open")
            metrics = await page.evaluate("""() => ({dir: document.documentElement.dir, lang: document.documentElement.lang, scrollWidth: document.documentElement.scrollWidth, width: innerWidth})""")
            interactions += [{"check": f"{locale} active How We Work nav", "passed": nav_current == f"/{locale}/how-we-work"}, {"check": f"{locale} Contact CTA", "passed": contact_ctas >= 2}, {"check": f"{locale} native FAQ disclosure", "passed": faq_open}, {"check": f"{locale} document direction", "passed": metrics["dir"] == ("rtl" if locale == "ar" else "ltr")}, {"check": f"{locale} page overflow", "passed": metrics["scrollWidth"] <= metrics["width"]}]
            await page.close()

        page = await browser.new_page(viewport={"width": 1280, "height": 900})
        await page.goto(f"{BASE_URL}/en/portfolio", wait_until="domcontentloaded")
        await page.wait_for_timeout(500)
        filter_buttons = page.locator('[role="group"][aria-label="Filter projects"] button')
        initial_cards = await page.locator(".project-showcase-card").count()
        await filter_buttons.nth(1).click()
        filtered_cards = await page.locator(".project-showcase-card").count()
        await page.wait_for_timeout(100)
        active_filter = await filter_buttons.nth(1).get_attribute("aria-pressed")
        interactions += [{"check": "portfolio filter remains interactive", "passed": filtered_cards > 0 and filtered_cards < initial_cards and active_filter == "true"}, {"check": "portfolio project cards remain present", "passed": initial_cards == 9}]
        await page.close()

        page = await browser.new_page(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
        await page.goto(f"{BASE_URL}/en", wait_until="domcontentloaded")
        motion = await page.locator("[aria-labelledby='how-we-work-home-title'] article").first.evaluate("e => ({property:getComputedStyle(e).transitionProperty, transform:getComputedStyle(e).transform})")
        interactions.append({"check": "reduced motion disables animation", "passed": motion["property"] == "none" and motion["transform"] == "none"})
        await page.close()
        await browser.close()

    manifest = {"generatedAt": "2026-10-19", "baseUrl": BASE_URL, "baselineHomeWidths": BASELINE_HOME_WIDTHS, "homeWidths": HOME_WIDTHS, "processWidths": WIDTHS, "captures": captures, "interactionChecks": interactions, "regressionRoutes": regression_routes, "errors": errors}
    (ROOT / "captures.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    (ROOT / "interaction-results.json").write_text(json.dumps(interactions, ensure_ascii=False, indent=2), encoding="utf-8")
    for item in interactions:
        if not item["passed"]:
            errors.append({"interaction": item})
    if errors:
        raise SystemExit(json.dumps(errors, ensure_ascii=False, indent=2))
    print(f"PASS: {len(captures)} screenshots, {len(interactions)} interaction checks, {len(regression_routes)} regression routes")


if __name__ == "__main__":
    asyncio.run(main())
