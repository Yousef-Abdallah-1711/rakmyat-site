# Phase 4.2 performance work

This report documents a local production-build baseline, measured performance changes, and responsive/interaction regression checks for Rakmyat. The work used an isolated copy of the app. It did not deploy, change dependency versions, or alter the shared environment.

## Reports

- [Baseline diagnosis](./baseline-diagnosis.md)
- [Performance before and after](./performance-before-after.md)
- [LCP investigation](./lcp-investigation.md)
- [Image optimization](./image-optimization.md)
- [JavaScript and hydration](./javascript-and-hydration.md)
- [CSS and fonts](./css-and-fonts.md)
- [Caching and rendering](./caching-and-rendering.md)
- [Mobile and responsive performance](./mobile-performance.md)
- [Visual regression review](./visual-regression.md)
- [Interaction regression checks](./interaction-regression.md)
- [Remaining bottlenecks](./remaining-bottlenecks.md)
- [Final results](./final-results.md)

## Raw evidence

- [`reports/baseline/`](./reports/baseline/) and [`reports/after/`](./reports/after/) contain the 64 Lighthouse JSON reports.
- [`reports/traces/`](./reports/traces/) contains four compressed baseline traces, DevTools logs, and an index.
- [`reports/performance-comparison.csv`](./reports/performance-comparison.csv) contains the per-route paired metrics; [`reports/performance-summary.json`](./reports/performance-summary.json) contains profile medians.
- [`reports/responsive/`](./reports/responsive/) contains 160 responsive observations, five interaction results, and representative WebP screenshots.
- [`reports/experiments/font-preload/`](./reports/experiments/font-preload/) records the font preload experiment that was rejected because it raised LCP.

## Reproduce the browser checks

After starting the production build at `http://127.0.0.1:5214`, run:

```powershell
python .\scripts\responsive-and-interaction-check.py `
  --base-url http://127.0.0.1:5214 `
  --output-dir .\reports\responsive
```

The Lighthouse profile used CLI 13.5.0, 412 x 823 mobile emulation, 4x CPU slowdown, 150 ms RTT, and 1.6 Mbps download; desktop used Lighthouse's desktop profile. The isolated build was checked with `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`.

**No deployment occurred. The site is still not production ready.** The wider readiness blockers in the Phase 4.1 scorecard remain.
