# 17 — Session 2 verified route × locale × viewport coverage matrix

States used: **PASS** (directly verified, automated or manual, with evidence), **BLOCKED** (could not run — reason given), **NOT TESTED** (in scope but not reached this session). Nothing below is marked PASS on the basis of source code alone or because another route shares a template — each row reflects an actual browser run.

## Content routes

| Route | Locale | Automated coverage | Manual coverage | Status |
|---|---|---|---|---|
| Home | ar, en | `smoke.spec.ts` (nav, errors, lang/dir); `overflow.spec.ts` full 15-viewport matrix; `images.spec.ts` (ar) | 1920px (session 1), 844×390 landscape (session 2) | **PASS** — 15/15 viewports × 2 locales, 3 browsers |
| About | ar, en | `smoke.spec.ts`; `overflow.spec.ts` 5-point core matrix | 375px full-page (session 1) | **PASS** — 5 viewports × 2 locales, 3 browsers |
| Services | ar, en | `smoke.spec.ts`; `overflow.spec.ts` 5-point core matrix | 375px full-page (session 1) | **PASS** — 5 viewports × 2 locales, 3 browsers |
| Services-details | ar, en | `smoke.spec.ts`; `overflow.spec.ts` 5-point core matrix; `images.spec.ts` rocket/heading-overlap guard (1440px) | 375/834/1440px ar, 375px en, with the Session 1 breadcrumb+rocket defect found and fixed (see [02](02-responsive-defect-matrix.md)) | **PASS** — 5 viewports × 2 locales, 3 browsers, plus the only confirmed-and-fixed defect this project has in this area |
| How-we-work | ar, en | `smoke.spec.ts`; `overflow.spec.ts` 5-point core matrix | 375px full-page incl. mid-scroll (session 1, also the source of the fixed-nav screenshot-artifact finding) | **PASS** — 5 viewports × 2 locales, 3 browsers |
| Portfolio listing | ar, en | `smoke.spec.ts`; `overflow.spec.ts` 5-point core matrix; `images.spec.ts` (en, all 9 cards) | 375px full-page pre/post scroll (session 1) | **PASS** — 5 viewports × 2 locales, 3 browsers |

Only `home` received the full 15-point matrix; the other 5 routes received the 5-point representative subset — see [16-responsive-regression-suite.md](16-responsive-regression-suite.md) for the documented rationale. This is template-level coverage for those 5 routes at those 5 specific viewports, not a claim that every one of the brief's 15 widths was individually exercised on every route.

## Portfolio case studies (9 projects × 2 locales = 18 routes)

| Coverage | Routes | Result |
|---|---|---|
| Overflow + route-renders at 390×844 | All 18 (`portfolio-media.spec.ts`, "all published project detail routes render in both locales") | **PASS** — re-run this session, 18/18 |
| Gallery lightbox: zoom, arrow-key nav, Escape, focus return | `en/projects/schooly` | **PASS** (`portfolio-media.spec.ts`) |
| Gallery lightbox: RTL semantics, mobile controls | `ar/projects/schooly` | **PASS** (`portfolio-media.spec.ts`) |
| Previous/next neighbor links, related-project links | `en/projects/schooly` | **PASS** (`portfolio-media.spec.ts`) |
| Image-load validation (gallery) | `ar/projects/nora-store` | **PASS** (`images.spec.ts`, new this session) |
| Deep visual review (session 1, not re-run) | `schooly` (dashboard-style), `nora-store` (gallery), `legal-translation` (tall-preview lightbox) | **PASS** (session 1 evidence, not re-verified this session — no code in this area changed) |
| Deep visual review | `edtech-platform`, `live-workshop`, `eduflow`, `gc-hardware`, `concord-crm`, `product-scraper` | **NOT TESTED** beyond the overflow/render check above |

## Admin

| Route | Coverage | Status |
|---|---|---|
| `/admin/login` | `smoke.spec.ts`: renders, no page/console errors, correct unlocalized behavior (`/ar/admin/login` → 404), 3 browsers | **PASS** |
| `/admin/inquiries` (unauthenticated, no local DB) | `smoke.spec.ts`: confirms the honest "Admin setup required" state and its sign-in link, 3 browsers | **PASS** (for this specific, correct, no-DB behavior) |
| `/admin/inquiries` (authenticated, with real data: filters, card list, pagination, status updates, private notes) | — | **BLOCKED** — no `DATABASE_URL` configured in this environment (see `docs/KNOWN-ISSUES.md`); the Session 1 CSS fixes to `.admin-shell`/`.admin-filters` remain unverified against live rendered data |

## Shared components

| Component | Coverage | Status |
|---|---|---|
| Mobile menu (open/close/Escape/scroll-lock) | `navigation.spec.ts`, ar + en, 3 browsers | **PASS** |
| Language switcher (both directions, preserves current page) | `navigation.spec.ts`, 3 browsers | **PASS** |
| Fixed nav (anchored to viewport top on a tall, scrolled page) | `navigation.spec.ts`, 3 browsers — also closes out the Session 1 "possible screenshot artifact" finding with a real geometry assertion | **PASS** |
| Portfolio card grid / image aspect-ratio reservation | `images.spec.ts` (en portfolio listing); session 1 CSS review | **PASS** |
| Gallery lightbox (Fancybox) | `portfolio-media.spec.ts` | **PASS** |
| Contact form | Session 1 only (375/390px, ar) | **NOT TESTED** this session; no code in this area changed |
| Footer | Visually present in every full-page screenshot taken across both sessions; no dedicated interaction test | **PASS** (visual only) — no footer-specific interactive behavior exists to test beyond links, which `smoke.spec.ts`'s "main content is non-empty" doesn't specifically probe |

## Browsers

| Engine | Version installed | Suite run | Result |
|---|---|---|---|
| Chromium | bundled with `@playwright/test` 1.64.1 | `tests/e2e/responsive/*` (36 tests) + `portfolio-media.spec.ts` (4 tests) | **PASS**, 40/40 |
| Firefox | bundled, pre-installed locally | `tests/e2e/responsive/*` (36 tests) | **PASS**, 36/36 (after fixing two Firefox-specific console-message wording mismatches in the test's own filter — see [16](16-responsive-regression-suite.md)) |
| WebKit | bundled, pre-installed locally | `tests/e2e/responsive/*` (36 tests) | **PASS**, 36/36 |

`portfolio-media.spec.ts` was only re-run against Chromium this session (it predates this session and already had established coverage); it was not re-run against Firefox/WebKit, since its config (`playwright.phase43.config.ts`) is shared with the Docker-dependent contact-form spec and wasn't the focus of this session's cross-browser work.

## Verification gates (re-run after every change)

| Gate | Command | Result |
|---|---|---|
| Lint | `npm run lint` | PASS, 0 errors, 0 warnings (10 transient warnings from an auto-fixable unused `eslint-disable` were introduced and then cleaned up mid-session — see [15](15-session-2-execution-report.md)) |
| TypeScript | `npm run typecheck` | PASS |
| Unit tests | `npm test` | 17/17 PASS, unchanged from session 1 baseline |
| Production build | `npm run build` | **NOT RUN** — the dev server was live on the same `.next` output directory throughout this session; running a build concurrently risks corrupting its cache. See [15](15-session-2-execution-report.md) for the explicit reasoning. |
