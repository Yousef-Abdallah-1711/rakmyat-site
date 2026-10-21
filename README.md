# Rakmyat Website

The bilingual Rakmyat marketing site and lead-intake system, built with Next.js App Router, React 19, TypeScript, and a PostgreSQL-backed contact/admin backend.

## Stack overview

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript (strict) |
| Styling | Preserved Iteck/Bootstrap theme CSS, Animate.css, Swiper 5 (scoped client component) |
| Backend | Next.js Route Handlers (`app/api/**`), PostgreSQL via the `postgres` driver |
| Email | Nodemailer over SMTP, delivered through a durable outbox pattern |
| Auth | Session-token admin auth (hashed tokens in Postgres), no third-party auth provider |
| Deployment | Docker / `docker-compose` (see `Dockerfile`, `docker-compose.production.yml`, `deployment/`) |

## Frontend

- **Routing**: bilingual routes rooted at `/en` and `/ar`, resolved through the catch-all `app/[locale]/[[...path]]` route. Each locale serves home, about, services, service details, how-we-work, portfolio, and contact pages. Nine portfolio detail routes live at `/[locale]/projects/[slug]`.
- **Legacy aliases**: `app/(aliases)/*` redirects old flat URLs (`/about`, `/contact`, `/portfolio`, `/projects`, `/services`) to the matching `/en/...` route.
- **Content model**: typed, code-owned content records under `content/` (`home.ts`, `services.ts`, `portfolio.ts`, `pricing.ts`, `about-copy.ts`, `i18n.ts`, etc.) drive page copy in both languages — there is no CMS or editor UI.
- **Components**: `components/layout/` (site chrome, header, scroll effects), `components/sections/` (route sections), `components/projects/` (portfolio cards and project visual frames), `components/forms/` (contact/inquiry form), `components/pricing/`, `components/admin/` (inquiries dashboard UI).
- **Project images**: portfolio cards link directly to their project detail page (`/[locale]/projects/[slug]`) via `ProjectVisualFrame`; gallery screenshots inside a project page still open a lightbox.
- Pages are server-rendered by default; interactivity (filters, forms, Swiper, the admin dashboard) is isolated to client components.

## Backend

### API routes (`app/api/`)

| Route | Purpose |
|---|---|
| `POST /api/inquiries` | Public contact-form submission: validates input (`lib/inquiry-schema.ts`), applies origin/rate-limit policy (`lib/inquiry-security-policy.ts`), writes to `inquiries`, queues an email via the outbox |
| `GET/PATCH /api/admin/inquiries`, `/api/admin/inquiries/[id]` | Authenticated inquiry list/detail/status management for the admin dashboard |
| `POST /api/admin/login`, `/api/admin/logout` | Session-token admin authentication |
| `GET /api/health` | Health check for Docker/orchestration |
| `/api/internal/outbox` | Internal endpoint used by the outbox worker to flush pending email notifications |

### Database (PostgreSQL)

Schema lives in `db/migrations/` (plain SQL, applied with `npm run db:migrate`):

- `inquiries` — contact submissions (idempotency key, contact details, service/budget/timeline, locale, status workflow: `new → in-review → contacted → closed`)
- `inquiry_notifications` — outbox table tracking email delivery attempts/retries per inquiry
- `admin_users` / `admin_sessions` — admin accounts and hashed session tokens
- `rate_limit_buckets` — persistent, IP-bucketed rate limiting (`INQUIRY_RATE_LIMIT_15M_MAX`, `INQUIRY_RATE_LIMIT_24H_MAX`)

`lib/server/db.ts` provides a lazily-created, pooled Postgres client (`server-only`). `lib/server/notifications.ts` and `lib/server/security.ts` handle email dispatch and security/rate-limit enforcement respectively.

### Reliability

Inquiry emails are never sent inline on the request path. A submission writes a `pending` row to `inquiry_notifications`; `scripts/outbox-worker.mjs` (or `npm run inquiries:retry-email`) drains the outbox with bounded retries, so SMTP failures can't drop a lead or block the API response.

## Environment variables

Copy `.env.example` to `.env` and fill in:

- `DATABASE_URL`, `DATABASE_SSL` — Postgres connection
- `RATE_LIMIT_SECRET`, `TRUSTED_CLIENT_IP_HEADER`, `CONTACT_ALLOWED_ORIGINS` — abuse protection (the IP header must come from a proxy you trust, never a client-controlled header)
- `INQUIRY_RATE_LIMIT_15M_MAX`, `INQUIRY_RATE_LIMIT_24H_MAX` — submission throttling
- `SMTP_HOST`/`SMTP_PORT`/`SMTP_SECURE`/`SMTP_USER`/`SMTP_PASS`/`SMTP_FROM`, `INQUIRY_NOTIFICATION_TO` — outbound lead notification email
- `OUTBOX_WORKER_SECRET`, `OUTBOX_MAX_ATTEMPTS` — outbox worker auth and retry cap
- `NEXT_PUBLIC_SITE_URL`, `ROBOTS_INDEXING_ENABLED` — SEO metadata/sitemap and indexing control (keep indexing disabled outside production)

## Development

From `next-app/`:

```powershell
npm.cmd ci
npm.cmd run dev
```

The dev server listens at `http://127.0.0.1:5175/`.

```powershell
npm.cmd run lint          # ESLint
npm.cmd run typecheck     # tsc --noEmit
npm.cmd run build         # production build
npm.cmd run start         # serve the production build
npm.cmd run db:migrate    # apply SQL migrations
npm.cmd run admin:create  # create an admin user
npm.cmd run test          # node --test (unit tests under tests/)
npm.cmd run responsive:e2e  # Playwright responsive suite
```

## Deployment

A production Dockerfile and `docker-compose.production.yml` build the app, run migrations, and start the outbox worker alongside the web process. See `deployment/` and `docker/` for environment-specific compose overrides, plus `docs/` for phase-by-phase production hardening notes (caching, load testing, final readiness review).

## Documentation

- [Architecture and folder organization](docs/ARCHITECTURE.md)
- [Migration history and validation](docs/MIGRATION-SUMMARY.md)
- [Known issues and production decisions](docs/KNOWN-ISSUES.md)
- [Phase 3.2 portfolio and visual QA evidence](docs/phase-3.2/README.md)

## Implementation notes

Original browser-delivered CSS, images, and fonts retain their local URL paths. Swiper 5 is the only legacy JavaScript runtime used by this app. External Google Maps embeds and the optional YouTube lightbox need network access. Review the documentation above and licensing notes before production use.
