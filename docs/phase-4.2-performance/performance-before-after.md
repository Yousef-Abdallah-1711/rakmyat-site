# Performance before and after

## Measurement

Lighthouse CLI 13.5.0 measured the same isolated production app build before and after, with 32 paired reports: eight page types x two locales x mobile and desktop. Each pair used the same emulation settings. Each route/device/locale has one sample; Lighthouse runs are lab measurements and single-route values can vary. Raw reports are in [`reports/baseline/`](./reports/baseline/) and [`reports/after/`](./reports/after/). Per-route metrics are in [`reports/performance-comparison.csv`](./reports/performance-comparison.csv), with the median calculation in [`reports/performance-summary.json`](./reports/performance-summary.json).

## Median results

| Profile | Metric | Baseline | After | Change |
|---|---|---:|---:|---:|
| Mobile | Performance score | 75 | 79.5 | +4.5 points |
| Mobile | LCP | 3.98 s | 3.58 s | -0.40 s (-10.1%) |
| Mobile | FCP | 3.53 s | 3.58 s | +0.05 s |
| Mobile | TBT | 168 ms | 175 ms | +7 ms |
| Mobile | CLS | 0.00005 | 0.00004 | Both medians remain below 0.001 |
| Mobile | Transfer size | 1,802 KiB | 1,369 KiB | -434 KiB (-24.1%) |
| Desktop | Performance score | 90 | 94 | +4 points |
| Desktop | LCP | 1.75 s | 1.48 s | -0.27 s (-15.5%) |
| Desktop | FCP | 1.18 s | 0.94 s | -0.24 s (-20.3%) |
| Desktop | TBT | 0 ms | 0 ms | No median change |
| Desktop | Transfer size | 1,811 KiB | 1,378 KiB | -433 KiB (-23.9%) |

Mobile TBT and FCP did not improve in the median; the change is within the noise expected from these individual Lighthouse runs. The consistently lower transfer size is the strongest broad result.

## Page-level highlights

- Service Details mobile LCP fell from 10.92 to 3.51 s in English, and from 11.36 to 3.65 s in Arabic. Transfer fell from about 3,067 to 2,402 KiB for both locales.
- Portfolio mobile LCP fell from 5.44 to 3.50 s in English and from 7.82 to 3.76 s in Arabic. The first visible card image is no longer lazy loaded.
- About mobile LCP fell from 4.17 to 3.27 s in English and from 4.15 to 3.42 s in Arabic.
- Home mobile improved slightly in English (3.76 to 3.69 s), while its Arabic sample varied from 3.73 to 3.94 s. The Home LCP is a text heading, so the image and font payload work does not improve every single sample.
- Services and Nora Store detail LCP were approximately flat in the paired single runs.

No production origin, CDN, field Core Web Vitals, or deployment was available. The original design, page copy, routes, and interaction behavior were retained.
