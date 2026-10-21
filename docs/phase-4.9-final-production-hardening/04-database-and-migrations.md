# 04 — Database and migrations

Migrations are versioned under `db/migrations/` and applied once by the Compose `migrate` service before web startup. The application connects as `rakmyat_app`; migrations run as `rakmyat_migrator`; PostgreSQL bootstrap is a separate role. The role initializer revokes public schema creation and grants the application only table DML and sequence use by default. PostgreSQL is private and persistent.

Migration 0002 is transactional under the runner and its retry-attempt constraint is safe to reapply. The migration runner records applied filenames in `schema_migrations`. Both migrations were applied twice to a loopback-only PostgreSQL 17 container using the least-privilege migrator role; the application role then inserted a synthetic inquiry successfully. The database used tmpfs and the container was removed. No staging or real records were touched.

The web connection pool is capped at 8 per process. Recalculate the aggregate connection ceiling against database `max_connections`, replicas, migration/admin sessions, and operational reserve before scaling. Search-query behavior at production data volume remains unmeasured.

Encrypted custom-format backup and disposable restore-drill scripts are present. They require an approved GPG recipient and protected off-host destination. No retention schedule, backup storage, or production restore has been configured or verified. Inquiry retention/deletion must follow an owner-approved privacy policy; this phase did not delete records or automate destructive retention.
