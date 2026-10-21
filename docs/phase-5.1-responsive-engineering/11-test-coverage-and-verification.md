# 11 — Test coverage and verification

## What ran and passed

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` (ESLint) | PASS, zero warnings |
| TypeScript | `npm run typecheck` (`tsc --noEmit`) | PASS |
| Unit tests | `npm test` (Node test runner) | 17/17 PASS — contact validation, phone normalization, rate-limit policy, portfolio media metadata, SEO/sitemap/canonical rules. Matches the Phase 4.9 baseline exactly; no regression from this session's edits. |
| Manual browser verification | Playwright MCP against the already-running dev server (`127.0.0.1:5175`) | See routes/viewports table below |

## What did not run, and why

- **No `.spec.ts` Playwright suite was executed.** The repository has two existing specs (`tests/e2e/phase43-contact.spec.ts`, `tests/e2e/portfolio-media.spec.ts`) that require a disposable Docker Postgres staging container (`scripts/run-phase43-e2e.mjs` truncates a staging rate-limit table via `docker exec` before running). Spinning up Docker infrastructure wasn't in scope for this pass; doing so is listed in [14-remaining-limitations.md](14-remaining-limitations.md).
- **No production build (`npm run build`) was run.** The dev server was already running and used directly; a production build/Docker image step is listed as a follow-up.
- **No dedicated responsive regression suite exists yet.** The brief asks for one; building it (route × locale × viewport × overflow/console/image assertions) is substantial new work, listed as a follow-up rather than rushed.
- **No cross-browser testing.** Only Chromium (via Playwright MCP) was available/used this session; Firefox/WebKit availability wasn't checked.
- **No formal accessibility automation (axe) run.** Phase 4.5 already has recorded axe results for representative routes; this session didn't duplicate that work or extend it to new routes.

## Manual verification performed this session

| Route | Locale | Viewports | What was checked | Result |
|---|---|---|---|---|
| `/` → `/ar` redirect | — | — | Arabic-default redirect | Confirmed working |
| Home | ar | 375, 1920 | Console errors, DOM overflow probe, mobile nav open/close/Escape/focus/scroll-lock, visual review | Clean |
| Portfolio listing | ar | 375 (full-page, pre- and post-scroll) | Overflow, image loading (lazy-load timing), card layout | Clean after accounting for lazy-load |
| Portfolio detail — all 9 case studies | ar | 375–390 | Overflow probe on all 9; deeper visual + console check on `schooly` (dashboard-style cover), `nora-store` (gallery + lightbox), `legal-translation` (tall-preview gallery image + lightbox zoom/scroll/pan/caption/nav) | Clean on all 9; tall-screenshot lightbox confirmed scrollable/zoomable per the brief's explicit requirement |
| Contact | ar | 390 (full-page) | Field containment, required/optional labeling, overflow | Clean |
| About, Services, How-we-work | ar | 375 (full-page) | Overflow, console errors, visual composition | Clean |
| Services-details | ar | 375, 834, 1440 | Full audit — **2-part defect found and fixed** (breadcrumb separator + rocket/heading overlap, worst at desktop) | Fixed, verified before/after at all three widths |
| Services-details | en | 375 | Confirmed the fix generalizes to LTR | Clean |
| Admin login | — (unlocalized) | 375, 1440 | Form field containment — **defect found and fixed** | Fixed, verified before/after |
| Admin inquiries | — | — | Reviewed via source read only (`components/admin/AdminInquiries.tsx` + its CSS) — no local database to authenticate against | Not re-rendered; flagged in limitations |

## Methodology note: lazy-loaded images and full-page screenshots

Twice this session, a `fullPage: true` screenshot taken immediately after navigation showed large blank gaps where project images should be. In both cases this was `next/image`'s default lazy-loading: images below the initial viewport hadn't entered the viewport (and therefore hadn't started loading) at the moment the screenshot tool captured the page. Scrolling through the full page first (triggering the lazy-load `IntersectionObserver`s) and then re-capturing resolved it every time, confirmed against `browser_network_requests` showing all expected images returning `200`.

This matters for any future automated responsive suite built from this work: **a screenshot-based overflow/visual-regression check must scroll the page through its full height before capturing**, or it will produce false-positive "missing image" defects on every route with more than one viewport-height of lazy content. This is a test-harness requirement, not a site defect, and is recorded here so it isn't rediscovered as a false bug report later.

## Methodology note: `position: fixed` elements and viewport screenshots on tall pages

On `/ar/how-we-work` (a very tall page — ~14,000px full-page height at mobile width), a `fullPage: false` viewport screenshot taken after scrolling ~35% down appeared to show the site's fixed nav bar rendered mid-page, overlapping body content, instead of pinned to the top where it belongs. Two independent live DOM probes taken immediately afterward — `document.querySelectorAll('.navbar, [class*="navbar"]')` (found exactly one `<nav>`, `position: fixed`, `top: 0`) and `document.elementFromPoint()` at the exact pixel coordinates where the screenshot showed the "duplicate" (returned ordinary paragraph text, not the nav) — both contradicted the screenshot. The real, live layout is correct; the screenshot was not representative of it.

This is a known category of issue with Chrome DevTools Protocol screenshot capture and `position: fixed` elements on pages with very large scroll heights, not a site defect. The practical implication for a future automated suite: **don't assert on the pixel position of fixed-position elements from a screenshot alone on long pages** — verify with `getBoundingClientRect()`/`elementFromPoint()` (as done here) instead, or treat screenshot-based fixed-element checks as advisory only.

## Process note: fixes were re-checked at adjacent breakpoints, not just their target one

The services/details fix (see [02](02-responsive-defect-matrix.md), [03](03-fixes-applied.md)) went through two self-caught regressions before landing: a mobile-scoped fix turned out to leave desktop worse, and the subsequent desktop fix's `!important` briefly broke mobile by not being scoped to a matching `@media` range. Both were caught by deliberately re-screenshotting the *other* breakpoint immediately after each change, not by reasoning about the CSS changes in isolation. This is recorded as a standing practice this session followed, worth keeping: **any fix that uses `!important` (necessary here because of vendor stylesheet load order — see [03](03-fixes-applied.md)) must be re-verified at every breakpoint it could possibly affect, not just the one it targets**, since `!important` overrides cascade order but not `@media` scoping, and an unscoped `!important` rule applies everywhere.
