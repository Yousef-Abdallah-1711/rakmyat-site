# Rakmyat Website

The bilingual Rakmyat marketing site, lead-intake system, and blog CMS, built with Next.js App Router, React 19, TypeScript, and a PostgreSQL-backed backend with an admin dashboard.

## Stack overview

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript (strict) |
| Styling | Preserved Iteck/Bootstrap theme CSS, Animate.css, Swiper 5 (scoped client component), self-hosted Cairo and Tajawal fonts for Arabic |
| Rich text | TipTap v3 (`@tiptap/react`, `@tiptap/starter-kit`, and extensions for color, highlight, links, images, YouTube, text alignment, and placeholders) for the blog post body editor |
| Uploads | `react-dropzone` for drag-and-drop media uploads in the admin media library |
| Backend | Next.js Route Handlers (`app/api/**`), PostgreSQL via the `postgres` driver |
| Email | Nodemailer over SMTP, delivered through a durable outbox pattern |
| Auth | Session-token admin auth (hashed tokens in Postgres), no third-party auth provider |
| Deployment | Docker / `docker-compose` (see `Dockerfile`, `docker-compose.production.yml`, `deployment/`) |

## Frontend

- **Routing**: bilingual routes rooted at `/en` and `/ar`, resolved through the catch-all `app/[locale]/[[...path]]` route. Each locale serves home, about, services, service details, how-we-work, portfolio, and contact pages. Nine portfolio detail routes live at `/[locale]/projects/[slug]`.
- **Blog**: `/[locale]/blog` is the archive (search, category/tag/author filters, sorting, pagination, grid/list view). `/[locale]/blog/[slug]` is a single post with breadcrumb, reading progress bar, share bar, author link, and related posts. Details are in [Blog CMS](docs/blog-cms/README.md).
- **Legacy aliases**: `app/(aliases)/*` redirects old flat URLs (`/about`, `/contact`, `/portfolio`, `/projects`, `/services`) to the matching `/en/...` route.
- **Content model**: site copy is code-owned. Typed records under `content/` (`home.ts`, `services.ts`, `portfolio.ts`, `pricing.ts`, `about-copy.ts`, `blog-copy.ts`, `i18n.ts`, etc.) drive page copy in both languages. Blog posts, categories, and tags are database-backed and edited in the admin dashboard.
- **Fonts**: Arabic routes use Cairo (headings) and Tajawal (body/UI), self-hosted as WOFF2 under `public/fonts/` with `@font-face` rules in `public/assets/css/lib/cairo.css` and `tajawal.css`. No Google Fonts runtime request is made.
- **Components**: `components/layout/` (site chrome, header, scroll effects), `components/sections/` (route sections, including `Blog*.tsx` for the blog), `components/projects/` (portfolio cards and project visual frames), `components/forms/` (contact/inquiry form), `components/pricing/`, `components/admin/` (admin dashboard UI).
- **Project images**: portfolio cards link directly to their project detail page (`/[locale]/projects/[slug]`) via `ProjectVisualFrame`; gallery screenshots inside a project page still open a lightbox.
- Pages are server-rendered by default; interactivity (filters, forms, Swiper, the blog archive, the admin dashboard) is isolated to client components.

## Backend

### API routes (`app/api/`)

Public routes:

| Route | Purpose |
|---|---|
| `POST /api/inquiries` | Public contact-form submission: validates input (`lib/inquiry-schema.ts`), applies origin/rate-limit policy (`lib/inquiry-security-policy.ts`), writes to `inquiries`, queues an email via the outbox |
| `GET /api/blog/posts` | Published blog posts: paginated, filtered, sorted. Params: `page`, `limit` (max 10), `category`, `tag`, `author`, `q`, `sort` (`newest`, `oldest`, `az`, `za`), `locale` (`en`/`ar`). Cached with `s-maxage=3600` |
| `GET /api/blog/filters` | All blog categories and tags. Cached with `s-maxage=3600` |
| `GET /api/health` | Health check for Docker/orchestration |
| `/api/internal/outbox` | Internal endpoint used by the outbox worker to flush pending email notifications, guarded by `OUTBOX_WORKER_SECRET` |

Admin routes (all require an admin session):

