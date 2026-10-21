# 16 — Responsive regression suite

## What this is

A new, dedicated Playwright test suite at `tests/e2e/responsive/`, built in Session 2 to close the gap Session 1 explicitly flagged: no automated viewport/locale regression coverage existed beyond the narrow `portfolio-media.spec.ts` gallery tests. It reuses the project's existing Playwright installation and conventions (same `@playwright/test` version, same `tests/e2e/` root, same assertion style as `portfolio-media.spec.ts`) rather than introducing a new framework.

It is deliberately **separate** from `playwright.phase43.config.ts`. That config's `testDir` includes `tests/e2e/phase43-contact.spec.ts`, which requires a disposable Docker Postgres staging container and truncates a rate-limit table before running (`scripts/run-phase43-e2e.mjs`). This suite only exercises public, static-content pages against the already-running local dev server — no database, no Docker, nothing destructive, consistent with the Session 2 brief's explicit prohibition on running that runner without a positively-identified disposable database.

## Running it

**Run one Playwright Test invocation at a time against this repo.** Session 3 found that running multiple `playwright test` processes concurrently (even against different browser projects) causes them to collide writing to the shared `test-results/` output directory, producing spurious `ENOENT ... trace.zip` failures that look like test failures but are actually filesystem contention — see the "Known flakiness" section below. Always wait for one run to finish before starting another, including background runs.

```bash
# 1. Start the dev server if it isn't already running (separate terminal):
npm run dev

# 2. The core cross-browser suite (smoke + overflow + nav + images — 37 tests,
#    excludes full-matrix.spec.ts), one browser at a time, ~3-4 min each:
npx playwright test -c playwright.responsive.config.ts --project=chromium tests/e2e/responsive/smoke.spec.ts tests/e2e/responsive/overflow.spec.ts tests/e2e/responsive/navigation.spec.ts tests/e2e/responsive/images.spec.ts
npx playwright test -c playwright.responsive.config.ts --project=firefox  <same files>
npx playwright test -c playwright.responsive.config.ts --project=webkit  <same files>

# 3. The full 15-viewport matrix (all content + portfolio routes, Chromium
#    only — see "Viewport coverage strategy" below), ~15-20 min:
npx playwright test -c playwright.responsive.config.ts --project=chromium tests/e2e/responsive/full-matrix.spec.ts

# Running everything in testDir with no file filter (npm run responsive:e2e,
# or the command with no path arguments) executes the core 37 tests AND
# full-matrix.spec.ts's 30 tests together, 3x (once per browser project,
# though full-matrix.spec.ts skips itself on non-Chromium projects) — expect
# this to take significantly longer than the ~3 min Session 2 originally
# documented, now that full-matrix.spec.ts exists. Prefer the file-scoped
# commands above for predictable run times.
```

`RESPONSIVE_BASE_URL` overrides the target (defaults to `http://127.0.0.1:5175`, the project's standard dev port).

## File layout

| File | Purpose |
|---|---|
| `tests/e2e/responsive/helpers.ts` | Shared route/viewport data, the lazy-load-safe scroll helper, overflow measurement, and console/page-error collectors. Not a test file itself. |
| `tests/e2e/responsive/smoke.spec.ts` | Route smoke tests: navigation succeeds, no page/console errors, correct `lang`/`dir`, non-empty main content. Covers all 6 content routes × 2 locales, plus admin login/inquiries (unauthenticated-safe). |
| `tests/e2e/responsive/overflow.spec.ts` | Horizontal-overflow detection. Home gets the brief's full 15-viewport matrix in both locales; the other 5 content routes get a 5-point representative subset (see "Viewport coverage strategy" below) in both locales. |
| `tests/e2e/responsive/navigation.spec.ts` | Mobile menu open/close/Escape/scroll-lock (both locales), language-switcher round-trip (both directions, confirms it preserves the current page), and a regression guard for the Session 1 "fixed nav looked duplicated in a screenshot" false-positive — this test proves via `getBoundingClientRect` that the nav really is `position: fixed` and anchored to `y≈0` after scrolling a tall page, so that finding stays verified-correct going forward instead of resting on a one-off manual check. |
| `tests/e2e/responsive/images.spec.ts` | Image-load validation on representative routes (home, portfolio listing, a gallery-bearing portfolio detail page) plus regression guards for two fixed defects: the Session 1 services-details rocket/heading-overlap (bounding-box math, never intersects), and the Session 3 home-hero font-size fix (mobile size stays reduced, desktop size stays exactly 60px). |
| `tests/e2e/responsive/full-matrix.spec.ts` (Session 3) | The brief's full 15-viewport matrix applied to **every** content route and **every** portfolio detail route, both locales — 30 tests. Chromium-only by design (see the file's own header comment and "Viewport coverage strategy" below). |
| `playwright.responsive.config.ts` (repo root) | Config: 3 projects (chromium/firefox/webkit), `workers: 2`, `retries: 1` (see "Known flakiness" below), 30s default test timeout. |

Existing `tests/e2e/portfolio-media.spec.ts` (all 9 portfolio projects × 2 locales, gallery/lightbox interaction, zoom, keyboard nav, focus return) was **not duplicated** — it already covers that ground well and continues to run under `playwright.phase43.config.ts` exactly as before. This suite's `images.spec.ts` only spot-checks one gallery-bearing project (`nora-store`) to confirm image-loading specifically, not gallery interaction, which is already owned by that existing file.

## Viewport coverage strategy

The brief's full 15-viewport matrix (320×720 through 1920×1080, including both tablet-portrait and tablet-landscape orientations) is defined once in `helpers.ts` (`fullViewportMatrix`).

