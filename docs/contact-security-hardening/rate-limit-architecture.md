# Rate-limit architecture and deployment settings

## Enforcement

The existing `rate_limit_buckets` PostgreSQL table is used as the shared store. Each inquiry request increments two distinct HMAC-derived buckets using atomic `INSERT ... ON CONFLICT DO UPDATE` statements:

- `INQUIRY_RATE_LIMIT_15M_MAX=3`, for a 900-second window.
- `INQUIRY_RATE_LIMIT_24H_MAX=10`, for an 86,400-second window.

Both windows are checked before inserting an inquiry. If either window exceeds its limit, the API returns 429 and sets `Retry-After` to the longest active reset time. Database errors or invalid limit configuration fail closed with 503. No in-memory map is used. Old bucket rows are deleted when older than two days; an index supports this cleanup. Limits are per observed client IP and are operational defaults, not a guarantee against distributed abuse.

The stored bucket key is an HMAC digest, not a raw IP address. `RATE_LIMIT_SECRET` must be a unique secret of at least 32 characters and must remain stable across instances. Rotating it resets active bucket identities.

## Required production configuration

- `DATABASE_URL`: production PostgreSQL connection string; run the existing idempotent migration before serving traffic so the cleanup index exists.
- `RATE_LIMIT_SECRET`: unique random 32+ character secret, provided only through the hosting secret store.
- `CONTACT_ALLOWED_ORIGINS`: comma-separated exact origin values, e.g. `https://example.com,https://www.example.com`. Do not include paths or wildcards. The route rejects missing and unlisted Origins.
- `TRUSTED_CLIENT_IP_HEADER`: the exact header name the hosting proxy overwrites with one validated client IP. Set this only after confirming the platform's behavior end to end. Never trust a value supplied or appended by a browser or an untrusted upstream proxy. Header values containing a forwarding list or invalid IP are rejected. If no trusted header is available, request handling fails closed with 503.
- `INQUIRY_RATE_LIMIT_15M_MAX` and `INQUIRY_RATE_LIMIT_24H_MAX`: positive integers (defaults 3 and 10; supported range 1–10,000).

Local development uses a fixed loopback identity only when production mode is off and no trusted-IP header is configured. It never falls back to a client-supplied forwarding header. Local valid POSTs still fail closed when the rate-limit/database secret or PostgreSQL store is unavailable.

This workspace did not establish which hosting proxy will be used. Do not set `TRUSTED_CLIENT_IP_HEADER` by guesswork. Verify that the selected platform strips/overwrites the chosen header and test requests with forged forwarding headers in an isolated deployment.
