# Mobile and responsive performance

## Lighthouse mobile profile

The paired mobile reports used 412 x 823 CSS pixels, 1.75 device scale factor, 4x CPU slowdown, 150 ms RTT, and 1.6 Mbps download. Across 16 routes/locales, median transfer fell by 24.1%, from 1,802 to 1,369 KiB. Median LCP fell by 10.1%, from 3.98 to 3.58 seconds. LCP improvements are concentrated on About, Portfolio, and Service Details; the per-page table is in [`performance-before-after.md`](./performance-before-after.md).

## Layout matrix

A Playwright pass checked all eight page types in English and Arabic at 320, 360, 390, 412, 430, 768, 900, 1024, 1280, and 1440 CSS pixels: 160 observations, 160 passed. The test verifies successful response, a visible H1, correct localized `lang` and `dir`, no document-level horizontal overflow, and the navigation toggle at the Bootstrap `xl` breakpoint.

The 900 px view uses the collapsed menu in both locales. It opens and closes with Escape, returning focus to the menu button. Screenshots for the Home, Service Details, Portfolio, and Contact pages are saved at 320, 900, and 1440 px in [`reports/responsive/screenshots/`](./reports/responsive/screenshots/). Machine-readable observations are in [`reports/responsive/viewport-observations.csv`](./reports/responsive/viewport-observations.csv).

A hidden fixed-position scroll-to-top control can extend `body.scrollWidth` in the 1024 px sample while `documentElement.scrollWidth` remains equal to the viewport. The responsive check measures the document scroll width, which reflects actual horizontal scrolling; it does not flag this off-canvas fixed control.

These are measured browser sizes, not a guarantee for every device, browser, zoom level, or embedded webview.
