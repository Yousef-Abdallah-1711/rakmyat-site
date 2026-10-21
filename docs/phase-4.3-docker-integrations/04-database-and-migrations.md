# Database and migrations

`db/migrations/0001_contact_admin.sql` creates the inquiry, outbox, admin, and rate-limit tables. `0002_bounded_outbox_retries.sql` adds a terminal `failed` state and bounds attempts. `scripts/migrate.ts` tracks applied migration filenames in `schema_migrations` and applies each migration transactionally.

Startup migration is confined to this Compose project through the dedicated DATABASE_URL secret. To inspect: `docker compose ... exec postgres psql -U rakmyat_staging -d rakmyat_phase43 -c "select version, applied_at from schema_migrations order by version"`.
