# Architecture

## Runtime and routing

The app uses Next.js App Router with React and strict TypeScript. Page entry points live in `app/`; each route renders page-specific section components while sharing the global layout and interaction components. The seven primary routes and their legacy URL aliases are listed in the project [README](../README.md).

Layouts are per segment: `app/[locale]/layout.tsx` (public site), `app/(aliases)/layout.tsx` (legacy redirects), and `app/admin/layout.tsx` (admin). Each imports the shared `app/globals.css`. The existing theme and vendor CSS are kept to preserve the original cascade and appearance. The Next app serves its own `public/` directory; it does not read files from the sibling Vite project at runtime.

## Source organization

| Directory | Responsibility |
|---|---|
| `app/` | App Router segments: `[locale]/` (public site and blog routes), `(aliases)/` (legacy redirects), `admin/` (dashboard pages and layout), `api/` (route handlers), plus `globals.css`, `robots.ts`, and `sitemap.ts` |
| `components/layout/` | Shared site chrome, header, layout effects, scroll-to-top |
| `components/sections/` | Route sections and reusable content sections, including the blog (`Blog*.tsx` and `Blog.module.css`: archive, post, card, progress bar, share bar) |
| `components/forms/`, `components/pricing/` | Contact form and pricing interactions |
| `components/projects/` | Portfolio cards and project visual frames (cover images link to the project page) |
| `components/admin/` | Admin dashboard UI: `AdminShell` sidebar layout, `AdminSignOutButton`, inquiries, blog posts and taxonomy (`AdminBlog`, `AdminBlogTaxonomy`), TipTap `RichTextEditor`, and `MediaLibrary` |
| `content/` | Typed page, site, service, project, pricing, team, and repeated-content records, plus `blog-copy.ts` (bilingual blog UI copy). Blog posts themselves are database-backed. |
| `lib/` | Shared runtime helpers (SEO, structured data, inquiry schema/policy, and `blog-schema.ts` with the blog TypeScript types and Zod schemas) |
| `lib/server/` | Server-only backend helpers: Postgres client, email notifications, security/rate-limiting and admin sessions, blog queries (`blog.ts`) |
| `db/migrations/` | SQL migrations for the Postgres schema (`0001` contact/admin, `0002` outbox retries, `0003` blog CMS) |
| `scripts/` | Migration runner, admin creation, outbox worker, QA/e2e helpers |
| `public/` | Local CSS (including `assets/css/lib/cairo.css` and `tajawal.css`), self-hosted fonts (`fonts/`, including Cairo and Tajawal WOFF2), images, the active Swiper script, and runtime media uploads (`uploads/images/`, `uploads/videos/`) |
| `tests/` | Unit and e2e test material |
| `docker/`, `deployment/` | Docker Compose overrides and deployment configuration |

Most pages preserve the source DOM structure and classes through JSX components. Shared page chrome and repeated sections are React components. Client behavior is scoped to client components where browser state or browser APIs are needed; page structure and most content remain server rendered by App Router.

## Backend architecture

API route handlers under `app/api/` are the only backend surface; there is no separate backend service. They talk to PostgreSQL through the pooled, `server-only` client in `lib/server/db.ts`.

- **Contact/inquiry flow**: `POST /api/inquiries` validates the payload (`lib/inquiry-schema.ts`), enforces origin allowlisting and persistent rate limits (`lib/inquiry-security-policy.ts`, `lib/server/security.ts`), inserts a row into `inquiries`, and queues a notification row in `inquiry_notifications` instead of sending email inline.
- **Outbox delivery**: `scripts/outbox-worker.mjs` (and the `inquiries:retry-email` script) drain `inquiry_notifications` with bounded retries via `lib/server/notifications.ts`, so SMTP outages cannot drop a lead or block the request.
- **Admin**: `admin_users`/`admin_sessions` tables back session-token login (`/api/admin/login`, `/api/admin/logout`). Authenticated endpoints cover inquiries (`/api/admin/inquiries*`, consumed by `components/admin/AdminInquiries.tsx`), the security panel (`/api/admin/security`, `/api/admin/rate-limits`), blog management (`/api/admin/blog/*`), and media (`/api/admin/media`). The dashboard UI is described in the subsections below.
- **Health/ops**: `/api/health` for container/orchestration checks; `/api/internal/outbox` is the internal trigger the outbox worker calls, guarded by `OUTBOX_WORKER_SECRET`.

### Blog CMS

