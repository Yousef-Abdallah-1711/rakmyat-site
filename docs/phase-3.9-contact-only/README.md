# Phase 3.9 — Contact page refinement

Status: implemented and validated locally; not deployed. Scope is limited to `/en/contact` and `/ar/contact`.

The Contact page now uses a branded blue-gradient hero, visible page heading, responsive inquiry card, styled fields and focus/error feedback, and a localized RTL layout. The existing nine fields, requiredness, select values, API route, request payload, validation, and submission behavior remain in place.

## Validation

- `npm.cmd run typecheck` — passed.
- `npm.cmd run lint` — passed.
- `npm.cmd test` — passed, 4 tests.
- `npm.cmd run build` — passed.
- Responsive browser capture — 28/28 routes and viewport combinations returned HTTP 200; Contact passed overflow and heading-clipping checks.
- Contact form browser interaction checks — passed in English and Arabic. Persistence returned 503 as expected without local database/rate-limit configuration; no false success was shown.

## Evidence

- [Design audit](./contact-design-audit.md)
- [Changed-file allowlist](./modified-files.md)
- [Responsive QA and dimensions](./responsive-qa.md)
- [Form interaction results](./form-interaction-tests.md)
- [Visual regression](./visual-regression.md)
- [Before captures](./before-captures.json) · [after captures](./after-captures.json)
- [Form interaction JSON](./form-interaction-results.json)
- [Capture script](./capture-qa.py) · [form QA script](./form-interactions.py)

Screenshots are under [`screenshots/before/`](./screenshots/before/) and [`screenshots/after/`](./screenshots/after/). Each group has 12 Contact captures (two locales × six widths) and 16 non-Contact regression references (four pages × two locales × desktop and mobile widths).

## Reproduce QA

From `next-app/`, build and start the app on port 5201, then run:

```powershell
$env:PHASE39_BASE_URL = 'http://127.0.0.1:5201'
python docs/phase-3.9-contact-only/capture-qa.py after
python docs/phase-3.9-contact-only/form-interactions.py
```

The saved `before/` captures are the pre-Phase 3.9 baseline. Do not overwrite them with the after implementation.

## Preview

- English Contact: <http://127.0.0.1:5201/en/contact>
- Arabic Contact: <http://127.0.0.1:5201/ar/contact>

The configured local API rejects submissions with HTTP 503 because the database and rate-limit secrets are not configured. The form correctly shows an error and retains entered values; no successful persistence is claimed.
