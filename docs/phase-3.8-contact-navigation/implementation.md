# Implementation and data model

## What changed

- Shared header links directly to Home, About, Services, Work, and Contact. Unsupported “More pages” navigation was removed. The language link preserves the current supported page, project slug, and query string; unknown routes fall back to the localized Contact page.
- Homepage email-only demo input was removed. Its existing project CTA is now a direct Contact link. Other public project-intent links already route to the localized Contact page; see the CTA audit.
- Contact now uses an English/Arabic project inquiry form in the existing Iteck section styling. Full name and phone are required; email, company, service type, budget preference, timeline, description, and reference URL are optional. The map placeholder is removed.
- Browser validation runs on blur and submit, associates errors with fields, focuses the first invalid input, preserves entered values on failures, disables duplicate submits while pending, and reuses an idempotency key after a network failure.
- `POST /api/inquiries` validates a bounded JSON request with Zod, verifies input and option keys, checks a hidden honeypot, limits requests by a keyed IP identifier, and writes the inquiry plus email-outbox record in one Postgres transaction. The client reports success only after the database commit.
- Email notification uses Nodemailer and a durable PostgreSQL outbox. Failed email sends remain pending with a backoff timestamp and a redacted error; `npm.cmd run inquiries:retry-email` retries due entries. The notification destination is fixed to `yoseabdallah866@gmail.com` and an environment override to another recipient is rejected.
- `/admin/inquiries` is a no-store server route protected by a database-backed session. Admin login is at `/admin/login`; there is no public signup or default credential. Admins can search/filter, view inquiry details, change status, add private notes, and view counts. Admin accounts are created from a private terminal command.
- Public and admin data endpoints return no-store headers. Admin mutations require same-origin requests. Passwords use scrypt; sessions use random opaque tokens stored only as hashes and HttpOnly, Secure-in-production, SameSite=Strict cookies.
- The global preloader component and its navigation-triggered 350 ms timer were removed. Existing section reveal and scroll behavior remains.

## Database

PostgreSQL 15+ is the shared store for inquiries, the notification outbox, admin users/sessions, and atomic rate-limit buckets. Apply `db/migrations/0001_contact_admin.sql` with `npm.cmd run db:migrate`. SQL statements use parameterized Postgres.js templates. Inquiry status values and locale are constrained in the database.

Stable option keys are defined in `lib/inquiry-schema.ts`, and bilingual labels/options are in `content/inquiry-copy.ts`; choices can be edited there without changing stored values. Budget choices intentionally do not promise prices or currency.

The database, `RATE_LIMIT_SECRET`, SMTP credentials, and an operator-provisioned admin are not configured in this workspace. API persistence currently returns 503 without a database and rate-limit secret. SMTP mail cannot be sent until its credentials are configured. This report does not claim live storage or email delivery.
