# Admin Dashboard — Audit & Roadmap

> **Status date:** 2026-10-23  
> **Environment:** localhost:5175 · PostgreSQL 17 · Next.js 16 App Router  
> **Purpose:** Full current-state audit + prioritised next-step plan. No code changes are made in this document.

---

## 1. Current State Summary

### 1.1 What exists today

| Area | Status | Notes |
|------|--------|-------|
| Sidebar navigation | ✅ Working | `AdminShell.tsx` — Inquiries, Blog Posts, Categories, Tags, Sign out |
| Admin login / session | ✅ Working | `admin@rakmyat.local`, 12-hour session, `__Host-` cookie in prod |
| Rate limiting + IP allowlist | ✅ Working | `ADMIN_IP_ALLOWLIST`, `Retry-After` header, read-only check on success |
| Inquiries page | ✅ Working | List, filter, status, notes, pagination, security panel |
| Blog — post list view | ✅ Working | Paginated list, metrics, filter by status/category/search |
| Blog — create / edit form | ⚠️ Partial | Exists as an **in-page view state** (`view === "edit"`), NOT a dedicated URL route |
| Blog — taxonomy (Categories/Tags/Post Types) | ⚠️ Partial | Exists as a tab inside `/admin/blog` AND as `/admin/blog/categories` and `/admin/blog/tags` pages — duplicated, inconsistent |
| TipTap rich text editor | ✅ Installed | H1–H3, bold/italic, colour, align, lists, blockquote, code, link, image, YouTube |
| Media library modal | ⚠️ Partial | Exists as a floating modal, **no dedicated page**, no routing |
| String encoding in admin components | ❌ Broken | 1 053 mojibake sequences in `AdminBlog.tsx`, 930 in `AdminBlogTaxonomy.tsx`, 111 in `RichTextEditor.tsx` — Arabic labels show as `Â·`, `Ù…`, `Ø±` etc. |
| shadcn/ui | ❌ Not installed | No Tailwind, no `components/ui/`. Current admin uses plain CSS classes in `app/globals.css` |
| Dedicated `/admin/blog/posts/new` route | ❌ Missing | Create post is a view-state switch, not a navigable URL |
| Dedicated `/admin/blog/posts/[id]/edit` route | ❌ Missing | Edit post is also a view-state switch |
| Dedicated `/admin/media` page | ❌ Missing | Only a modal, no standalone browse/manage page |
| Blog post count | 3 posts | All published, plain-text bodies (not rich HTML yet) |

---

## 2. Detailed Findings

### 2.1 — Encoding bug (CRITICAL — P0)

**Problem:** `AdminBlog.tsx`, `AdminBlogTaxonomy.tsx`, and `RichTextEditor.tsx` were written with UTF-8 content but stored/read as Windows-1252. Result: every Arabic label and the `·` separator renders as mojibake in the browser.

**Examples:**
- `"Draft · مسودة"` stored as `"Draft Â· Ù…Ø³ÙˆØ¯Ø©"`
- `"Published · منشور"` stored as `"Published Â· Ù…Ù†Ø´ÙˆØ±"`
- `"New post · منشور جديد"` stored as `"New post Â· Ù…Ù†Ø´ÙˆØ± Ø¬Ø¯ÙŠØ¯"`

**Impact:** All bilingual labels in the blog admin UI are unreadable.

**Fix:** Re-save all three files as UTF-8 without BOM, replacing every mojibake sequence with the correct UTF-8 text.

**Files affected:**
- `components/admin/AdminBlog.tsx` (1 053 matches)
- `components/admin/AdminBlogTaxonomy.tsx` (930 matches)
- `components/admin/RichTextEditor.tsx` (111 matches)

---

### 2.2 — No routing for Create / Edit post (P0)

**Problem:** Clicking "New Post" or clicking a post to edit does NOT navigate to a new URL. The `AdminBlog` component flips an internal `view` state variable between `"list"` and `"edit"`. This means:
- Browser back button doesn't work (goes to the list page instead of the previous site)
- Can't bookmark or link directly to a post editor
- Can't open a post in a new tab
- If the page refreshes while editing, all unsaved work is lost and you land on the list

**Missing routes:**
- `/admin/blog/posts/new` — create new post
- `/admin/blog/posts/[id]/edit` — edit existing post

**Fix:** Create dedicated Next.js App Router pages for these routes, moving the form logic out of `AdminBlog.tsx` into standalone page components.

---

### 2.3 — Taxonomy duplication and inconsistency (P1)

**Problem:** The taxonomy UI exists in two places:
1. As a "Taxonomy" tab inside `/admin/blog` (the `AdminBlogTaxonomy` component)
2. As standalone pages at `/admin/blog/categories` and `/admin/blog/tags`

