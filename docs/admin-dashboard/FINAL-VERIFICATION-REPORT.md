# Admin Dashboard — Final Verification Report

> Date: 2026-10-24
> Status: Complete with Documented Limitations

Status labels used below:

- **Verified**: run and observed in this session.
- **Implemented**: code exists and was read, but was not exercised end to end.
- **Not Verified**: not tested.

## Summary

- One defect was found and fixed: category and tag mutations did not refresh the public blog cache (details under "Defect fixed").
- Production-build cache behaviour was checked against a real `next start` server (not dev mode).
- Several items are Implemented but not exercised end to end. They are listed under Known Limitations.

## Phase A — Blog CRUD and Taxonomy

| Item | Status | Evidence |
|---|---|---|
| Create post (`POST /api/admin/blog/posts`, always stored as draft) | Verified | Playwright test 8 (create via UI), test 11 (create, reopen, edit, delete) |
| Edit post (`PATCH /api/admin/blog/posts/[id]`) | Verified | Playwright test 11 (edit through the admin routes) |
| Slug-change revalidation of old and new post URLs | Implemented | Code read only; no slug-change test |
| Delete post | Verified | Playwright test 11; production probe removed the probe post from the index |
| Post list search and filter | Verified | Playwright test 11 searches the list by slug |
| Category create / edit / delete (API) | Verified | Dev-server round trip: POST 201, PATCH 200, DELETE 200 (scratch script, net zero rows) |
| Tag create / edit / delete (API) | Verified | Dev-server round trip: POST 201, PATCH 200, DELETE 200; production create and rename confirmed on the index |
| Category and tag pages load | Verified | Playwright tests 16 and 17 |
| `AdminBlogTaxonomy` click handlers and validation | Implemented | Read in full; no click-through test |
| Post types list (read-only) | Implemented | Read in full |

## Phase B — Media Library and shadcn/ui

| Item | Status | Evidence |
|---|---|---|
| `/admin/media` loads for an authenticated admin | Verified | Playwright test 18 |
| `/admin/media` unauthenticated redirect | Verified | Dev server: 307 to `/admin/login` |
| `GET /api/admin/media` | Verified | Anonymous: 401. Authenticated: 200, lists 1 image (`.webp`) |
| Upload: MIME allowlist, magic-byte check, 50 MB limit | Implemented | Code read; no upload performed this session |
| Upload: sharp resize to fit 1920x1080 and WebP output | Implemented | Code read. A `.webp` file already present in `public/uploads/images` is consistent with it, but no new upload was run |
| Delete: path-traversal guard (uploads dirs only) | Implemented | Code read |
| `public/uploads/images` and `public/uploads/videos` exist | Verified | Directory check |
| shadcn `Button`, `Badge`, `Card`, `Input` exist and compile | Verified | `tsc`, ESLint, production build |
| shadcn refactor visual parity | Not Verified | No screenshot comparison |

## Phase C — Database Indexes and Cache Invalidation

| Item | Status | Evidence |
|---|---|---|
| `blog_posts_title_en_trgm_idx` | Verified | `pg_indexes` query |
| `blog_posts_title_ar_trgm_idx` | Verified | `pg_indexes` query |
| `blog_posts_excerpt_en_trgm_idx` | Verified | `pg_indexes` query |
| `blog_posts_excerpt_ar_trgm_idx` | Verified | `pg_indexes` query |
| `blog_posts_author_name_idx` | Verified | `pg_indexes` query |
| `blog_posts_status_category_published_idx` | Verified | `pg_indexes` query |

The `pg_indexes` query returned 11 indexes on `blog_posts`, including the six above and the pre-existing primary key, slug, category, and status/published indexes.

| Item | Status | Evidence |
|---|---|---|
| Public pages return 200: `/en/blog`, `/ar/blog`, `/en/blog/building-arabic-rtl-nextjs`, `/en`, `/ar` | Verified | Dev server, Node fetch |
| Public blog pages: no console errors | Verified | Headless Chromium on `/en/blog`, `/ar/blog`, and the sample post: 0 errors each |
| Home pages keep correct `lang` / `dir` and blog links | Verified | `/en`: `lang="en" dir="ltr"`, `/ar`: `lang="ar" dir="rtl"`, 12 blog links each |
| Post create / publish / delete refresh the cached index (production) | Verified | Probe on `next start`: primed index HIT, publish then MISS with the new title, delete then title gone. Probe post removed |
| Tag create and rename refresh the cached index (production) | Verified | Probe: new tag visible immediately, renamed tag shows new name, old name gone. Probe tag removed |
| Post page shows a renamed tag (production) | Verified | Probe post with a tag, tag renamed, post page shows the new name. Probe rows removed |
| Category rename / delete refresh the index (production) | Not Verified | Same code path as the tag routes, but not probed live |
| Public index cached at CDN level | Not Verified | No CDN in this environment. Index sends `s-maxage=3600` |

