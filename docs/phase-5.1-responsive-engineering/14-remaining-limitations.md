# 14 — Remaining limitations and next steps

**Updated after Session 4.** Session 1 found and fixed three defects via representative manual verification at Arabic/mobile. Session 2 built a 36-test automated suite and confirmed everything on 3 browser engines. Session 3 extended the full 15-viewport matrix to every content route and portfolio project, did the first English-locale deep visual review, and found one real defect (home hero heading). Session 4 finally resolved the oldest open item — live-data admin verification — using a fully isolated, disposable local database, and found one significant (but out-of-scope-to-fix) finding along the way: admin login doesn't work via `127.0.0.1`, only `localhost`. See [19-session-4-live-data-admin-verification.md](19-session-4-live-data-admin-verification.md).

## Still genuinely open

- **The `127.0.0.1` vs `localhost` admin-login origin mismatch.** Not a responsive-CSS issue, so Session 4 deliberately did not fix it (it's a CSRF-relevant same-origin security check; altering it needs explicit human review, not a unilateral edit). `requireSameOrigin()` in `lib/server/security.ts` compares the browser's real `Origin` (`http://127.0.0.1:5175`) against what Next.js/Turbopack's dev server reports as `request.url`'s hostname (`http://localhost:5175`) — these disagree only because this project's dev server is started with `--hostname 127.0.0.1` while Turbopack's dev-mode request handling appears to normalize the reported hostname to `localhost` regardless. Workaround: use `http://localhost:5175` for any testing that needs authenticated admin routes. Needs a deliberate decision (e.g., always test via `localhost`, or adjust the dev script, or extend the existing-but-incomplete `x-forwarded-host` handling) rather than a silent fix.
- **English-locale deep visual review, beyond home.** Session 3 did home (390/768/1440px) — which is what found the hero-heading defect — but About, Services, Services-details (beyond one Session 1 spot-check), How-we-work, Portfolio listing, and all 9 portfolio projects have still never had a human/screenshot-level visual pass in English, only Arabic.
- **Contact form.** Unchanged since Session 1's single 390px Arabic check and Session 3's 200% zoom check (both clean) — no deep English-locale or full-viewport-matrix review yet.
- **Manual accessibility sign-off.** Still outstanding exactly as Phase 4.9 documented before Phase 5.1 began. 200% zoom/reflow (Session 3) is not a substitute for real keyboard-only navigation, screen-reader, and contrast testing.
- **A production build.** No session has run `npm run build`; the dev server has been live throughout all four sessions and shares `.next` with the build output. Every finding is dev-mode-verified, not production-bundle-verified.
- **Visual regression / pixel-diff tooling.** The automated suite is structural (overflow, console/page errors, image-load success, interaction correctness, specific regression-guard assertions), not a pixel-level visual-diff system.
- **Docker/production-build/caching regression.** The Phase 4.3 Compose e2e flow and Phase 4.9's caching-header verification have not been re-run in any Phase 5.1 session — explicitly out of scope per the brief's instruction not to touch shared Docker infrastructure without cause. (Session 4 used its own separate, disposable database instead of touching that stack.)
- **A minor UX finding, noted but not fixed:** `AdminLogin.tsx`'s error-message mapping has no case for a `403` response (only `429` and `503` get specific messages), so the same-origin rejection above displays as "Email or password is incorrect" — indistinguishable from an actual wrong password. Worth a one-line fix in a future session focused on the admin UI itself.

## Resolved since Session 3 (previously listed here, no longer open)

- ~~Admin inquiries with live data~~ — Session 4 provisioned a fully isolated, disposable local database, seeded varied real-shaped test data, and confirmed all three Session 1 CSS fixes correct at 375/768/1440px, plus real end-to-end interactions (status update, search filter). Environment fully torn down afterward; see [19](19-session-4-live-data-admin-verification.md).

## Resolved since Session 2 (previously listed here, no longer open)

- ~~6 of 9 portfolio projects only had overflow-level coverage~~ — all 9 now have deep visual review (Session 3 covered the remaining 6; `schooly`, `nora-store`, `legal-translation` had it from Sessions 1–2).
- ~~Full 15-viewport matrix only applied to home~~ — now applied to all 6 content routes and all 9 portfolio projects, both locales, 30/30 genuine passes (Session 3, `full-matrix.spec.ts`).
- ~~200% zoom/reflow untested~~ — checked on home, contact, and admin login (Session 3); clean on all three. Not yet extended to every route.

## Resolved since Session 1 (previously listed here, no longer open)

- ~~No automated responsive regression suite~~ — built in Session 2, extended in Session 3 (67 distinct tests), 3 browsers, see [16](16-responsive-regression-suite.md).
- ~~Cross-browser coverage unknown~~ — Chromium, Firefox, and WebKit all confirmed installed and all three run clean.
- ~~Tablet/landscape viewports untested~~ — fully covered for every route via the Session 3 full-matrix expansion; phone landscape (844×390) manually spot-checked clean.
- ~~Viewport-measurement caveat (Session 1's Playwright-MCP session reporting ~331–341px instead of the requested width)~~ — not reproduced in Sessions 2–4, which used Playwright Test directly and got exact, correct `page.setViewportSize()` values throughout.

## Explicitly still out of scope (unchanged)

- **Performance/Lighthouse** — not measured in any session. No before/after numbers exist, so none are claimed.
- **Docker-dependent e2e** (`phase43-contact.spec.ts`, the Phase 4.3 Compose flow against the *shared* staging stack) — deliberately not run, per the brief's prohibition on touching shared staging infrastructure without a positively-identified disposable instance. Session 4's own disposable database satisfied the spirit of this requirement without touching that stack.
- **The brief's full document template** — all four sessions produced documents with real content behind them rather than padding to a fixed count.

## Suggested next session scope

1. **Decide how to handle the `127.0.0.1`/`localhost` admin-login mismatch** — a deliberate choice (dev-script change, documentation-only workaround, or extending the existing partial `x-forwarded-host` handling), not a silent CSS-adjacent fix.
2. **English-locale deep visual review** of About, Services, How-we-work, Portfolio listing, and all 9 portfolio projects — Session 3 showed this finds real defects Arabic-only testing misses.
3. **Manual accessibility sign-off** per Phase 4.9's checklist (keyboard, screen reader, contrast, reduced motion) — 200% zoom alone isn't a substitute.
4. **A production build**, run with the dev server stopped (or from an isolated checkout), to confirm four sessions of dev-mode findings hold against the production bundle.
5. Extend 200% zoom/reflow checking beyond the 3 routes sampled so far.
