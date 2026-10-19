# Browser QA

Command: `CONTACT_QA_BASE_URL=http://127.0.0.1:5210 python docs/contact-security-hardening/browser_qa.py` (PowerShell uses `$env:CONTACT_QA_BASE_URL`). Browser: local Playwright Chromium, headless.

## Results

- Both `/en/contact` and `/ar/contact`: 200 at 1440, 1280, 768, 390, and 360 CSS pixels; 10/10 screenshots saved under [`screenshots/`](./screenshots/).
- Document scroll width equaled viewport width at each size; no horizontal overflow. No browser page errors.
- Rendered inquiry form bounds:

| Width | English form (W × H) | Arabic form (W × H) |
|---:|---:|---:|
| 1440 | 934 × 826 px | 934 × 804 px |
| 1280 | 934 × 826 px | 934 × 804 px |
| 768 | 668 × 826 px | 668 × 804 px |
| 390 | 322 × 1076 px | 322 × 1054 px |
| 360 | 292 × 1076 px | 292 × 1054 px |

- Confirmed exactly two required inputs; optional fields remain optional; phone input is `type=tel` with `inputmode=tel`; existing dropdown option counts and values work.
- Confirmed no errors before interaction, blur errors, live error clearing, accessible invalid-field description, submit summary, focus to first invalid field, Egyptian Arabic-Indic digits, and localized English/Arabic 429 messages. A mocked 429 retained name and phone.
- Direct API checks: unsupported media type 415, extra key 422, 17 KiB payload 413, unlisted Origin 403. A valid local-shaped request returned the expected fail-closed 503 with body `{"error":"service_unavailable"}` because the local DB/rate-limit secrets are absent.

The browser suite does not connect to PostgreSQL or SMTP. Screenshots are local review captures, not a production approval baseline.
