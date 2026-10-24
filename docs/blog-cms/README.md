# Blog CMS

## Overview

The blog is a database-backed, bilingual (EN/AR) publishing system. Posts, categories, tags, and post types live in PostgreSQL. Editors manage them in the admin dashboard, and the public site reads them through a cached public API and ISR pages.

Related: [Admin dashboard](../admin-dashboard/README.md), [Architecture](../ARCHITECTURE.md), [Known issues](../KNOWN-ISSUES.md), migration `db/migrations/0003_blog.sql`.

## Database schema

Defined in `db/migrations/0003_blog.sql`.

| Table | Purpose | Key columns |
|---|---|---|
| `blog_categories` | Post categories (bilingual names and descriptions) | `slug` (unique, ≤80), `name_en`, `name_ar`, `description_en`, `description_ar` |
| `blog_post_types` | Post types (bilingual names) | `slug` (unique, ≤80), `name_en`, `name_ar` |
| `blog_tags` | Tags (bilingual names) | `slug` (unique, ≤80), `name_en`, `name_ar` |
| `blog_posts` | Posts | `slug` (unique, ≤200), `title_en/ar`, `excerpt_en/ar`, `body_en/ar`, `cover_image_url`, `category_id`, `post_type_id`, `author_name` (default `Rakmyat`), `status`, `locale_primary`, `seo_title_en/ar`, `seo_description_en/ar`, `published_at` |
| `blog_post_tags` | Many-to-many join between posts and tags | `post_id`, `tag_id` (composite primary key) |

Relationships:

- `blog_posts.category_id` → `blog_categories.id`, `ON DELETE SET NULL`. Deleting a category leaves its posts uncategorised.
- `blog_posts.post_type_id` → `blog_post_types.id`, `ON DELETE SET NULL`.
- `blog_post_tags.post_id` → `blog_posts.id` and `blog_post_tags.tag_id` → `blog_tags.id`, both `ON DELETE CASCADE`. Deleting a post or tag removes its join rows.

Constraints and indexes:

- `status` is one of `draft`, `published`, `archived`. Only `published` posts appear publicly.
- `locale_primary` is `en` or `ar`.
- Index on `(status, published_at DESC)` for the public list, plus indexes on `category_id` and `slug`.

Seed data (inserted by the migration with `ON CONFLICT DO NOTHING`):

- Post types: `article` (Article), `tutorial` (Tutorial), `case-study` (Case Study), `news` (News).
- Categories: `software-development`, `business-systems`, `web-development`, `ai-and-automation`.
- Tags: `nextjs`, `react`, `postgresql`, `typescript`, `arabic`, `rtl`, `seo`, `performance`.

The local development database also holds three sample posts (`building-arabic-rtl-nextjs`, `postgresql-for-saas-applications`, `when-does-a-business-need-custom-software`). They were added during local setup and are not part of the migration.

## Code map

| Area | File |
|---|---|
| Types and Zod schemas (`blogPostCreateSchema`, `blogPostUpdateSchema`, `isSafeImageUrl`) | `lib/blog-schema.ts` |
| Server queries (list, pagination, filters, single post, related posts, published slugs) | `lib/server/blog.ts` |
| Public API | `app/api/blog/posts/route.ts`, `app/api/blog/filters/route.ts` |
| Admin API | `app/api/admin/blog/**` |
| Public pages | `app/[locale]/blog/page.tsx`, `app/[locale]/blog/[slug]/page.tsx` |
| Public components | `components/sections/BlogIndexSection.tsx`, `BlogPostSection.tsx`, `BlogPostCard.tsx`, `BlogProgressBar.tsx`, `BlogShareBar.tsx`, `Blog.module.css` |
| UI copy | `content/blog-copy.ts` |
| Admin UI | `components/admin/AdminBlog.tsx`, `AdminBlogTaxonomy.tsx`, `RichTextEditor.tsx`, `MediaLibrary.tsx` |
| Admin pages | `app/admin/blog/page.tsx`, `app/admin/blog/categories/page.tsx`, `app/admin/blog/tags/page.tsx` |
| Sitemap | `app/sitemap.ts` (includes the blog index and published posts) |

## Admin access