The sidebar links to the standalone pages, but the blog page also has its own tab. This creates confusion — users don't know which one to use, and changes in one don't refresh the other.

**Fix:** Remove the Taxonomy tab from `/admin/blog`. Keep only the dedicated standalone pages. Update the sidebar to be the single entry point.

---

### 2.4 — No dedicated Media Library page (P1)

**Problem:** The media library only exists as a modal (`MediaLibrary.tsx`) that opens from within the post editor or the cover image field. There is no:
- `/admin/media` — standalone page to browse all uploads
- Ability to manage uploads outside of post editing
- Sorting or filtering in the library
- Bulk delete

**Missing routes:**
- `/admin/media` — full media library page with grid, upload, search, sort (by name/date/size), delete

---

### 2.5 — shadcn/ui not installed (P1)

**Problem:** The request is to use shadcn/ui for the dashboard UI. Currently:
- No Tailwind CSS installed
- No shadcn components in `components/ui/`
- All admin CSS uses hand-written classes in `app/globals.css`

**Blocker:** shadcn/ui requires Tailwind CSS. Installing Tailwind into an existing Next.js project that uses Bootstrap + theme CSS requires careful scoping to avoid style conflicts. The vendor `public/assets/css/style.css` must not be affected.

**Approach for installation:**
1. Install Tailwind with `--prefix` or scoped to `.admin-*` selectors only
2. Use `tailwind.config.ts` with `content` only pointing at `components/admin/**` and `app/admin/**`
3. Add `preflight: false` in Tailwind config to prevent CSS reset from breaking vendor styles
4. Install shadcn/ui components (Button, Input, Table, Dialog, Tabs, Badge, Select, Textarea, Label, Card, Toast)

---

### 2.6 — Rich text body not rendering in public posts (P2)