| Route | Purpose |
|---|---|
| `POST /api/admin/login`, `POST /api/admin/logout` | Session-token admin authentication |
| `GET /api/admin/inquiries`, `PATCH /api/admin/inquiries/[id]` | Inquiry list and status/notes management |
| `GET /api/admin/security` | IP allowlist status and masked allowlisted IPs |
| `GET /api/admin/rate-limits`, `DELETE /api/admin/rate-limits` | Rate-limit bucket stats; clear all buckets |
| `GET/POST /api/admin/blog/posts` | List (with status, category, and search filters) and create blog posts |
| `GET/PATCH/DELETE /api/admin/blog/posts/[id]` | Single post read, update (including tag sync), and delete |
| `GET/POST /api/admin/blog/categories` | List and create blog categories |
| `PATCH/DELETE /api/admin/blog/categories/[id]` | Edit and delete a category |
| `GET/POST /api/admin/blog/tags` | List and create blog tags |
| `PATCH/DELETE /api/admin/blog/tags/[id]` | Edit and delete a tag |
| `GET /api/admin/blog/post-types` | List post types (read-only: Article, Tutorial, Case Study, News) |
| `POST /api/admin/media` | Multipart upload to `public/uploads/images/` or `public/uploads/videos/` |
| `GET /api/admin/media` | List uploaded media files |
| `DELETE /api/admin/media?url=…` | Delete an uploaded media file |

### Database (PostgreSQL)

Schema lives in `db/migrations/` (plain SQL, applied in filename order with `npm run db:migrate`):

- `0001_contact_admin.sql`: contact and admin tables (below)
- `0002_bounded_outbox_retries.sql`: outbox retry cap (`0002_bounded_outbox_retries.down.sql` is the rollback)
- `0003_blog.sql`: blog CMS tables and seed data (see [Blog CMS](docs/blog-cms/README.md))

Tables:

- `inquiries`: contact submissions (idempotency key, contact details, service/budget/timeline, locale, status workflow: `new → in-review → contacted → closed`)
- `inquiry_notifications`: outbox table tracking email delivery attempts/retries per inquiry
- `admin_users` / `admin_sessions`: admin accounts and hashed session tokens
- `rate_limit_buckets`: persistent, IP-bucketed rate limiting
- `blog_categories`, `blog_post_types`, `blog_tags`: blog taxonomy (bilingual names; categories also have descriptions)
- `blog_posts`: bilingual posts (EN/AR title, excerpt, body, SEO fields), with `status` (`draft`, `published`, `archived`), `category_id`, `post_type_id`, `author_name`, cover image URL, and `published_at`
- `blog_post_tags`: many-to-many join between posts and tags

`lib/server/db.ts` provides a lazily-created, pooled Postgres client (`server-only`). `lib/server/notifications.ts` and `lib/server/security.ts` handle email dispatch and security/rate-limit enforcement respectively. `lib/server/blog.ts` holds the blog queries.

### Reliability

Inquiry emails are never sent inline on the request path. A submission writes a `pending` row to `inquiry_notifications`; `scripts/outbox-worker.mjs` (or `npm run inquiries:retry-email`) drains the outbox with bounded retries, so SMTP failures can't drop a lead or block the API response.

## Blog CMS

The blog is database-backed and bilingual. Posts are written in the admin dashboard (`/admin/blog`) with a TipTap rich-text editor for the EN and AR bodies, a media-library picker for images and videos, and a cover image chosen from the library or pasted as a URL. Categories and tags are managed on their own admin pages. Public pages are statically revalidated every hour.

See [docs/blog-cms/README.md](docs/blog-cms/README.md) for the schema, public API parameters, URL parameters, caching behaviour, and local setup.

## Admin dashboard

The admin area is a sidebar layout (`components/admin/AdminShell.tsx`) that collapses to a horizontal top bar on mobile. It has five areas:

- **Inquiries** (`/admin/inquiries`): contact submissions, status workflow, and a security settings panel (IP allowlist status, rate-limit stats, and a clear-all action).
- **Blog Posts** (`/admin/blog`): post list, create/edit form, and a Taxonomy tab.
- **Categories** (`/admin/blog/categories`) and **Tags** (`/admin/blog/tags`): taxonomy management.
- **Media library**: drag-and-drop upload and a library browser, used from the blog editor and the cover-image field.

