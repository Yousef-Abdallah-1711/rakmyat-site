# Phase 4.7 — Rendering, Caching, and Load Readiness

This review implements static generation for the public EN/AR site, documents each cache layer, checks PostgreSQL and private routes against an isolated temporary database, and runs bounded local load tests. The evidence does not represent a production deployment or CDN test.

## Decision

**Public rendering: ready for a controlled release candidate. Formal 500-visitor capacity verdict: NOT VERIFIED.** A bounded local public page-and-asset test passed at 500 k6 VUs, but it did not exercise the full requested workload or cache stages. All 32 localized public routes were built as SSG and passed the route smoke check. The root and unprefixed aliases now default to Arabic; `/en` remains available. The local benchmark and its limits are recorded in [12-load-test-results.md](12-load-test-results.md). Production host sizing, external CDN behavior, and a representative full-stack network-path test remain unverified.

No production services or database volumes were used. The test database was a temporary PostgreSQL container bound to loopback with tmpfs data and was removed after evidence capture. Existing Phase 4.3 previews and persisted staging data were left alone.

The full mixed-journey and cache-stage benchmark was not repeated on 2026-10-20 because the shared host was already running other development stacks and Rakmyat staging was near its web-container memory limit. The environment check and safe resume conditions are recorded in [11-load-test-plan.md](11-load-test-plan.md).

## Evidence and implementation

- [01-current-rendering-audit.md](01-current-rendering-audit.md)
- [02-route-rendering-matrix.md](02-route-rendering-matrix.md)
- [03-static-and-isr-implementation.md](03-static-and-isr-implementation.md)
- [04-nextjs-cache-layers.md](04-nextjs-cache-layers.md)
- [05-cdn-and-http-caching.md](05-cdn-and-http-caching.md)
- [06-image-and-asset-caching.md](06-image-and-asset-caching.md)
- [07-javascript-and-hydration.md](07-javascript-and-hydration.md)
- [08-postgresql-performance.md](08-postgresql-performance.md)
- [09-contact-admin-cache-security.md](09-contact-admin-cache-security.md)
- [10-worker-performance.md](10-worker-performance.md)
- [11-load-test-plan.md](11-load-test-plan.md)
- [12-load-test-results.md](12-load-test-results.md)
- [13-before-after-comparison.md](13-before-after-comparison.md)
- [14-horizontal-scaling-readiness.md](14-horizontal-scaling-readiness.md)
- [15-regression-tests.md](15-regression-tests.md)
- [16-capacity-and-infrastructure.md](16-capacity-and-infrastructure.md)
- [17-remaining-risks.md](17-remaining-risks.md)
- [18-final-handoff.md](18-final-handoff.md)

## Reproduction

Use Node 22+ and the lockfile-pinned dependencies. Build with `NEXT_PUBLIC_SITE_URL`, `ROBOTS_INDEXING_ENABLED`, and a unique `NEXT_DEPLOYMENT_ID` set at build time. Run `node scripts/phase47-route-smoke.mjs` with `BASE_URL` pointed at the candidate. The bounded public journey workload is `k6 run --summary-export docs/phase-4.7-rendering-caching-load-testing/k6/500-vu-summary.json docs/phase-4.7-rendering-caching-load-testing/k6/public-journeys.js`.

The load script targets loopback by default. Change its target only for a separately approved, controlled test environment; do not point it at production or an unapproved public service.
