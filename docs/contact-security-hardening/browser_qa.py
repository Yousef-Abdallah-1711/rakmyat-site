from __future__ import annotations

import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright


BASE_URL = os.environ.get("CONTACT_QA_BASE_URL", "http://127.0.0.1:5210")
ROOT = Path(__file__).parent
SHOTS = ROOT / "screenshots"
WIDTHS = (1440, 1280, 768, 390, 360)


def main() -> None:
    outcomes = []
    SHOTS.mkdir(exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        for locale in ("en", "ar"):
            for width in WIDTHS:
                page = browser.new_page(viewport={"width": width, "height": 1000}, device_scale_factor=1)
                errors = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                response = page.goto(f"{BASE_URL}/{locale}/contact", wait_until="networkidle")
                assert response and response.status == 200, (locale, width, response.status if response else None)
                assert page.locator("html").get_attribute("lang") == locale
                assert page.locator("html").get_attribute("dir") == ("rtl" if locale == "ar" else "ltr")
                form = page.locator("form.inquiry-form")
                assert form.count() == 1
                assert form.locator('[name="fullName"]').get_attribute("required") is not None
                assert form.locator('[name="phone"]').get_attribute("required") is not None
                assert form.locator('[name="phone"]').get_attribute("inputmode") == "tel"
                for optional in ("email", "company", "serviceType", "budget", "timeline", "description", "referenceUrl"):
                    assert form.locator(f'[name="{optional}"]').get_attribute("required") is None, optional
                dimensions = page.evaluate("""() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth,
                    form: (() => { const r = document.querySelector('form.inquiry-form').getBoundingClientRect(); return { width: Math.round(r.width), height: Math.round(r.height) }; })() })""")
                assert dimensions["document"] <= dimensions["viewport"], (locale, width, dimensions)
                assert page.locator('[name="serviceType"] option').count() == 7
                page.screenshot(path=str(SHOTS / f"{locale}-{width}.png"), full_page=True)

                name = form.locator('[name="fullName"]')
                phone = form.locator('[name="phone"]')
                await_error = form.locator(".inquiry-field-error")
                assert await_error.count() == 0
                form.locator('button[type="submit"]').click()
                assert page.evaluate("document.activeElement?.getAttribute('name')") == "fullName"
                assert form.locator('div[role="alert"].col-12').is_visible()
                assert name.get_attribute("aria-describedby")
                assert await_error.count() == 2
                name.fill(" ")
                name.blur()
                assert await_error.count() == 2
                assert name.get_attribute("aria-invalid") == "true"
                name.fill("أحمد علي" if locale == "ar" else "Sam Miller")
                assert await_error.count() == 1
                phone.fill("٠١٠١٢٣٤٥٦٧٨")
                phone.blur()
                assert await_error.count() == 0
                assert phone.get_attribute("aria-invalid") == "false"
                page.locator('[name="serviceType"]').select_option("website")
                assert page.locator('[name="serviceType"]').input_value() == "website"
                if width == 1440:
                    name.fill("Sam Miller" if locale == "en" else "أحمد علي")
                    phone.fill("01012345678" if locale == "en" else "٠١٠١٢٣٤٥٦٧٨")
                    page.route("**/api/inquiries", lambda route: route.fulfill(status=429, headers={"Retry-After": "60"}, json={"error": "rate_limited"}))
                    form.locator('button[type="submit"]').click()
                    rate_message = "Too many attempts. Please wait before trying again." if locale == "en" else "تكررت محاولات الإرسال. يرجى الانتظار قليلًا قبل المحاولة مجددًا."
                    assert page.get_by_text(rate_message).is_visible()
                    assert name.input_value() == ("Sam Miller" if locale == "en" else "أحمد علي")
                    assert phone.input_value() == ("01012345678" if locale == "en" else "٠١٠١٢٣٤٥٦٧٨")
                    outcomes.append({"browserCase": "localized-rate-limit-message-and-retained-values", "locale": locale, "status": 429, "passed": True})
                outcomes.append({"locale": locale, "width": width, "status": response.status, "dimensions": dimensions, "overflow": False, "consolePageErrors": errors})
                assert not errors, errors
                page.close()

        # API checks use an exact local Origin and do not require database access for early rejection paths.
        request = playwright.request.new_context(extra_http_headers={"Origin": BASE_URL})
        api_cases = [
            ("wrong-content-type", {"data": "{}", "headers": {"Content-Type": "text/plain"}}, 415),
            ("unknown-field", {"data": {"fullName": "Test Client", "phone": "+12133734253", "idempotencyKey": "d6d78945-53c8-432e-8fe5-ed99b067cb44", "unexpected": True}}, 422),
            ("oversized-body", {"data": "{" + "x" * 17000 + "}", "headers": {"Content-Type": "application/json"}}, 413),
        ]
        for label, options, expected in api_cases:
            result = request.post(f"{BASE_URL}/api/inquiries", **options)
            assert result.status == expected, (label, result.status, result.text()[:200])
            outcomes.append({"apiCase": label, "status": result.status})
        fail_closed = request.post(f"{BASE_URL}/api/inquiries", data={"fullName": "Test Client", "phone": "+12133734253", "idempotencyKey": "d6d78945-53c8-432e-8fe5-ed99b067cb44", "website": ""})
        assert fail_closed.status == 503
        assert "database" not in fail_closed.text().lower() and "secret" not in fail_closed.text().lower()
        outcomes.append({"apiCase": "valid-payload-fails-closed-without-local-secrets", "status": fail_closed.status, "safeErrorBody": fail_closed.json()})
        untrusted = playwright.request.new_context(extra_http_headers={"Origin": "https://attacker.example"})
        rejected = untrusted.post(f"{BASE_URL}/api/inquiries", data={"fullName": "Test", "phone": "01012345678", "idempotencyKey": "d6d78945-53c8-432e-8fe5-ed99b067cb44"})
        assert rejected.status == 403
        outcomes.append({"apiCase": "cross-origin", "status": rejected.status})
        request.dispose()
        untrusted.dispose()
        browser.close()
    (ROOT / "browser-qa-results.json").write_text(json.dumps({"baseUrl": BASE_URL, "widths": WIDTHS, "results": outcomes}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"screenshots": len(WIDTHS) * 2, "checks": len(outcomes), "api": outcomes[-5:]}, indent=2))


if __name__ == "__main__":
    main()
