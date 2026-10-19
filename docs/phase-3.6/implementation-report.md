# Phase 3.6 ? Custom Service Icons

Date: 2026-10-19  
Branch: `phase-3/rakmyat-content-only`  
Status: implemented and validated locally; not deployed.

## Summary

Replaced the eight images in the shared ?Connected software capabilities? section with a cohesive set of individually generated blue 3D illustrations. The section remains eight cards; all headings, copy, ordering, card/grid geometry, spacing, responsive breakpoints, and other website sections remain unchanged. The homepage and Services route use the same component, so both now use the new icon family.

The supplied pasted attachment contained the task brief but no separate screenshot image. The current section and its eight existing icons were used to match the site?s palette and composition. Generated master images are preserved in the local generation directory; optimized transparent WebP deliverables are tracked below.

## Icon assets

| Capability | Asset |
|---|---|
| Business websites | `public/assets/img/icons/service-capabilities/business-websites.webp` |
| E-commerce | `public/assets/img/icons/service-capabilities/ecommerce.webp` |
| Mobile applications | `public/assets/img/icons/service-capabilities/mobile-applications.webp` |
| Custom business systems | `public/assets/img/icons/service-capabilities/business-systems.webp` |
| AI assistants | `public/assets/img/icons/service-capabilities/ai-assistants.webp` |
| Task automation | `public/assets/img/icons/service-capabilities/task-automation.webp` |
| APIs and integrations | `public/assets/img/icons/service-capabilities/api-integrations.webp` |
| Data workflows | `public/assets/img/icons/service-capabilities/data-workflows.webp` |

Each image is 1024?1024 with alpha transparency and is rendered in the existing 80?80 CSS image box with `object-fit: contain`. Transparent padding was normalized to keep a consistent apparent scale. File hashes, dimensions, content bounds, and byte sizes are recorded in [asset-manifest.json](./asset-manifest.json). The labeled [icon contact sheet](./icons-contact-sheet.png) shows the eight together.

The original theme applied a deep 25px image drop shadow that competed with the new illustrations? own contact shadows. A narrowly scoped image-only override in `app/globals.css` reduces that to a 4px/6px shadow. Card hover shadows and title transitions remain unchanged. Computed style comparison is in [interaction-qa.json](./interaction-qa.json).

## Before and after captures

The Home section was captured before and after at both locales and all requested widths. Services captures confirm the shared component there as well. Section-only captures hide the fixed navigation only for screenshot clarity.

- English 1440: [before](./screenshots/before/en-1440.png) ? [after](./screenshots/after/en-1440.png)
- Arabic 390: [before](./screenshots/before/ar-390.png) ? [after](./screenshots/after/ar-390.png)
- All 30 screenshots are indexed in the [screenshot manifest](./screenshot-manifest.json).

## Responsive QA

Playwright checked Home and Services in English and Arabic at 1440, 1024, 768, 390, and 360 pixels (20 route/locale/viewport captures). All returned HTTP 200; each section had eight loaded 1024px assets, all icons were horizontally centered in 80?80 boxes using `object-fit: contain`, and no document horizontal overflow was detected. Layout columns were 4 at 1440 and 1024, 2 at 768, and 1 at 390 and 360; these are the existing Bootstrap breakpoints.

| Viewport | Columns | Card width | Card height range across locales |
|---:|---:|---:|---:|
| 1440 | 4 | 300px | 284.5?309px |
| 1024 | 4 | 226px | 284.5?356px |
| 768 | 2 | 354px | 262?284.5px |
| 390 | 1 | 360px | 262?284.5px |
| 360 | 1 | 330px | 262?284.5px |

Before/after DOM geometry matched exactly for the Home section in both locales at all five widths, including each card?s position and dimensions. Machine-readable details are in [responsive-qa.json](./responsive-qa.json) and [layout-comparison.json](./layout-comparison.json). Hover box shadow, title color, and transition timing matched the baseline.

## Changed implementation files

- `components/sections/MarketplaceFeaturesSection.tsx`: explicit ordered URLs for the eight new assets.
- `app/globals.css`: scoped image shadow adjustment only.
- `public/assets/img/icons/service-capabilities/`: eight generated optimized icons.
- `docs/phase-3.6/`: asset, responsive, interaction, geometry, and screenshot evidence.

The old icon files remain in place for rollback. No other app sections, content, or asset references were changed.

## Validation

- `npm.cmd run typecheck` ? passed.
- `npm.cmd run lint` ? passed.
- `npm.cmd run build` ? passed.
- Responsive Playwright matrix ? 20/20 pages returned 200; all eight icons loaded on every capture.
- Geometry comparison ? 10/10 Home locale/viewport pairs unchanged.
- Hover comparison ? card shadow and title transition preserved.

## Local preview

[http://127.0.0.1:5195/en](http://127.0.0.1:5195/en)  
The production build is running locally; no deployment occurred.
