# Security and contact review

Next config now disables the `X-Powered-By` header and adds `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive `Permissions-Policy`. Admin responses are verified `private, no-store`; unauthenticated admin API requests return 401. Existing request validation, exact origin policy, configured proxy/IP handling, rate limiting, and parameterized database writes were not relaxed.

No database, production origin allowlist, secrets, SMTP service, or recipient delivery was configured in the isolated preview. Contact submissions therefore returned 403 and kept entered values while displaying an error; no successful delivery was shown. This is the correct local result, not a production contact test. Configure a real database and migrations, secrets, exact trusted origins, rate limiting, SMTP/outbox, retry/monitoring, then verify test-message delivery and retention controls in a production-like environment.

CSP and HSTS were not enabled: CSP compatibility with inline/third-party theme behavior and HTTPS termination/HSTS ownership must be tested against the selected host first. Headers do not replace platform configuration, dependency review, or incident operations.
