# Form interaction tests

Automated browser checks ran on `/en/contact` and `/ar/contact` against the production build. Results are saved in [`form-interaction-results.json`](./form-interaction-results.json) and can be rerun with [`form-interactions.py`](./form-interactions.py).

| Check | English | Arabic |
|---|---|---|
| Page locale and direction | Pass, `en` / LTR | Pass, `ar` / RTL |
| Visible page heading and one inquiry form | Pass | Pass |
| Nine fields; full name and phone required, seven fields optional | Pass | Pass |
| Phone, email, and URL inputs stay LTR | Pass | Pass |
| Select direction and arrow placement | Pass, right edge | Pass, left edge |
| Keyboard focus moves between required fields | Pass | Pass |
| Required name/phone and malformed email/URL show field errors | Pass | Pass |
| Service, budget, and timeline option selection | Pass | Pass |
| API rejection announces an error and keeps entered values | Pass | Pass |
| Success is not shown when persistence is rejected | Pass | Pass |

The API returned **503** in both locales because this local environment has no `DATABASE_URL` or `RATE_LIMIT_SECRET`. This is the expected unavailable-backend path. No database delivery, notification, or successful submission was simulated or claimed.

`npm.cmd test` also passed all four existing schema tests, including required/optional fields and stable localized option keys. No backend or schema code was modified.
