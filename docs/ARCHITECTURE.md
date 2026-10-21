# Architecture

## Runtime and routing

The app uses Next.js App Router with React and strict TypeScript. Page entry points live in `app/`; each route renders page-specific section components while sharing the global layout and interaction components. The seven primary routes and their legacy URL aliases are listed in the project [README](../README.md).

The root layout and global stylesheet are in `app/layout.tsx` and `app/globals.css`. The existing theme and vendor CSS are kept to preserve the original cascade and appearance. The Next app serves its own `public/` directory; it does not read files from the sibling Vite project at runtime.

## Source organization

| Directory | Responsibility |
|---|---|
| `app/` | App Router layouts, route entries, API route handlers (`app/api/`), and not-found page |
| `components/layout/` | Shared site chrome, header, layout effects, scroll-to-top |
| `components/sections/` | Route sections and reusable content sections |
| `components/forms/`, `components/pricing/` | Contact form and pricing interactions |
| `components/projects/` | Portfolio cards and project visual frames (cover images link to the project page) |
| `components/admin/` | Admin inquiries dashboard UI |
| `content/` | Typed page, site, service, project, pricing, team, and repeated-content records |
| `lib/` | Shared runtime helpers (SEO, structured data, inquiry schema/policy) |
| `lib/server/` | Server-only backend helpers: Postgres client, email notifications, security/rate-limiting |
| `db/migrations/` | SQL migrations for the Postgres schema |
| `scripts/` | Migration runner, admin creation, outbox worker, QA/e2e helpers |
| `public/` | Local CSS, fonts, images, and the active Swiper script |
| `tests/` | Unit and e2e test material |
| `docker/`, `deployment/` | Docker Compose overrides and deployment configuration |

Most pages preserve the source DOM structure and classes through JSX components. Shared page chrome and repeated sections are React components. Client behavior is scoped to client components where browser state or browser APIs are needed; page structure and most content remain server rendered by App Router.

## Backend architecture

API route handlers under `app/api/` are the only backend surface; there is no separate backend service. They talk to PostgreSQL through the pooled, `server-only` client in `lib/server/db.ts`.

- **Contact/inquiry flow**: `POST /api/inquiries` validates the payload (`lib/inquiry-schema.ts`), enforces origin allowlisting and persistent rate limits (`lib/inquiry-security-policy.ts`, `lib/server/security.ts`), inserts a row into `inquiries`, and queues a notification row in `inquiry_notifications` instead of sending email inline.
- **Outbox delivery**: `scripts/outbox-worker.mjs` (and the `inquiries:retry-email` script) drain `inquiry_notifications` with bounded retries via `lib/server/notifications.ts`, so SMTP outages cannot drop a lead or block the request.
- **Admin**: `admin_users`/`admin_sessions` tables back session-token login (`/api/admin/login`, `/api/admin/logout`) and the authenticated inquiry management endpoints (`/api/admin/inquiries*`) consumed by `components/admin/AdminInquiries.tsx`.
- **Health/ops**: `/api/health` for container/orchestration checks; `/api/internal/outbox` is the internal trigger the outbox worker calls, guarded by `OUTBOX_WORKER_SECRET`.

## Content and editing boundaries

Typed records under `content/` cover global settings, headings and copy, services, portfolio/projects, pricing, testimonials, clients, features, reasons, and team content. Some small labels and section prose remain inline in route section components. This is a code-owned content model, not a CMS or editor interface; see [Known Issues](KNOWN-ISSUES.md).

## Legacy runtime and assets

Bootstrap CSS, theme CSS, local fonts/icons, Animate.css, and Swiper styles are retained for fidelity. Swiper 5 is initialized from a scoped client component. Legacy jQuery-based theme scripts and plugins are not executed. Google Maps and the optional YouTube lightbox are external runtime destinations.

## Deployment

`Dockerfile` builds the production image; `docker-compose.production.yml` (with environment-specific overrides under `docker/` and `deployment/`) runs the web process, applies migrations, and starts the outbox worker. See the `docs/phase-4.*` notes for caching, load-testing, and production-hardening history.
