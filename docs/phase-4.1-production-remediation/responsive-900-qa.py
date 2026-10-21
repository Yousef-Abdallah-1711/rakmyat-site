"""Check every public route and admin shell at a 900 CSS-pixel viewport."""

import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
BASE = "http://127.0.0.1:5213"
WIDTH = 900
HEIGHT = 900
SLUGS = [
    "schooly", "nora-store", "edtech-platform", "live-workshop", "eduflow",
    "legal-translation", "gc-hardware", "concord-crm", "product-scraper",
]
PAGES = ["", "about", "services", "services/details", "how-we-work", "portfolio", "contact"]
ROUTES = [f"/{locale}/{page}" if page else f"/{locale}" for locale in ["en", "ar"] for page in PAGES]
ROUTES += [f"/{locale}/projects/{slug}" for locale in ["en", "ar"] for slug in SLUGS]
ROUTES += ["/admin/login", "/admin/inquiries"]

results = []
errors = []
menu_checks = []
capture_dir = ROOT / "docs" / "phase-4.1-production-remediation" / "screenshots" / "responsive-900"
capture_dir.mkdir(parents=True, exist_ok=True)

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT}, reduced_motion="reduce")
    page.on("pageerror", lambda error: errors.append({"type": "pageerror", "message": str(error)}))
    page.on("console", lambda message: errors.append({"type": "console", "message": message.text}) if message.type == "error" else None)

    for route in ROUTES:
        try:
            response = page.goto(BASE + route, wait_until="networkidle", timeout=30000)
            page.evaluate("""async () => {
              await document.fonts.ready;
              for (const image of document.images) image.loading = 'eager';
              await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
            }""")
            metrics = page.evaluate("""() => {
              const root = document.documentElement;
              const h1 = document.querySelector('main h1:not(.visually-hidden), h1:not(.visually-hidden)');
              const clipped = [];
              if (h1) {
                const clippingAncestors = [];
                for (let node = h1; node; node = node.parentElement) {
                  const style = getComputedStyle(node);
                  if ([style.overflowX, style.overflowY].some(value => value === 'hidden' || value === 'clip')) clippingAncestors.push(node.getBoundingClientRect());
                }
                const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
                let textNode;
                while ((textNode = walker.nextNode())) {
                  if (!textNode.textContent.trim()) continue;
                  const range = document.createRange();
                  range.selectNodeContents(textNode);
                  for (const rect of range.getClientRects()) for (const ancestor of clippingAncestors) {
                    if (rect.left < ancestor.left - 1 || rect.right > ancestor.right + 1 || rect.top < ancestor.top - 1 || rect.bottom > ancestor.bottom + 1) clipped.push(textNode.textContent.trim());
                  }
                }
              }
              const images = [...document.images].filter(image => image.currentSrc);
              const toggle = document.querySelector('.navbar-toggler');
              const toggleRect = toggle?.getBoundingClientRect();
              return {
                scrollWidth: root.scrollWidth,
                clientWidth: root.clientWidth,
                lang: root.lang,
                dir: root.dir,
                h1: h1?.innerText?.trim() ?? null,
                clippedHeadingText: [...new Set(clipped)],
                brokenImages: images.filter(image => image.complete && image.naturalWidth === 0).map(image => image.currentSrc),
                menuToggleVisible: !!toggle && getComputedStyle(toggle).display !== 'none' && toggleRect.width > 0,
                menuToggleSize: toggleRect ? {width: Math.round(toggleRect.width), height: Math.round(toggleRect.height)} : null,
                serviceCardCount: document.querySelectorAll('[data-service-card]').length,
                hasSelectedProjectsLabel: /selected projects/i.test(document.querySelector('[data-services-cards]')?.innerText ?? '')
              };
            }""")
            item = {"route": route, "width": WIDTH, "status": response.status if response else 0, **metrics}
            results.append(item)

            if route in ["/en", "/ar"]:
                page.screenshot(path=str(capture_dir / f"{route[1:]}-home.png"), animations="disabled")
            if route in ["/en", "/ar", "/en/services", "/ar/services"]:
                cards = page.locator("[data-services-cards]")
                if cards.count():
                    cards.screenshot(path=str(capture_dir / f"{route.strip('/').replace('/', '-')}-service-cards.png"), animations="disabled")

            if route in ["/en", "/ar", "/en/services", "/ar/services"] and metrics["menuToggleVisible"]:
                toggle = page.locator(".navbar-toggler")
                toggle.click()
                menu_checks.append({
                    "route": route,
                    "expanded": toggle.get_attribute("aria-expanded") == "true",
                    "navigationLinksVisible": page.locator("#navbarSupportedContent .navbar-nav .nav-link").first.is_visible(),
                    "touchTargetAtLeast44px": min(metrics["menuToggleSize"].values()) >= 44,
                })
                toggle.click()
        except Exception as error:
            results.append({"route": route, "width": WIDTH, "status": 0, "error": str(error)})

    browser.close()

report = {
    "baseUrl": BASE,
    "viewport": {"width": WIDTH, "height": HEIGHT},
    "generatedAt": "2026-10-19",
    "routeCount": len(ROUTES),
    "routes": ROUTES,
    "non200": [item for item in results if item.get("status") != 200],
    "horizontalOverflow": [item for item in results if item.get("scrollWidth", 0) > item.get("clientWidth", 0) + 1],
    "clippedHeadings": [item for item in results if item.get("clippedHeadingText")],
    "brokenImages": [item for item in results if item.get("brokenImages")],
    "badMenuChecks": [item for item in menu_checks if not all([item["expanded"], item["navigationLinksVisible"], item["touchTargetAtLeast44px"]])],
    "menuChecks": menu_checks,
    "selectedProjectLabels": [item["route"] for item in results if item.get("hasSelectedProjectsLabel")],
    "pageErrors": errors,
    "results": results,
}
output = ROOT / "docs" / "phase-4.1-production-remediation" / "responsive-900-qa.json"
output.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
summary = {key: (len(value) if isinstance(value, list) else value) for key, value in report.items() if key not in ["routes", "results", "menuChecks"]}
summary["menuCheckCount"] = len(menu_checks)
print(json.dumps(summary, ensure_ascii=False, indent=2))
