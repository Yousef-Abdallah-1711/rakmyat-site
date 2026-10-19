# Inquiry API behavior

| Condition | Status | Client behavior |
|---|---:|---|
| Missing, malformed, or unlisted Origin | 403 | Generic error; entered values retained. |
| Unsupported media type | 415 | Generic error. |
| Invalid JSON | 400 | Generic error. |
| Body exceeds 16 KiB | 413 | Generic error. |
| Invalid field, unknown key, manipulated enum, or filled honeypot | 422 | Field errors where available; no inquiry is written. |
| Limit exceeded | 429 + `Retry-After` | Localized rate-limit message; values retained. |
| Database, HMAC secret, or rate-limit configuration unavailable | 503 | Generic error; values retained; no success claim. |
| New record committed | 201 | Success shown after persistence; notification status does not claim delivery. |
| Existing idempotency key | 200 | Same record returned; no additional outbox entry or email attempt. |

All JSON responses use `Cache-Control: no-store`. Database exceptions are caught and replaced with a generic response. The route does not disclose whether a phone/email exists.

Production Origin allowlisting must be explicitly configured. Development mode without that setting only permits matching loopback origins on the same protocol and port, accounting for Next's local `localhost`/`127.0.0.1` host normalization.