- URL: `http://localhost:5175/admin/blog` (sign in at `/admin/login`)
- Credentials: the admin email and password set up for local development. They are in your local setup notes, not in this repository. Use `npm.cmd run admin:create` to create an account (see the [admin dashboard guide](../admin-dashboard/README.md#creating-an-admin-account)).

The blog admin requires a valid admin session. Unauthenticated requests are redirected to `/admin/login`.

## Admin features

- **Posts** (`/admin/blog`, Posts tab): list, filter, create, edit, and delete posts. Each post has EN and AR titles, excerpts, and bodies; SEO title and description per language; a category; a post type; tags; an author name; a status (`draft`, `published`, `archived`); and a cover image.
- **Rich text body**: a TipTap v3 editor for each language. It supports H1/H2/H3, bold, italic, strike-through, text alignment, text colour, highlight, bullet and ordered lists, blockquote, inline code, links, images from the media library, YouTube embeds, and undo/redo.
- **Cover image**: pick from the media library or paste a URL. Only URLs that pass `isSafeImageUrl` are accepted.
- **Categories** (`/admin/blog/categories`): create, edit, and delete. Deleting a category sets `category_id` to null on its posts.
- **Tags** (`/admin/blog/tags`): create, edit, and delete. Deleting a tag removes it from all posts.
- **Post types**: view-only. The four built-in types (Article, Tutorial, Case Study, News) are seeded by the migration. The API exposes them with `GET /api/admin/blog/post-types`, and no create or edit endpoint exists.
- **Media library**: upload images and videos, browse the library, and insert files into a post. Details in the [admin dashboard guide](../admin-dashboard/README.md#media-library).

## Public API

Both endpoints are unauthenticated, return JSON, and send `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`. Invalid parameters return `400` with `Cache-Control: no-store`. A database failure returns `503` with `{"error":"service_unavailable"}`.

### `GET /api/blog/posts`

Returns one page of published posts, plus the category and tag lists (same data as `/api/blog/filters`).

| Param | Default | Rules |
|---|---|---|
| `page` | `1` | Positive integer, capped at 100000 |
| `limit` | `10` | Positive integer, capped at 10 |
| `category` | none | Category slug (lowercase letters, digits, and hyphens; ≤80 characters) |
| `tag` | none | Tag slug (same rules as `category`) |
| `author` | none | Exact author name, trimmed, ≤160 characters |
| `q` | none | Search text, trimmed, ≤120 characters |
| `sort` | `newest` | One of `newest`, `oldest`, `az`, `za` |
| `locale` | `en` | `en` or `ar`; selects which language's fields are returned |

Error codes: `invalid_page`, `invalid_limit`, `invalid_sort`, `invalid_locale`, `invalid_category`, `invalid_tag`.

Example: `GET /api/blog/posts?page=2&category=web-development&sort=az&locale=ar`

### `GET /api/blog/filters`

Returns all categories and all tags for the filter controls. No parameters.

## Public pages

### Archive: `/[locale]/blog`

Server-rendered first page (10 posts, newest first), then client-side behaviour from `BlogIndexSection.tsx`:

- Search box (`q`), category, tag, and author filters, and sort (newest, oldest, A–Z, Z–A).
- Pagination at 10 posts per page, handled in the client.
- Grid view (default, three columns) and list view.
- Filter state is synced to the URL, so filtered views can be bookmarked and shared.
- Skeleton cards while results load.

URL parameters:

| Param | Meaning | Written to URL only when |
|---|---|---|
| `q` | Search text | not empty |
| `category` | Category slug | set |
| `tag` | Tag slug | set |
| `author` | Author name | set |
| `sort` | Sort key | not `newest` |
| `view` | `list` (grid is default) | `list` |
| `page` | Page number | greater than 1 |

Example: `/en/blog?category=web-development&sort=az&view=list&page=2`

### Author filter: `/[locale]/blog?author=Name`

There is no separate author page. Each post's author name links to `/[locale]/blog?author=<encoded name>`, which is the archive filtered to that author. The archive shows an active-filter chip you can clear.

### Post: `/[locale]/blog/[slug]`

- Breadcrumb, reading progress bar (`BlogProgressBar`), and a share bar (`BlogShareBar`): X/Twitter, WhatsApp, LinkedIn, Facebook, and copy link.
- Body rendered from the stored HTML. Plain-text bodies are handled by an `isRichHtml` fallback.
- Author link to the filtered archive, and related posts (`listRelatedBlogPosts`).
- JSON-LD: `Article` on every post, and `BreadcrumbList` on the breadcrumb.

Body HTML is not sanitised on render. See [Known issues](../KNOWN-ISSUES.md).

## Caching

| Layer | Setting | Effect |
|---|---|---|
| Archive and post pages | `export const revalidate = 3600` | ISR: regenerated at most once per hour |
| `GET /api/blog/posts`, `GET /api/blog/filters` | `s-maxage=3600, stale-while-revalidate=86400` | Shared caches hold responses for one hour and may serve stale responses for up to a day while revalidating |
| Admin API | `Cache-Control: private, no-store, max-age=0` | Never cached |
| Server queries | React `cache()` in `lib/server/blog.ts` | Deduplicates within one render only |

Admin saves do not trigger on-demand revalidation. A publish or edit can take up to an hour to appear on public pages and in the public API. Adding `revalidatePath` or `revalidateTag` calls to the admin write handlers would fix this (tracked in [Known issues](../KNOWN-ISSUES.md)).

## Running locally

1. Start PostgreSQL 17 on `localhost:5432`, with database `rakmyat` and user `rakmyat_dev`.
2. Check `.env.local` for `DATABASE_URL`, `DATABASE_SSL=false`, `RATE_LIMIT_SECRET` (at least 32 characters), and `ADMIN_IP_ALLOWLIST`.
3. From `next-app/`, apply migrations, including `0003_blog.sql`:

   ```powershell
   npm.cmd run db:migrate
   ```

   The blog migration uses `CREATE ... IF NOT EXISTS` and `ON CONFLICT DO NOTHING`, so re-running it is safe.

4. Start the dev server:

   ```powershell
   npm.cmd run dev
   ```

5. Check the public side: `http://localhost:5175/en/blog` and `http://localhost:5175/ar/blog`. Check the API: `http://localhost:5175/api/blog/posts`.
6. Sign in at `http://localhost:5175/admin/login`, then open `http://localhost:5175/admin/blog`.

Use `localhost`, not `127.0.0.1`, for the admin pages. Session cookies are host-scoped (see [Known issues](../KNOWN-ISSUES.md)).
