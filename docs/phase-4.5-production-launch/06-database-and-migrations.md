# Database and migrations

Existing schema: inquiries, notification outbox, admin users/sessions, and rate-limit buckets. Existing migrations are transactional and versioned. Production configuration adds bootstrap, migrator, and application roles; the app role cannot create schema objects. Migration execution uses `MIGRATION_DATABASE_URL` and remains compatible with staging's existing `DATABASE_URL`.

Production PostgreSQL data remains on a dedicated named volume, never exposed through a host port. The Compose topology assumes same-host private Docker networking (`DATABASE_SSL=false`); if an approved managed database is selected, require provider TLS and set `DATABASE_SSL=true`. Configure connection limits/pooling for the selected provider before scale-out; the current app pool is capped at eight connections per app process.

No production database exists in this workspace and no production migration ran. Before migration: identify the target, validate a fresh backup, rehearse on a disposable production-like DB, check lock/downtime implications, and retain a restore/rollback plan. Do not treat the local role-init script as a migration rehearsal.