## Phase D — DOMPurify, Sharp, Autosave, Tests

| Item | Status | Evidence |
|---|---|---|
| `sanitizeBody` runs before INSERT in `POST /api/admin/blog/posts` | Verified | Code read (`route.ts` lines 77-78, 89-90); Playwright test 19 |
| `sanitizeBody` runs before UPDATE in `PATCH /api/admin/blog/posts/[id]` | Verified | Code read (lines 40-41); Playwright test 19 covers update |
| Sanitizer unit tests | Verified | `tests/sanitize-html.test.ts`: 26/26 |
| Autosave: `AUTOSAVE_DELAY_MS` = 3000, `autosaveStatus` state machine, debounced timer | Verified | Code read; Playwright test 15 (draft created after a pause) |
| Autosave cleanup on unmount (timer, status-reset timer, in-flight PATCH abort) | Implemented | Code read (lines 270-278) |
| Autosave guard: fires only for drafts (`canAutosave`) | Implemented | Code read. The guard requires `form.status === "draft"` and either a new post or a persisted draft. No E2E test on a published post |
| Sharp optimization on upload | Implemented | See Phase B |

## Test Results

All commands were run from `next-app`. Exit codes are as reported by the shell.

| Check | Command | Result |
|---|---|---|
| TypeScript | `node node_modules/typescript/bin/tsc --noEmit` | Exit 0, no errors (run before and after the edits) |
| ESLint (full project) | `node node_modules\eslint\bin\eslint.js . --ext .ts,.tsx --max-warnings=999` | Exit 0, no output (run before and after the edits) |
| Sanitizer tests | `node --import tsx --test tests/sanitize-html.test.ts` | 26 pass, 0 fail |
| Unit suite (4 files) | `node --import tsx --test tests/inquiry-schema.test.ts tests/inquiry-security-policy.test.ts tests/seo.test.ts tests/sanitize-html.test.ts` | 41 pass, 0 fail |
| Playwright (before edits) | `node "node_modules/@playwright/test/cli.js" test --config playwright.admin.config.ts` | 18 passed, 1 skipped (test 10) |
| Playwright (final) | Same command | 18 passed, 1 skipped (test 10) |
| Production build | `node node_modules/next/dist/bin/next build` | Exit 0, all routes compiled |
| Production probes | `next start -p 5180` plus scratch scripts | See Phase C. Server stopped afterwards |

Playwright test 10 is skipped by design. `ADMIN_IP_ALLOWLIST=127.0.0.1,::1,localhost` means the test machine is always allowlisted, so the rate-limit countdown is not reachable from this environment.

## Defect Fixed

**Category and tag mutations did not refresh the public blog cache.** The public index (`app/[locale]/blog/page.tsx`) and post pages use `revalidate = 3600` and render category and tag names. The category and tag routes performed writes without calling `revalidatePath`, so renames and deletes could show stale names for up to an hour.

Changes:

- `app/api/admin/blog/categories/route.ts`: POST refreshes `/en/blog` and `/ar/blog`.
- `app/api/admin/blog/categories/[id]/route.ts`: PATCH and DELETE refresh the index and `/[locale]/blog/[slug]` (type `page`). A local helper `revalidateBlogPages()` does this.
- `app/api/admin/blog/tags/route.ts`: POST refreshes the index.
- `app/api/admin/blog/tags/[id]/route.ts`: PATCH and DELETE refresh the index and post pages, via the same local helper.

Each `revalidatePath` call runs only after the write has committed. All four files compile, pass ESLint, and the dev-server round trip returns the expected status codes.

## Security Summary

