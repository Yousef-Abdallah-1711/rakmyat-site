# SQL and display safety review

- All inquiry inserts, lookups, rate-limit upserts, outbox writes, and admin queries use the `postgres` tagged-template API with user values passed as parameters. Table names and query structure are fixed in source; no request value becomes a SQL identifier or raw query fragment.
- The schema validates type, size, and enumerated fields, but does not delete SQL-looking words from descriptions. Harmless payloads such as `' OR '1'='1` and `Robert'); DROP TABLE inquiries;--` remain valid description text and are not executable SQL. Schema tests verify the strings remain unchanged as parsed data. A live database injection test was not run because no isolated database is configured.
- Inquiry descriptions and other text are rendered as React text nodes in the admin UI. Submitted values in notification HTML are escaped. Legacy reference URL values are rendered as links only for HTTP(S); otherwise they are displayed as text.
- This change does not alter database credentials or grant additional database privileges. Production should use a least-privilege app role limited to required inquiry, outbox, admin, and rate-limit operations.
- A database row is inserted with its notification outbox row in a single transaction. `idempotency_key` and `inquiry_notifications.inquiry_id` are unique. Duplicate request keys do not enqueue another notification.

SMTP acceptance is not proof of inbox delivery. The existing retry outbox behavior remains in place; crash recovery around an SMTP acceptance followed by a failed `sent` status update cannot guarantee exactly-once email delivery.
