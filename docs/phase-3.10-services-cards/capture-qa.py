from __future__ import annotations

import hashlib
import json
import os
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parent
BASE_URL = os.environ.get("PHASE310_BASE_URL", "http://127.0.0.1:5201")
WIDTHS = [1440, 1280, 1024, 768, 390, 360]
ROUTES = ["/en/services", "/ar/services"]
REGRESSION_ROUTES = [
    "/en", "/ar", "/en/about", "/ar/about", "/en/contact", "/ar/contact",
    "/en/portfolio", "/ar/portfolio", "/en/projects/schooly", "/ar/projects/schooly",
]
REGRESSION_WIDTHS = [1440, 390]


def main() -> None:
    group = sys.argv[1] if len(sys.argv) > 1 else "after"
    if group not in {"before", "after"}:
        raise SystemExit("Usage: python capture-qa.py [before|after]")
    output = ROOT / "screenshots" / group
    output.mkdir(parents=True, exist_ok=True)
    captures = []
    measurements = []
    console_errors: list[dict[str, str]] = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(device_scale_factor=1, reduced_motion="reduce")
        page.on("console", lambda message: console_errors.append({"type": message.type, "text": message.text}) if message.type == "error" else None)
        page.on("pageerror", lambda error: console_errors.append({"type": "pageerror", "text": str(error)}))

        for route, widths in [(route, WIDTHS) for route in ROUTES] + [(route, REGRESSION_WIDTHS) for route in REGRESSION_ROUTES]:
            for width in widths:
                page.set_viewport_size({"width": width, "height": 1000})
                response = page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
                if not response or response.status != 200:
                    raise AssertionError(f"{route} at {width}px returned {response.status if response else 'no response'}")
                page.evaluate("document.fonts.ready")
                page.wait_for_timeout(200)
                slug = route.strip("/").replace("/", "-")
                filename = f"{slug}-{width}.png"
                path = output / filename
                page.screenshot(path=str(path), full_page=True, animations="disabled")
                captures.append({
                    "route": route,
                    "viewportWidth": width,
                    "path": f"screenshots/{group}/{filename}",
                    "bytes": path.stat().st_size,
                    "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                    "status": response.status,
                })
                if group == "after" and route in ROUTES:
                    metrics = page.evaluate("""() => {
                      const rect = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return {x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height)}; };
                      const cards = [...document.querySelectorAll('[data-service-card]')];
                      const images = [...document.querySelectorAll('[data-service-card] img')];
                      return {
                        documentWidth: document.documentElement.scrollWidth,
                        viewportWidth: window.innerWidth,
                        cardCount: cards.length,
                        uniqueCardIds: new Set(cards.map((card) => card.getAttribute('data-service-card'))).size,
                        cards: cards.map((card) => ({id: card.getAttribute('data-service-card'), ...rect(card)})),
                        imagesLoaded: images.every((image) => image.complete && image.naturalWidth > 0),
                        imageCount: images.length,
                        brokenImageCount: images.filter((image) => !image.complete || image.naturalWidth === 0).length,
                        headingClipped: (() => { const heading = document.querySelector('[data-services-intro] h2'); return !!heading && heading.scrollWidth > heading.clientWidth + 1; })(),
                        direction: getComputedStyle(document.querySelector('[data-services-cards]')).direction,
                        projectLinkCount: document.querySelectorAll('[data-service-card] a[data-project-link]').length,
                        projectLinksKeyboardAccessible: [...document.querySelectorAll('[data-service-card] a[data-project-link]')].every((link) => link.tabIndex >= 0),
                        textOverflowCount: [...document.querySelectorAll('[data-service-card] h3, [data-service-card] p, [data-service-card] li span:last-child, [data-service-card] a[data-project-link]')].filter((el) => el.scrollWidth > el.clientWidth + 1).length,
                        rowCount: new Set(cards.map((card) => Math.round(card.getBoundingClientRect().y))).size,
                      };
                    }""")
                    metrics["route"] = route
                    metrics["viewportWidth"] = width
                    metrics["expectedColumns"] = 5 if width >= 1200 else 3 if width >= 901 else 2 if width >= 621 else 1
                    metrics["actualColumns"] = 5 if metrics["rowCount"] == 1 else min(metrics["cardCount"], metrics["cardCount"] // metrics["rowCount"] + (1 if metrics["cardCount"] % metrics["rowCount"] else 0))
                    measurements.append(metrics)
                    if metrics["documentWidth"] != width:
                        raise AssertionError(f"Horizontal overflow at {route} {width}px: {metrics['documentWidth']}")
                    if metrics["cardCount"] != 5 or metrics["uniqueCardIds"] != 5:
                        raise AssertionError(f"Expected exactly five unique cards at {route} {width}px, got {metrics['cardCount']}/{metrics['uniqueCardIds']}")
                    if metrics["imageCount"] != 5 or not metrics["imagesLoaded"]:
                        raise AssertionError(f"Service illustrations did not all load at {route} {width}px")
                    if metrics["headingClipped"]:
                        raise AssertionError(f"Services heading clipped at {route} {width}px")
                    if metrics["actualColumns"] != metrics["expectedColumns"]:
                        raise AssertionError(f"Unexpected grid columns at {route} {width}px: {metrics['actualColumns']} (expected {metrics['expectedColumns']})")
                    if metrics["textOverflowCount"]:
                        raise AssertionError(f"Text overflow at {route} {width}px: {metrics['textOverflowCount']} elements")
                    if not metrics["projectLinksKeyboardAccessible"]:
                        raise AssertionError(f"Project links are not keyboard accessible at {route} {width}px")
                    if route.startswith("/ar") and metrics["direction"] != "rtl":
                        raise AssertionError(f"Arabic cards are not RTL at {width}px")
                    if width == 1440:
                        for link in page.locator('[data-service-card] a[data-project-link]').all():
                            href = link.get_attribute("href")
                            link_response = page.request.get(f"{BASE_URL}{href}")
                            if link_response.status != 200:
                                raise AssertionError(f"Project link {href} returned {link_response.status}")

        browser.close()

    manifest = {
        "phase": "3.10-services-cards",
        "group": group,
        "baseUrl": BASE_URL,
        "routes": ROUTES,
        "viewportWidths": WIDTHS,
        "regressionRoutes": REGRESSION_ROUTES,
        "regressionViewportWidths": REGRESSION_WIDTHS,
        "captureCount": len(captures),
        "captures": captures,
        "measurements": measurements,
        "consoleErrors": console_errors,
    }
    (ROOT / f"{group}-captures.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"group": group, "captureCount": len(captures), "measurements": measurements, "consoleErrors": console_errors}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
