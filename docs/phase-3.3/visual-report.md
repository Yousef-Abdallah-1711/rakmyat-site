# Phase 3.3 Portfolio Card Visual QA

Date: 2026-10-19  
Scope: portfolio cards and the homepage selected-project strip only. No deployment.

## Diagnosis

The portfolio used Bootstrap `col-lg-4`, producing three columns on desktop and one column below the large breakpoint. The cards had a fixed 240px image box and the theme's `object-fit: cover`, so wide screenshot views were clipped. At 1440px the cards measured 410×470px; at 1280px 360×470px; at 768px 738×444px; and at 390px 360×470px. The source screenshot was 1440×900. The homepage featured strip placed a 70×62px image inside an approximately 240×160px tile (54×50px image at 390px).

The theme stylesheet is linked after the app's global stylesheet and has equally specific image rules. Scoped overrides therefore use a more specific portfolio selector to preserve the global theme while controlling these cards.

## Changes

- Changed portfolio columns to `col-md-6`: two columns at 768px and above, one below.
- Expanded the portfolio image frame to a responsive 16:10 ratio and set screenshot images to `object-fit: contain`, preserving their full content without distortion.
- Made card headings, categories, and descriptions more readable while retaining Iteck colors, typography, card shell, spacing system, and hover scale.
- Enlarged homepage selected-project thumbnails to 96×78px, with a 68×58px mobile size; the existing horizontal slider/card pattern remains.
- Kept all nine projects, all bilingual project routes, filters, and the four featured homepage links.

## Measured card sizes

Dimensions are CSS pixels. Portfolio card and image frame sizes are the same in English and Arabic. Text can change card height slightly by locale and project. The featured-strip card width is the observed Swiper slide width; its image size is shown separately.

| Viewport | Before portfolio card | After portfolio card | After image frame | Columns after | Home featured tile / image after |
|---:|---:|---:|---:|---:|---:|
| 1440 | 410×470 | 630×604 | 630×394 | 2 | 240×160 / 96×78 |
| 1280 | 360×470 | 555×580 | 555×347 | 2 | 213×160 / 96×78 |
| 768 | 738×444 | 354×451 | 354×221 | 2 | 384×160 / 96×78 |
| 390 | 360×470 | 360×455 | 360×225 | 1 | 195×160 / 68×58 |

Before and after card heights reflect actual page layout; Arabic and English wording can produce small height differences. The metrics JSON records each route, viewport, card, text size, image fit, and scroll width.

## Captures and evidence

- Before screenshots: [`before/`](./before/), 16 captures.
- After screenshots: [`after/`](./after/), 16 captures.
- Baseline metrics: [`before-metrics.json`](./before-metrics.json).
- Final metrics and browser interaction results: [`after-metrics.json`](./after-metrics.json).
- Capture script: [`../../scripts/phase-3.3-portfolio-qa.py`](../../scripts/phase-3.3-portfolio-qa.py).

Representative comparisons:

- [Portfolio EN, 1440 before](./before/en-portfolio-1440.png) · [after](./after/en-portfolio-1440.png)
- [Portfolio AR, 1440 before](./before/ar-portfolio-1440.png) · [after](./after/ar-portfolio-1440.png)
- [Portfolio EN, 768 after](./after/en-portfolio-768.png) · [390 after](./after/en-portfolio-390.png)
- [Portfolio AR, 768 after](./after/ar-portfolio-768.png) · [390 after](./after/ar-portfolio-390.png)
- [Homepage EN, 1440 before](./before/en-home-1440.png) · [after](./after/en-home-1440.png)
- [Homepage AR, 390 before](./before/ar-home-390.png) · [after](./after/ar-home-390.png)

## Validation

- 16 final captures: four routes (English/Arabic Portfolio and Home) × four viewport widths; all returned HTTP 200.
- Zero broken images, browser page errors, or document-width overflow in the captured states.
- Filter counts: All 9, Education 4, E-commerce 2, Business systems 2, Automation & integrations 1.
- All nine portfolio links are unique; English and Arabic navigation to the Schooly detail page succeeded.
- Card hover changed the image transform from `none` to `scale(1.035)`.
- Layout check confirmed two columns at 768px and one at 390px in both locales; Arabic document direction is RTL.
- Homepage selected-project strip retains four unique featured project routes.

TypeScript, ESLint, and the production build were run after implementation; results are recorded with the completion summary.

## Files in scope

- `components/sections/PortfolioProjects.tsx`
- `app/globals.css`
- `scripts/phase-3.3-portfolio-qa.py`
- `docs/phase-3.3/` captures and evidence
