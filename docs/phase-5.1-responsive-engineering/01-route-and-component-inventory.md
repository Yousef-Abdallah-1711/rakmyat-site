# 01 — Route and component inventory

## Routing model

The app uses a locale catch-all: `app/[locale]/[[...path]]/page.tsx` resolves all public bilingual pages for `locale` in `{ar, en}`, with `/` redirecting to `/ar` (Arabic-default, confirmed live: navigating to `/` resolves to `/ar`). `app/(aliases)/` provides legacy unlocalized URL aliases (`/about`, `/contact`, `/portfolio`, `/projects/[slug]`, `/services`, `/services/details`) that this route group maps onto the localized pages. Admin (`app/admin/`) and most API routes are intentionally **not** locale-prefixed (`/admin/login`, not `/ar/admin/login` — confirmed live, the localized path 404s).

## Public routes (confirmed from `app/[locale]/[[...path]]/page.tsx` + content records)

| Route | AR | EN |
|---|---|---|
| Home | `/ar` | `/en` |
| About | `/ar/about` | `/en/about` |
| Services | `/ar/services` | `/en/services` |
| Services detail | `/ar/services/details` | `/en/services/details` |
| How we work | `/ar/how-we-work` | `/en/how-we-work` |
| Portfolio listing | `/ar/portfolio` | `/en/portfolio` |
| Contact | `/ar/contact` | `/en/contact` |

## Portfolio case studies (9, confirmed from `content/portfolio.ts`)

`/{locale}/projects/{slug}` for: `schooly`, `nora-store`, `edtech-platform`, `live-workshop`, `eduflow`, `legal-translation`, `gc-hardware`, `concord-crm`, `product-scraper`. This matches the Phase 5.1 brief's list exactly.

## Admin routes

- `/admin/login` (public, unauthenticated)
- `/admin/inquiries` (authenticated). **Corrected in Session 2**: without a configured local database, this does *not* redirect to login — it server-renders an explicit "Admin setup required" state with a manual sign-in link, confirmed live in the browser. The 401-triggered client-side redirect in `AdminInquiries.tsx` only applies once a database exists and a session can genuinely be unauthenticated rather than unconfigured.
- `app/admin/error.tsx`, `app/admin/layout.tsx` — error boundary and shell

## API routes

`/api/inquiries`, `/api/admin/inquiries`, `/api/admin/inquiries/[id]`, `/api/admin/login`, `/api/admin/logout`, `/api/health`, `/api/internal/outbox`.

## Shared components inspected this session

| Component | File | Role |
|---|---|---|
| Site chrome / header / nav | `components/layout/SiteChrome.tsx`, `SiteHeader.tsx`, `SiteLayout.tsx` | Global nav, mobile menu toggle, language switcher |
| Portfolio card | `components/projects/ProjectShowcaseCard.tsx` | Grid/related/home card variants |
| Portfolio image frame | `components/projects/ProjectVisualFrame.tsx` | `next/image` presentation, aspect-ratio reservation, Fancybox lightbox wiring |
| Gallery lightbox | `components/sections/MediaLightbox.tsx` (Fancybox-backed, `data-fancybox` groups) | Full-size screenshot inspection |
| Admin login form | `components/admin/AdminLogin.tsx` | Email/password form, styled via `.admin-login`/`.admin-shell` in `app/globals.css` |
| Admin dashboard | `components/admin/AdminInquiries.tsx` | Metrics, filters, paginated inquiry list (accordion `<details>` cards, not a `<table>`) |
| Contact form | `components/forms/*` (inquiry form) | Bilingual contact workflow |

## Local environment state

- Dev server already running on `127.0.0.1:5175` (Next.js 16.4.2, Turbopack) for the duration of this session.
- No `DATABASE_URL` configured locally (confirmed by `docs/KNOWN-ISSUES.md`), so the admin dashboard cannot be exercised with live data; `AdminInquiries.tsx` was reviewed by reading its source and its shared CSS instead (see [02](02-responsive-defect-matrix.md)).
- Git branch `phase-3/rakmyat-content-only` has 137 uncommitted changes (a completed-but-uncommitted locale-routing migration plus Phase 4.1–4.9 production-hardening work: Docker, DB migrations, process/How-we-work sections, etc.). This was treated as the working baseline and left untouched.

## Session 2 additions

- **Confirmed `/{locale}/services/details` is the only services-detail route** — `app/[locale]/[[...path]]/page.tsx`'s static-paths list has exactly one `["services","details"]` entry, not a per-service dynamic template. Resolves the ambiguity in the brief's "every actual detail route" instruction concretely.
- Playwright 1.64.1 with Chromium, Firefox, and WebKit all already installed locally — confirmed via the `ms-playwright` cache directory before assuming availability.
- A new automated regression suite now exists at `tests/e2e/responsive/` — see [16-responsive-regression-suite.md](16-responsive-regression-suite.md) for full detail, and [17-session-2-coverage-matrix.md](17-session-2-coverage-matrix.md) for the verified route × locale × viewport coverage this session actually achieved.
