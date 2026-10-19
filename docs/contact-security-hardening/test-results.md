# Test results

Verified on 2026-10-19 in `next-app/`:

| Command | Result |
|---|---|
| `npm.cmd run typecheck` | Passed. |
| `npm.cmd run lint` | Passed. |
| `npm.cmd test` | Passed: 11 tests, 0 failures. Includes phone normalization/invalid cases, required/optional rules, Arabic and English names, strict enums/keys, SQL-looking literal text, Origin matching, trusted-header IP parsing, limit parsing, and retry calculation. |
| `python docs/contact-security-hardening/browser_qa.py` | Passed: 17 browser/API checks; 10 responsive screenshots. See [browser QA](./browser-qa.md) and machine results. |
| `npm.cmd run build` | Passed: Next.js 16.4.2 optimized production build compiled and generated all application routes. |

## Not executed against external state

No local database URL, rate-limit HMAC secret, or SMTP credentials were available. No database migration, record insertion, true duplicate-request integration, concurrent PostgreSQL rate-limit load, admin-backed read, or SMTP delivery test was run. These are not represented as passing. Mocked policy tests validate retry calculations and header/origin rules; they do not substitute for an isolated PostgreSQL concurrency test.