**As of Session 3**, it's applied in full to **every content route (6) and every portfolio detail route (9), both locales** — 30 tests in `full-matrix.spec.ts`, ~15-20 minutes, 30/30 passing. This directly satisfies the brief's own coverage requirement ("full 15-viewport sweep on every public route in both locales using the primary browser... full viewport matrix against every portfolio detail route in both locales where practical"). It's Chromium-only: the brief's own two-tier strategy asks for the full matrix on the *primary* browser and *representative* checks across all three engines — `overflow.spec.ts`'s existing cross-browser tests (below) already satisfy the representative side, and running the full 450-navigation sweep on 3 browsers would be ~45-60 minutes of largely redundant coverage for no proportional evidence gain.

`overflow.spec.ts` (Session 2, unchanged, still cross-browser) keeps its original two-tier split for the fast/representative cross-browser suite: home gets the full 15-viewport matrix in both locales; the other 5 content routes get a 5-point representative subset (`coreViewports`: 320×720, 390×844, 768×1024, 1024×768, 1440×900). This is intentionally narrower than `full-matrix.spec.ts` and kept that way — it's the file that runs on all 3 browsers every time, so it stays fast (~3-4 min/browser) by design.

All 9 portfolio detail pages × 2 locales also get overflow coverage at one viewport (390×844) via the existing `portfolio-media.spec.ts` "all published project detail routes render in both locales" test, cross-browser-capable (currently only re-verified on Chromium) via `playwright.phase43.config.ts`.

Phone landscape orientation (844×390) and tablet-landscape (1024×768, 1180×820) are present in the matrix; additional ad-hoc manual checks (via Playwright MCP, not this automated suite) confirmed: the mobile nav correctly renders below the ~1199.98px breakpoint even at 844×390 (Session 2), and 200% browser zoom reflows correctly on home/contact/admin-login without clipping (Session 3).

## Known flakiness and its fix

Session 2 found that running this suite at `workers: 4` produced an intermittent, non-deterministic failure in the mobile-menu-click test (`navigation.spec.ts`) — the same assertion (`aria-expanded` not flipping to `"true"` within 5s after a click), but on a different locale each run. Re-running the same test file serially (`--workers=1 --repeat-each=3`) passed 15/15 times with zero flakiness, confirming this was CPU/resource contention between parallel workers racing against a single local dev server, not a site bug or a test-logic bug. The config now uses `workers: 2` (enough parallelism to keep the full cross-browser run under ~3 minutes per browser) plus `retries: 1` as a safety margin — standard practice for absorbing rare environment-driven timing noise without masking a real, reproducible failure (a true bug fails on retry too; this doesn't).

## A second, more consequential methodology finding

Early runs of `images.spec.ts` reported 11 "broken" images on home and 1 on the portfolio listing — all large portfolio hero images, all requested at an oversized `w=3840` and never completing within a 15-second wait. Investigation (`curl` against the exact failing URL, direct DOM inspection via a throwaway debug spec) proved the images themselves were fine — a fresh `curl` fetch of the exact URL returned `200` in under 100ms — but the browser's own `<img>` element had `currentSrc: ""`, meaning it had never actually started loading. The cause: this suite's `scrollThroughPage` helper originally scrolled via `page.evaluate(() => window.scrollTo(...))`, and **programmatic `scrollTo` does not reliably trigger native `loading="lazy"` in headless Chromium automation** — confirmed by the fact that calling Playwright's `locator.scrollIntoViewIfNeeded()` on the same element immediately resolved it correctly to the expected `w=384` (matching Session 1's manual-testing findings exactly). `scrollThroughPage` was rewritten to use `page.mouse.wheel()`, a real input event, which fixed this completely and is now the standard scroll method for the whole suite. This is recorded here, not just fixed silently, because it's a transferable lesson for any future Playwright suite on this codebase that needs to exercise lazy-loaded content.

## A third methodology finding (Session 3): never run concurrent Playwright Test processes against this repo

Running `full-matrix.spec.ts` in the background while also running other `playwright test` invocations in the foreground (different browser projects, targeted re-runs) produced several `browserContext.close: ENOENT ... trace.zip` failures — a trace-artifact filesystem write error from multiple processes writing to the same `test-results/` directory simultaneously, not a real overflow assertion failure. Confirmed by re-running the affected tests in isolation (passed) and, for the one that still failed, with `--trace=off` entirely (passed in 31.7s, proving the overflow check itself was always correct). **Rule going forward: one Playwright Test invocation at a time against this repo, full stop** — this includes background runs. See [18-session-3-full-site-responsive-audit.md](18-session-3-full-site-responsive-audit.md) for the full incident account.

## What this suite does NOT cover (see also [14-remaining-limitations.md](14-remaining-limitations.md))

- The authenticated admin inquiries dashboard (filters, table/card list, pagination, status updates) — no local database. The suite does verify the honest "Admin setup required" state that renders without one, including at 200% zoom (Session 3, manual).
- English-locale deep visual review beyond home and services-details — the suite's smoke/overflow/image checks run in English, but no human screenshot review has happened for About, Services, How-we-work, Portfolio listing, or the 9 portfolio projects in English yet.
- axe or other automated accessibility scanning (Session 1/Phase 4.5 already has separate evidence for this; not duplicated here). 200% zoom/reflow was checked manually (Session 3, 3 routes) but isn't part of this automated suite.
- Visual regression (pixel-diff screenshot comparison) — this suite is structural/behavioral (overflow, errors, load success, specific regression-guard geometry/font-size assertions), not visual-diff based.
- A production build (`next build`) — this suite runs against `next dev`; see [18-session-3-full-site-responsive-audit.md](18-session-3-full-site-responsive-audit.md) for why it remains blocked across all three sessions.
