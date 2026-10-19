from __future__ import annotations

import hashlib
import json
import os
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parent
BASE_URL = os.environ.get("PHASE311_BASE_URL", "http://127.0.0.1:5202")
WIDTHS = [1440, 1280, 1024, 768, 390, 360]
ROUTES = ["/en", "/ar"]


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

        for route in ROUTES:
            for width in WIDTHS:
                page.set_viewport_size({"width": width, "height": 1000})
                response = page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
                if not response or response.status != 200:
                    raise AssertionError(f"{route} at {width}px returned {response.status if response else 'no response'}")
                page.evaluate("document.fonts.ready")
                page.wait_for_timeout(150)
                locale = route.strip("/")
                filename = f"{locale}-{width}.png"
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
                if group == "after":
                    metrics = page.evaluate("""() => {
                      const rect = (el) => { const r = el.getBoundingClientRect(); return {width: Math.round(r.width), height: Math.round(r.height)}; };
                      const cards = [...document.querySelectorAll('[data-service-card]')];
                      const imgs = [...document.querySelectorAll('[data-service-card] img')];
                      const heading = document.querySelector('[data-home-services] h2');
                      const links = [...document.querySelectorAll('[data-service-card] a[data-project-link]')];
                      return {
                        documentWidth: document.documentElement.scrollWidth,
                        viewportWidth: innerWidth,
                        cardCount: cards.length,
                        cards: cards.map((card) => ({id: card.getAttribute('data-service-card'), ...rect(card)})),
                        columns: new Set(cards.map((card) => Math.round(card.getBoundingClientRect().y))).size === 1 ? cards.length : Math.ceil(cards.length / new Set(cards.map((card) => Math.round(card.getBoundingClientRect().y))).size),
                        imagesLoaded: imgs.length === 5 && imgs.every((img) => img.complete && img.naturalWidth > 0),
                        headingClipped: !!heading && heading.scrollWidth > heading.clientWidth + 1,
                        direction: getComputedStyle(document.querySelector('[data-services-cards]')).direction,
                        projectLinkCount: links.length,
                        linksKeyboardAccessible: links.every((link) => link.tabIndex >= 0),
                        textOverflowCount: [...document.querySelectorAll('[data-service-card] h3, [data-service-card] p, [data-service-card] li span:last-child, [data-service-card] a[data-project-link]')].filter((el) => el.scrollWidth > el.clientWidth + 1).length,
                      };
                    }""")
                    expected_columns = 5 if width >= 1200 else 3 if width >= 901 else 2 if width >= 621 else 1
                    metrics.update({"route": route, "viewportWidth": width, "expectedColumns": expected_columns})
                    measurements.append(metrics)
                    if metrics["documentWidth"] != width:
                        raise AssertionError(f"Horizontal overflow at {route} {width}px")
                    if metrics["cardCount"] != 5 or not metrics["imagesLoaded"]:
                        raise AssertionError(f"Missing cards or illustrations at {route} {width}px")
                    if metrics["columns"] != expected_columns:
                        raise AssertionError(f"Unexpected {metrics['columns']} columns at {route} {width}px")
                    if metrics["headingClipped"] or metrics["textOverflowCount"]:
                        raise AssertionError(f"Clipped or overflowing text at {route} {width}px")
                    if not metrics["linksKeyboardAccessible"]:
                        raise AssertionError(f"Project links are not keyboard accessible at {route} {width}px")
                    if route == "/ar" and metrics["direction"] != "rtl":
                        raise AssertionError(f"Arabic cards are not RTL at {width}px")
                    if width == 1440:
                        for link in page.locator('[data-service-card] a[data-project-link]').all():
                            href = link.get_attribute("href")
                            link_response = page.request.get(f"{BASE_URL}{href}")
                            if link_response.status != 200:
                                raise AssertionError(f"Project link {href} returned {link_response.status}")

        browser.close()

    manifest = {
        "phase": "3.11-home-services",
        "group": group,
        "baseUrl": BASE_URL,
        "routes": ROUTES,
        "viewportWidths": WIDTHS,
        "captureCount": len(captures),
        "captures": captures,
        "measurements": measurements,
        "consoleErrors": console_errors,
    }
    (ROOT / f"{group}-captures.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"group": group, "captureCount": len(captures), "measurements": measurements, "consoleErrors": console_errors}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
