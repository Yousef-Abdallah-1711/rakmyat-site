from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parent
BASE_URL = os.environ.get("PHASE39_BASE_URL", "http://127.0.0.1:5201")
CONTACT_WIDTHS = [1440, 1280, 1024, 768, 390, 360]
REGRESSION_WIDTHS = [1440, 390]
CONTACT_ROUTES = ["/en/contact", "/ar/contact"]
REGRESSION_ROUTES = [
    "/en", "/ar", "/en/about", "/ar/about", "/en/services", "/ar/services",
    "/en/portfolio", "/ar/portfolio",
]


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    group = "after" if __import__("sys").argv[1:] == ["after"] else "before"
    output = ROOT / "screenshots" / group
    output.mkdir(parents=True, exist_ok=True)
    results = []
    metrics = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(device_scale_factor=1, reduced_motion="reduce")
        for route in CONTACT_ROUTES + REGRESSION_ROUTES:
            widths = CONTACT_WIDTHS if route in CONTACT_ROUTES else REGRESSION_WIDTHS
            for width in widths:
                page.set_viewport_size({"width": width, "height": 1000})
                response = page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
                assert response and response.status == 200, f"{route} returned {response.status if response else 'no response'}"
                page.evaluate("document.fonts.ready")
                page.wait_for_timeout(250)
                filename = f"{route.strip('/').replace('/', '-')}-{width}.png"
                path = output / filename
                page.screenshot(path=str(path), full_page=True, animations="disabled")
                results.append({
                    "route": route,
                    "viewportWidth": width,
                    "path": str(path.relative_to(ROOT)).replace("\\", "/"),
                    "status": response.status if response else None,
                    "bytes": path.stat().st_size,
                    "sha256": digest(path),
                })
                if route in CONTACT_ROUTES:
                    metrics.append(page.evaluate("""() => {
                      const rect = (node) => {
                        if (!node) return null;
                        const r = node.getBoundingClientRect();
                        return {x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height)};
                      };
                      return {
                        viewportWidth: innerWidth,
                        documentWidth: document.documentElement.scrollWidth,
                        pageHeading: rect(document.querySelector('main h1')),
                        headingClipped: (() => { const h = document.querySelector('main h1'); return h.scrollWidth > h.clientWidth + 1; })(),
                        formPanel: rect(document.querySelector('.inquiry-panel')),
                        firstInput: rect(document.querySelector('.inquiry-form input:not([type=hidden])')),
                        secondInput: rect(document.querySelector('.inquiry-form [name=phone]')),
                        submitButton: rect(document.querySelector('.inquiry-form button[type=submit]')),
                        selectDirection: getComputedStyle(document.querySelector('.inquiry-form select')).direction,
                        selectBackgroundPosition: getComputedStyle(document.querySelector('.inquiry-form select')).backgroundPosition,
                        fields: document.querySelectorAll('.inquiry-form input:not([name=website]), .inquiry-form textarea, .inquiry-form select').length,
                      };
                    }"""))
                    metrics[-1].update({"route": route})
                    assert metrics[-1]["documentWidth"] == width, f"Horizontal overflow at {route} {width}px"
                    assert not metrics[-1]["headingClipped"], f"Heading clipped at {route} {width}px"
                    assert metrics[-1]["fields"] == 9, f"Form fields changed at {route} {width}px"
        browser.close()

    manifest = {
        "phase": "3.9-contact-only",
        "group": group,
        "baseUrl": BASE_URL,
        "contactViewportWidths": CONTACT_WIDTHS,
        "regressionViewportWidths": REGRESSION_WIDTHS,
        "captureCount": len(results),
        "captures": results,
        "contactDomMetrics": metrics,
    }
    (ROOT / f"{group}-captures.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"group": group, "captureCount": len(results), "metrics": metrics}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
