from __future__ import annotations

import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = os.environ.get("PHASE39_BASE_URL", "http://127.0.0.1:5201")


def main() -> None:
    outcomes = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        for locale in ("en", "ar"):
            page = browser.new_page()
            response = page.goto(f"{BASE_URL}/{locale}/contact", wait_until="networkidle")
            assert response and response.status == 200
            html = page.locator("html")
            assert html.get_attribute("lang") == locale
            assert html.get_attribute("dir") == ("rtl" if locale == "ar" else "ltr")
            assert page.get_by_role("heading", level=1).is_visible()

            form = page.locator("form.inquiry-form")
            field = lambda name: form.locator(f'[name="{name}"]')
            assert form.count() == 1
            assert page.locator(".inquiry-form input:not([name=website]), .inquiry-form textarea, .inquiry-form select").count() == 9
            assert field("fullName").get_attribute("required") is not None
            assert field("phone").get_attribute("required") is not None
            for optional in ("email", "company", "serviceType", "budget", "timeline", "description", "referenceUrl"):
                assert field(optional).get_attribute("required") is None

            assert field("phone").get_attribute("dir") == "ltr"
            assert field("email").get_attribute("dir") == "ltr"
            assert field("referenceUrl").get_attribute("dir") == "ltr"
            assert field("serviceType").evaluate("el => getComputedStyle(el).direction") == ("rtl" if locale == "ar" else "ltr")
            select_background_position = field("serviceType").evaluate("el => getComputedStyle(el).backgroundPosition")

            name = field("fullName")
            phone = field("phone")
            name.focus()
            page.keyboard.press("Tab")
            assert page.evaluate("document.activeElement.name") == "phone"
            page.keyboard.press("Shift+Tab")
            assert page.evaluate("document.activeElement.name") == "fullName"

            name.focus()
            page.keyboard.press("Tab")
            name.evaluate("el => el.blur()")
            assert name.get_attribute("aria-invalid") == "true"
            page.locator(".inquiry-field-error").first.wait_for(state="visible")
            assert page.locator(".inquiry-field-error").count() == 2
            name.fill("QA Contact User")
            phone.fill("01000000000")
            field("email").fill("bad-email")
            field("email").evaluate("el => el.blur()")
            assert field("email").get_attribute("aria-invalid") == "true"
            page.locator(".inquiry-field-error").last.wait_for(state="visible")
            field("email").fill("qa@example.invalid")
            field("referenceUrl").fill("not a URL")
            field("referenceUrl").evaluate("el => el.blur()")
            assert field("referenceUrl").get_attribute("aria-invalid") == "true"
            page.locator(".inquiry-field-error").last.wait_for(state="visible")
            field("referenceUrl").fill("https://example.invalid/reference")
            field("serviceType").select_option("website")
            field("budget").select_option("estimate")
            field("timeline").select_option("flexible")

            with page.expect_response(lambda item: item.url.endswith("/api/inquiries") and item.request.method == "POST") as request_info:
                page.locator('button[type="submit"]').click()
            api_status = request_info.value.status
            status = page.locator(".inquiry-status")
            assert api_status == 503, f"Expected configured test environment to reject persistence with 503, received {api_status}"
            assert status.get_attribute("role") == "alert"
            assert status.is_visible()
            assert "error" in (status.get_attribute("class") or "")
            assert field("fullName").input_value() == "QA Contact User"
            assert field("phone").input_value() == "01000000000"
            assert field("serviceType").input_value() == "website"
            assert field("budget").input_value() == "estimate"
            assert field("timeline").input_value() == "flexible"
            assert page.locator(".inquiry-status--success").count() == 0

            outcomes.append({
                "route": f"/{locale}/contact",
                "status": "passed",
                "requiredFields": ["fullName", "phone"],
                "optionalFields": 7,
                "direction": locale,
                "selectArrowPosition": select_background_position,
                "keyboardFocus": "passed",
                "invalidFeedback": "passed",
                "selectOptions": "passed",
                "apiStatus": api_status,
                "failurePreservesValues": True,
                "successNotClaimed": True,
            })
            page.close()
        browser.close()

    result = json.dumps(outcomes, ensure_ascii=False, indent=2) + "\n"
    (Path(__file__).resolve().parent / "form-interaction-results.json").write_text(result, encoding="utf-8")
    print(result)


if __name__ == "__main__":
    main()
