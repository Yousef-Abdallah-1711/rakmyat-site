# 09 — Contact, admin, and cache security

Contact `POST /api/inquiries` remains dynamic and returns no-store responses. It applies same-origin checks, request size and field validation, idempotency keys and rate limiting. A controlled request with an allowed local origin was accepted (201); a request with an untrusted origin was rejected (403). The form's page HTML remains static.

Admin login requires same-origin POST and a valid account. The temporary test account authenticated successfully; the authenticated inquiry API returned 200 with `Cache-Control: private, no-store, max-age=0`. The same endpoint without a session returned 401 and no-store. Admin login page also returned private/no-store. Test credentials and cookies were temporary and are not in repository files.

Health and internal worker handlers remain dynamic and no-store. CDN rules must never cache private/admin/API responses or any request that can set/consume cookies. Keep trusted client IP headers restricted to the proxy boundary; test direct-origin access before production.
