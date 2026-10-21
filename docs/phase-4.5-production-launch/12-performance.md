# Performance

Phase 4.2's paired lab reports are the baseline: mobile median LCP improved from 3.98s to 3.58s and transfer from 1,802 to 1,369 KiB; desktop LCP improved from 1.75s to 1.48s and transfer from 1,811 to 1,378 KiB. These are historical localhost lab measurements, not field Core Web Vitals.

Phase 4.5 local candidate measurements: Lighthouse 13.5.0, Chromium 156.0.8078.4, three runs per profile/route, devtools throttling, on the loopback production-mode Docker candidate at `127.0.0.1:5214`. Raw reports are in `lighthouse/`; full medians and sample metadata are in `lighthouse-summary.json`.

| Route | Profile | Score median | LCP / FCP | TBT | CLS | Transfer |
|---|---:|---:|---:|---:|---:|---:|
| `/en` | mobile | 0.80 | 3,614 / 3,614 ms | 255 ms | 0.00185 | 2,342 KB |
| `/ar` | mobile | 0.78 | 3,856 / 3,856 ms | 251 ms | 0.00160 | 2,344 KB |
| `/en/contact` | mobile | 0.84 | 3,299 / 3,299 ms | 161 ms | 0 | 897 KB |
| `/ar/contact` | mobile | 0.84 | 3,551 / 3,551 ms | 151 ms | 0 | 898 KB |
| `/en` | desktop | 1.00 | 434 / 416 ms | 0 ms | 0.00470 | 2,411 KB |
| `/ar` | desktop | 1.00 | 457 / 435 ms | 0 ms | 0.02028 | 2,413 KB |

These are lab measurements on a local candidate, not field Core Web Vitals; no live RUM/INP evidence exists. Lighthouse covered home and contact routes only, so it does not satisfy broader page-family sampling. Home mobile LCP remains a performance follow-up.

No assets or animations were removed. Production CDN/cache behavior and real user metrics cannot be verified before selecting the host. The final image is `rakmyat-phase45-candidate:20261020b` (manifest digest `sha256:9775a9a627565d43fc64497b3d43a1efbb715c9ace69737ee9c0485f76c8831e`). A read-only container exposed missing writable Next image-cache storage; production Compose now mounts a bounded private tmpfs at `/app/.next/cache`. The optimized-image endpoint returned HTTP 200 after this correction with no cache-write errors.