Blog data lives in `blog_categories`, `blog_post_types`, `blog_tags`, `blog_posts`, and `blog_post_tags` (`db/migrations/0003_blog.sql`). Queries are in `lib/server/blog.ts` and the Zod schemas and types are in `lib/blog-schema.ts`. Those queries use React `cache()`, which deduplicates reads within one render only and is not a cross-request cache. Public reads go through `GET /api/blog/posts` and `GET /api/blog/filters`, which send `s-maxage=3600`; the archive and post pages use `revalidate = 3600`. Admin writes go through `/api/admin/blog/*` (responses are `no-store`) and do not trigger on-demand revalidation, so a change can take up to an hour to appear publicly. Post bodies are stored as HTML and rendered without sanitisation (see [Known Issues](KNOWN-ISSUES.md)). Details: [Blog CMS guide](blog-cms/README.md).

### Media library

`POST /api/admin/media` takes multipart uploads. It checks the MIME type against a whitelist (JPEG, PNG, WebP, GIF, AVIF images; MP4 and WebM video), verifies magic bytes, and enforces a 50 MB limit. Files are saved to `public/uploads/images/` or `public/uploads/videos/` and served as static files. `GET` lists files. `DELETE` removes one and accepts only paths matching the upload directory pattern. The `MediaLibrary` component provides drag-and-drop upload (via `react-dropzone`) and a browser modal. `RichTextEditor` (image button) and the cover-image field in `AdminBlog` use it.

### Admin dashboard

`AdminShell` wraps admin pages in a persistent sidebar (Inquiries, Blog Posts, Categories, Tags). It uses `usePathname` for active states and collapses to a horizontal top bar on small screens. `AdminBlog` provides the post list and create/edit form, plus a Taxonomy tab backed by `AdminBlogTaxonomy` (categories, tags, and read-only post types). `RichTextEditor` is a TipTap v3 editor with headings, bold/italic/strike, alignment, colour, highlight, lists, blockquote, code, links, image and YouTube embeds, and undo/redo. Sign-in limits and the security panel are covered in the [admin dashboard guide](admin-dashboard/README.md).

## API routes

| Area | Routes |
|---|---|
| Public | `POST /api/inquiries`, `GET /api/blog/posts`, `GET /api/blog/filters`, `GET /api/health`, `/api/internal/outbox` (worker only, `OUTBOX_WORKER_SECRET`) |
| Auth | `POST /api/admin/login`, `POST /api/admin/logout` |
| Inquiries | `GET /api/admin/inquiries`, `PATCH /api/admin/inquiries/[id]` |
| Security | `GET /api/admin/security`, `GET` and `DELETE /api/admin/rate-limits` |
| Blog posts | `GET` and `POST /api/admin/blog/posts`, `GET`, `PATCH`, and `DELETE /api/admin/blog/posts/[id]` |
| Blog taxonomy | `GET` and `POST /api/admin/blog/categories`, `PATCH` and `DELETE /api/admin/blog/categories/[id]`, `GET` and `POST /api/admin/blog/tags`, `PATCH` and `DELETE /api/admin/blog/tags/[id]`, `GET /api/admin/blog/post-types` (read-only) |
| Media | `POST`, `GET`, and `DELETE /api/admin/media` |

All `/api/admin/*` routes require an admin session. Query parameters and response details are in the [README](../README.md#backend) and the [blog CMS guide](blog-cms/README.md).

## Content and editing boundaries

Site copy stays in typed records under `content/`: global settings, headings and copy, services, portfolio/projects, pricing, testimonials, clients, features, reasons, team content, and blog UI copy. Some small labels and section prose remain inline in route section components. Blog posts, categories, tags, and uploaded media are the editable content. They are database-backed, or stored under `public/uploads/`, and are edited through the admin dashboard. The CMS covers blog content only; the main site pages are still code-owned. See [Known Issues](KNOWN-ISSUES.md).

## Legacy runtime and assets

Bootstrap CSS, theme CSS, local fonts/icons, Animate.css, and Swiper styles are retained for fidelity. Swiper 5 is initialized from a scoped client component. Legacy jQuery-based theme scripts and plugins are not executed. Google Maps and the optional YouTube lightbox are external runtime destinations.

## Deployment

`Dockerfile` builds the production image; `docker-compose.production.yml` (with environment-specific overrides under `docker/` and `deployment/`) runs the web process, applies migrations, and starts the outbox worker. See the `docs/phase-4.*` notes for caching, load-testing, and production-hardening history. Uploads under `public/uploads/` have no volume in the compose files found in this repo, so they are lost when a container is replaced until one is added.