**Problem:** The 3 existing seed posts were created with plain text bodies (the editor didn't exist when they were seeded). The `isRichHtml()` function in `BlogPostSection.tsx` correctly detects plain text and renders it as paragraphs. But any new post created with TipTap will produce HTML output — and the current body columns in the DB are `text` (not sanitized). This is fine for admin-only authorship but is undocumented.

---

### 2.7 — Blog simulation data (P2)

**Current state:** 3 published posts, all plain-text bodies.

**Requested:** Simulate 1 000+ blog posts with realistic dummy data to test pagination, filtering, search performance, and UI behaviour at scale.

---

### 2.8 — No Media Library page route (P1)

**Current state:** `app/api/admin/media/route.ts` exists with GET (list) + POST (upload) + DELETE.  
**Missing:** A dedicated admin page at `/admin/media` that renders the library in a full-page layout (not a modal) with search, sort, and bulk operations.

---

## 3. Prioritised Roadmap (Next Steps)

### Phase A — Critical fixes (do first, unblocks everything)

| # | Task | Impact | Files |
|---|------|--------|-------|
| A1 | **Fix encoding** in AdminBlog.tsx, AdminBlogTaxonomy.tsx, RichTextEditor.tsx | All Arabic UI labels display correctly | 3 files |
| A2 | **Create `/admin/blog/posts/new` route** — dedicated page for creating a post | Proper routing, back button, bookmarkable | New: `app/admin/blog/posts/new/page.tsx`, new component `AdminBlogPostEditor.tsx` |
| A3 | **Create `/admin/blog/posts/[id]/edit` route** — dedicated page for editing | Same benefits as A2 | New: `app/admin/blog/posts/[id]/edit/page.tsx` |
| A4 | **Remove Taxonomy tab from `/admin/blog`** | Removes duplication, single source of truth | Edit: `AdminBlog.tsx` (remove `AdminBlogTaxonomy` import and tab), `AdminBlog.module.css` |

### Phase B — New pages and UI improvements

| # | Task | Impact | Files |
|---|------|--------|-------|
| B1 | **Create `/admin/media` page** | Full-page media library with sorting, filtering, bulk delete | New: `app/admin/media/page.tsx`, `AdminMediaLibrary.tsx`, `AdminMediaLibrary.module.css` |
| B2 | **Add Media to sidebar nav** | Media Library accessible from everywhere | Edit: `AdminShell.tsx` |
| B3 | **Install Tailwind + shadcn/ui** scoped to admin only | Modern component library, consistent UI | `tailwind.config.ts`, `postcss.config.ts`, install deps, scaffold `components/ui/` |
| B4 | **Refactor admin UI with shadcn components** | Production-quality, accessible UI | Replace manual CSS with Button, Input, Table, Dialog, Badge, Tabs, Select, Toast, Card |

### Phase C — Data and performance

| # | Task | Impact | Files |
|---|------|--------|-------|
| C1 | **Seed 1 000 blog posts** for simulation | Test pagination, search, sort at scale | New SQL seed script or Node script |
| C2 | **Add DB indexes** for blog search queries | Performance at 100k+ posts | `db/migrations/0004_blog_indexes.sql` |
| C3 | **Add ISR revalidation trigger** from admin save | Published content updates within seconds instead of 1 hour | PATCH handler calls `revalidatePath` |

### Phase D — Polish

| # | Task | Impact |
|---|------|--------|
| D1 | Playwright e2e tests for admin blog CRUD | Regression safety |
| D2 | Rich text body sanitization with DOMPurify | Defence-in-depth even for admin-only content |
| D3 | Image optimization on upload (resize, convert to WebP) | Smaller files, faster blog pages |
| D4 | Draft autosave | Prevent content loss on refresh |

---

## 4. File Map — What Needs to Change

### New files to create

```
app/admin/blog/posts/new/page.tsx          ← Create post page
app/admin/blog/posts/[id]/edit/page.tsx    ← Edit post page
app/admin/media/page.tsx                   ← Media library page
components/admin/AdminBlogPostEditor.tsx   ← Shared create/edit form component
components/admin/AdminMediaLibraryPage.tsx ← Full-page media library
components/admin/AdminMediaLibrary.module.css
db/migrations/0004_blog_indexes.sql        ← Performance indexes
db/migrations/0005_blog_seed_1000.sql      ← Simulation data (1 000 posts)
tailwind.config.ts                         ← Scoped Tailwind for admin
postcss.config.ts                          ← PostCSS for Tailwind
```

### Files to edit

```
components/admin/AdminBlog.tsx             ← Fix encoding, remove Taxonomy tab, remove in-page edit view
components/admin/AdminBlogTaxonomy.tsx     ← Fix encoding
components/admin/RichTextEditor.tsx        ← Fix encoding
components/admin/AdminShell.tsx            ← Add Media Library nav item
app/admin/blog/page.tsx                    ← Update to remove Taxonomy tab content
```

### Files that stay as-is

```
app/admin/blog/categories/page.tsx        ← Keep (becomes the only taxonomy entry point)
app/admin/blog/tags/page.tsx              ← Keep
app/api/admin/blog/**                     ← All API routes are correct
app/api/admin/media/route.ts              ← Keep (reuse in new page)
components/admin/MediaLibrary.tsx         ← Keep as modal (still used in post editor)
lib/server/blog.ts                        ← Keep
lib/server/security.ts                    ← Keep
```

---

## 5. Current Routing Map

```
/admin/login                         ← Login page (no sidebar)
/admin/inquiries                     ← Inquiries list (AdminShell + AdminInquiries)
/admin/blog                          ← Blog post list + in-page create/edit + Taxonomy tab (NEEDS SPLIT)
/admin/blog/categories               ← Category management (AdminShell + AdminBlogTaxonomy)
/admin/blog/tags                     ← Tag management (AdminShell + AdminBlogTaxonomy)

MISSING:
/admin/blog/posts/new                ← Should exist
/admin/blog/posts/[id]/edit          ← Should exist
/admin/media                         ← Should exist
```

---

## 6. Simulation Data Plan (1 000 posts)

### SQL seed strategy

Generate 1 000 blog posts with:
- Realistic slug patterns: `post-{n}-{category-slug}`
- Titles in EN and AR (template-based: "Guide to X", "How to Y", "Understanding Z")
- Excerpts (2–3 sentence templates, varied)
- Bodies (4–6 paragraph plain-text templates, 300–800 words each)
- Random category assignment (one of 4 categories)
- Random post type (one of 4 types)
- Random tag assignment (1–3 tags per post)
- Mix of statuses: ~700 published, ~250 draft, ~50 archived
- Published dates spread over the past 2 years
- Author names: "Rakmyat Team", "Rakmyat", "Tech Lead" (varied)

Delivered as `db/migrations/0005_blog_seed_1000.sql` using PostgreSQL `generate_series()` for efficiency — no application-level loop.

### Performance index to add alongside seeding

```sql
-- 0004_blog_indexes.sql
CREATE INDEX IF NOT EXISTS blog_posts_search_idx ON blog_posts
  USING gin(to_tsvector('simple', coalesce(title_en,'') || ' ' || coalesce(title_ar,'') || ' ' || coalesce(excerpt_en,'') || ' ' || coalesce(excerpt_ar,'')));

CREATE INDEX IF NOT EXISTS blog_posts_author_idx ON blog_posts(author_name);
CREATE INDEX IF NOT EXISTS blog_posts_category_status_idx ON blog_posts(category_id, status, published_at DESC);
```

---

*This document was generated from a live audit on 2026-10-23. No code was changed.*
