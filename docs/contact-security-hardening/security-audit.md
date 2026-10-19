# Security audit and fixes

## Issues found

1. The prior phone rule accepted almost any seven-to-32-character string of digits and punctuation; it did not validate numbering plans or normalize storage.
2. Client validation duplicated different, weaker rules and offered limited error timing and feedback.
3. The inquiry route trusted the first arbitrary `X-Forwarded-For` item, had no inquiry-specific allowed-Origin check, accepted JSON media types by substring, and used a single 5-per-15-minute limit.
4. The payload schema silently stripped unrecognized keys instead of rejecting them.
5. Stored legacy reference URLs were rendered as clickable links without scheme validation in the admin interface.

## Implemented controls

- One shared Zod schema and maintained `libphonenumber-js` max metadata are used for client feedback and server enforcement.
- The route now checks configured exact Origins, exact JSON media type, the existing bounded 16 KiB streaming body reader, strict fields, honeypot, and idempotency key before storage.
- A configured, proxy-sanitized single-IP header is required in production. Forwarding chains and malformed addresses are rejected. IP-derived keys are HMAC digests using the existing server-only `RATE_LIMIT_SECRET`.
- Both persistent PostgreSQL rate windows are atomically incremented with `INSERT ... ON CONFLICT ... DO UPDATE`; failures return a generic no-store 503. Expired buckets are pruned after two days with a supporting index.
- Admin reference values are only linked when parsing confirms HTTP or HTTPS; other stored values remain text. React escapes text nodes, and notification HTML escapes submitted values.
- Database failures return a generic response and log a fixed event name, not query text or user data.

## Preserved architecture

Inquiry insertion and notification-outbox creation still happen in one PostgreSQL transaction. The unique idempotency key prevents duplicate records and the notification is attempted only for a newly inserted record. Notification failure leaves the outbox pending for retry; the browser only displays success after the API confirms persistence.

See [remaining limitations](./remaining-limitations.md) for controls that require a configured deployment environment or a dedicated database.
