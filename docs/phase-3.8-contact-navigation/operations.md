# Operations: PostgreSQL, SMTP, and admin provisioning

## Required setup

1. Provision a PostgreSQL 15+ database and set `DATABASE_URL` in the hosting secret store. Use a restricted application role and TLS.
2. Generate a unique random `RATE_LIMIT_SECRET` of at least 32 characters per environment.
3. Run `npm.cmd run db:migrate` during controlled deployment.
4. Run `npm.cmd run admin:create` in a trusted interactive terminal. The password is hidden while typing, must be at least 14 characters, is scrypt-hashed, and is never written to project files. The command refuses duplicate email accounts; no default credentials exist.
5. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` as server-side secrets/config. `INQUIRY_NOTIFICATION_TO` is pinned to `yoseabdallah866@gmail.com`; leave that exact value or omit it.
6. Schedule `npm.cmd run inquiries:retry-email` from a secure worker/cron at an appropriate interval. It claims outbox rows safely and retries failed or stale sends. If SMTP is down, records remain in PostgreSQL.

Copy `.env.example` to a local untracked `.env.local` only for development. Never commit real values. The checked-in example contains placeholders, not usable credentials.

## Admin access

- Sign in at `/admin/login`; authenticated admin UI is `/admin/inquiries`.
- API authentication is checked on the server for every request; hiding the client navigation alone is not authorization.
- To remove access, set an admin’s `disabled_at` in PostgreSQL and delete active `admin_sessions` for that account. Session expiry is 12 hours.
- Credential rotation/recovery is an operator task. No public account recovery, signup, or password reset flow is exposed.

## Development limits

Without `DATABASE_URL` and `RATE_LIMIT_SECRET`, public submission fails closed with an honest message, and admin access is not operational. Without SMTP settings, database persistence still works and notification records remain pending; once the database and first admin are provisioned, inquiries remain accessible in the admin screen. No inbox delivery has been tested because credentials were not supplied.
