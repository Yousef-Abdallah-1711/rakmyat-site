# Contact security hardening

Status: implemented locally, browser checked, and build-ready; not deployed. Scope covers the contact inquiry form, inquiry API, shared rate-limit IP identity used by admin login, and safe rendering of inquiry reference links in the admin view.

## Results

- Shared client/server schemas validate names, phone numbers, optional values, allowlisted selects, exact payload keys, and safe HTTP(S) URLs.
- Phone numbers are normalized to E.164; Egyptian numbers must be valid mobile numbers. Arabic-Indic and Eastern Arabic-Indic digits are accepted.
- PostgreSQL enforces two atomic per-client windows: 3 requests / 15 minutes and 10 requests / 24 hours by default. HTTP 429 includes `Retry-After`; store/configuration failures fail closed with HTTP 503.
- The API requires a permitted Origin, JSON content type, a 16 KiB request limit, strict payload shape, a honeypot, and a UUID idempotency key.
- Existing parameterized PostgreSQL statements, inquiry transaction, unique idempotency key, notification outbox, and admin workflow are retained.
- Contact design and field set are retained. Name and phone remain the only required fields.

## Validation and evidence

- [Security audit](./security-audit.md)
- [Validation rules](./validation-rules.md)
- [SQL and display safety](./sql-and-display-safety.md)
- [Rate-limit architecture and deployment settings](./rate-limit-architecture.md)
- [API behavior](./api-responses.md)
- [Test results and limits](./test-results.md)
- [Browser QA](./browser-qa.md), [machine results](./browser-qa-results.json), and [10 screenshots](./screenshots/)
- [Changed files](./changed-files.md)
- [Remaining limitations](./remaining-limitations.md)

## Reproduce

From `next-app/`, start the local app on port 5210, then run:

```powershell
$env:CONTACT_QA_BASE_URL = 'http://127.0.0.1:5210'
python docs/contact-security-hardening/browser_qa.py
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

Local valid submissions return HTTP 503 because no database and rate-limit secrets are configured. The form retains values and reports an error. No inquiry storage, notification delivery, or PostgreSQL concurrency result is claimed from this environment.

## Local preview

- English: <http://127.0.0.1:5210/en/contact>
- Arabic: <http://127.0.0.1:5210/ar/contact>

Production requires the environment settings described in [rate-limit architecture](./rate-limit-architecture.md). Do not deploy until the hosting proxy identity and allowed origins are set and verified, the idempotent database migration has run, and isolated database/SMTP integration checks pass.
