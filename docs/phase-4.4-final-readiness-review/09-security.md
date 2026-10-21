# Security

Live staging returns `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and restrictive `Permissions-Policy`; `X-Powered-By` is disabled by config. Admin inquiry API returns 401 without session. Phase 4.3 documents origin/Host tampering 403, rate limit 429, parameterized search, private no-store admin responses, session cookie flags, and internal outbox authorization. These are local staging checks, not independent penetration testing.

CSP and HSTS are not configured; HSTS depends on approved HTTPS termination/domain. Trusted production origins/proxy values, production secrets, dependency monitoring, centralized logging/alerting, and deployment controls remain unconfigured or not verified. No destructive testing or customer data was used.