- **Authentication**: admin API routes return 401 without a session. Admin pages redirect (307) to `/admin/login`. Verified for `/admin/blog`, `/admin/blog/posts/new`, `/admin/media`, and `/api/admin/media`.
- **Sessions**: random token, only its SHA-256 digest stored, 12-hour fixed expiry, cookies `HttpOnly` and `SameSite=Strict`, `__Host-` prefix and `Secure` in production. Cookie flags are Implemented (code read); HTTPS behaviour is Not Verified.
- **Origin checks**: admin mutations call `requireSameOrigin`, which rejects cross-origin requests with 403. Implemented (code read); no cross-origin test performed.
- **Rate limiting**: login limits of 10 failed attempts per IP and 6 per account per 15 minutes. Test 9 confirms a 429 with `Retry-After`. Verified.
- **Production fail-closed**: in production mode, login throws without `TRUSTED_CLIENT_IP_HEADER`, which surfaces as 503. Verified on the production build. See the deployment checklist.
- **Sanitization**: DOMPurify allowlist of tags and attributes. `href` and `src` limited to `https:`, `http:`, `mailto:`, and site-relative paths. Inline styles limited to `text-align`, `color`, and `background-color`. `iframe` only for YouTube embed URLs. Verified by unit tests and Playwright test 19.
- **Uploads**: MIME allowlist, magic-byte check, 50 MB limit, sharp re-encode and EXIF stripping for static images. Delete restricted to the two upload directories. Implemented (code read).

## Known Limitations

1. **Production build tested with `next start`, not the standalone output.** `next.config.ts` sets `output: "standalone"`, and `next start` printed a warning that it does not support that setting. The probes ran on `next start`. The `node .next/standalone/server.js` entry point was not tested.
2. **Post pages are not cached in the production build.** They send `Cache-Control: private, no-cache, no-store`. Only the index is cached (`s-maxage=3600`). The `/[locale]/blog/[slug]` invalidation is therefore defensive for now, but it still matters if post pages become cached later.
3. **No CDN purge.** A CDN in front of the site keeps serving the cached index until `s-maxage` expires. Per the Next.js docs, `revalidatePath` does not purge a CDN.
4. **Category rename and delete are not probed live in production.** The tag path is probed; the category path uses the same helper.
5. **Media upload not exercised this session.** The upload and sharp pipeline are Implemented only. No file was written to avoid changing `public/uploads`.
6. **Autosave edit guard not tested end to end.** The guard against autosaving published posts was read in code only.
7. **Taxonomy UI click-throughs not tested.** The API round trips were tested; the React handlers were read.
8. **Sanitizer strips some benign links.** Anchor-only `#section` links and relative links without a leading slash are removed by `isSafeUrl`. This is intentional but may surprise editors.
9. **Documentation drift in `docs/admin-dashboard/README.md`.** It says the sidebar has four items and the media library has no page; the code has five sidebar items including `Media Library` (`/admin/media`). It also mentions a Taxonomy tab on the blog page, which Playwright test 11 asserts is gone. The README was not changed in this pass.
10. **Visual parity not checked** for the shadcn-based screens.
11. **Other people's uncommitted changes.** `git status` showed uncommitted changes in `components/admin/AdminBlog.module.css`, `components/admin/AdminBlogPostEditor.tsx`, `components/admin/AdminMediaLibraryPage.tsx`, `components/projects/ProjectVisualFrame.tsx`, `next-env.d.ts`, and `tests/e2e/admin-blog-crud.spec.ts`. They are part of the tested tree, and none of them were modified in this pass.
12. **Build side effects.** `next build` ran while the dev server was up on port 5175. The dev server kept responding (200) afterwards.

## Production Deployment Checklist

- [ ] Set `TRUSTED_CLIENT_IP_HEADER` (for example `x-real-ip`) and make the reverse proxy overwrite it, along with `x-forwarded-host` and `x-forwarded-proto`. Without it, production login returns 503.
- [ ] Set `RATE_LIMIT_SECRET` to a unique value of at least 32 characters. Do not reuse the dev value.
- [ ] Serve the site over HTTPS, so `Secure` and `__Host-` cookies work.
- [ ] Replace the dev admin account. Create production admins with `npm.cmd run admin:create`. Do not use `admin@rakmyat.local` / `Rakmyat@Admin2026!`.
- [ ] Set `ADMIN_IP_ALLOWLIST` to only the operator IPs, or empty. The local `.env.local` includes `localhost`.
- [ ] Set `NEXT_PUBLIC_SITE_URL` and `ROBOTS_INDEXING_ENABLED` for the production origin.
- [ ] Apply `db/migrations/0004_blog_indexes.sql` manually. `npm run db:migrate` cannot be used because `schema_migrations` does not exist. The file is idempotent.
- [ ] Test the standalone server (`node .next/standalone/server.js`) with the same revalidation probes used here, and copy static assets as the standalone docs require.
- [ ] Configure CDN purging for `/en/blog` and `/ar/blog` if a CDN sits in front.
- [ ] Decide where uploads live. `public/uploads` on ephemeral disk is lost on redeploy. Back it up or move it to durable storage.
- [ ] Re-run the Playwright suite and the production probes against the deployed build.