Sign-in is at `/admin/login`, which shows a countdown when rate-limited. Sessions last 12 hours. See [docs/admin-dashboard/README.md](docs/admin-dashboard/README.md) for pages, security, and account creation.

## Environment variables

Copy `.env.example` to `.env.local` for local development and fill in:

- `DATABASE_URL`, `DATABASE_SSL`: Postgres connection
- `RATE_LIMIT_SECRET`, `TRUSTED_CLIENT_IP_HEADER`, `CONTACT_ALLOWED_ORIGINS`: abuse protection (the IP header must come from a proxy you trust, never a client-controlled header). `RATE_LIMIT_SECRET` must be at least 32 characters.
- `ADMIN_IP_ALLOWLIST`: comma-separated IPs whose admin login attempts skip rate limiting (for example `127.0.0.1,::1,localhost` for local development). Keep this list to trusted addresses only. This key is not yet listed in `.env.example`; add it manually.
- `INQUIRY_RATE_LIMIT_15M_MAX`, `INQUIRY_RATE_LIMIT_24H_MAX`: submission throttling
- `SMTP_HOST`/`SMTP_PORT`/`SMTP_SECURE`/`SMTP_USER`/`SMTP_PASS`/`SMTP_FROM`, `INQUIRY_NOTIFICATION_TO`: outbound lead notification email
- `OUTBOX_WORKER_SECRET`, `OUTBOX_MAX_ATTEMPTS`: outbox worker auth and retry cap
- `NEXT_PUBLIC_SITE_URL`, `ROBOTS_INDEXING_ENABLED`: SEO metadata/sitemap and indexing control (keep indexing disabled outside production)

## Development

From `next-app/`:

```powershell
npm.cmd ci
npm.cmd run db:migrate   # applies 0001-0003, including the blog tables
npm.cmd run dev
```

The dev server listens at `http://127.0.0.1:5175/`. Use `http://localhost:5175/` for admin sign-in and admin pages: session cookies are scoped to the exact host, so keep one host for the whole session.

```powershell
npm.cmd run lint          # ESLint
npm.cmd run typecheck     # tsc --noEmit
npm.cmd run build         # production build
npm.cmd run start         # serve the production build
npm.cmd run db:migrate    # apply SQL migrations (0003_blog.sql adds the blog CMS tables)
npm.cmd run admin:create  # create an admin user (interactive prompts)
npm.cmd run test          # node --test (unit tests under tests/)
npm.cmd run responsive:e2e  # Playwright responsive suite
npx.cmd playwright test -c playwright.admin.config.ts  # admin auth Playwright suite (needs the dev server on localhost:5175)
```

Migration note: `0003_blog.sql` is the blog migration. It has no `.down.sql` file, so rolling it back means dropping the blog tables by hand. Existing databases pick it up on the next `npm.cmd run db:migrate`.

## Deployment

A production Dockerfile and `docker-compose.production.yml` build the app, run migrations, and start the outbox worker alongside the web process. See `deployment/` and `docker/` for environment-specific compose overrides, plus `docs/` for phase-by-phase production hardening notes (caching, load testing, final readiness review).

Uploaded media is written to `public/uploads/` inside the running container. No volume for that path is defined in the compose files found in this repo, so uploads do not survive container replacement until one is added. See [Known Issues](docs/KNOWN-ISSUES.md).

## Documentation

- [Architecture and folder organization](docs/ARCHITECTURE.md)
- [Blog CMS](docs/blog-cms/README.md)
- [Admin dashboard](docs/admin-dashboard/README.md)
- [Migration history and validation](docs/MIGRATION-SUMMARY.md)
- [Known issues and production decisions](docs/KNOWN-ISSUES.md)
- [Phase 3.2 portfolio and visual QA evidence](docs/phase-3.2/README.md)

## Implementation notes

Original browser-delivered CSS, images, and fonts retain their local URL paths. Swiper 5 is the only legacy JavaScript runtime used by this app. External Google Maps embeds and the optional YouTube lightbox need network access. Review the documentation above and licensing notes before production use.
