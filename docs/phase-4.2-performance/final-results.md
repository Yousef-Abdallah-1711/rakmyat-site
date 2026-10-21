# Final results

## Implemented

- Replaced 21 measured large decorative and section PNG references with lossless WebP, saving 1.30 MB across those source files while retaining the PNG originals.
- Converted nine Inter weights from TTF to WOFF2, reducing those font files by 66.1% and retaining original metric/glyph data.
- Added a Service Details-only high-priority preload for its CSS LCP background; made the first visible Portfolio grid image eager/high priority; gave About's measured hero illustration high fetch priority.
- Limited the Home carousel runtime to Home and project lightbox runtime to project detail pages. No page content, visual rules, routes, or form behavior were changed.

## Evidence

- 32 baseline and 32 paired after Lighthouse reports across eight page types, EN/AR, mobile/desktop. Mobile median transfer fell 24.1%, median LCP 10.1%; desktop transfer fell 23.9%, median LCP 15.5%.
- 160 responsive route/locale/viewport observations at widths 320 to 1440 px: all passed, including 900 px.
- Five interaction checks passed; zero browser errors.
- Typecheck, lint, all 15 unit tests, and isolated production builds passed.

## Limits

This remains local review evidence. Lighthouse samples are single lab runs, not field Core Web Vitals. One Services mobile run still showed a font-related CLS outlier; the attempted preload reduced CLS but raised LCP and was not retained. Contact delivery, production storage/providers, asset permissions, production CDN, deployment, and operations remain outside this performance phase. No deployment occurred.
