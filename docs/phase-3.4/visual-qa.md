# Phase 3.4 Visual and Interaction QA

## Coverage

- Routes: Home, Work, and all nine project detail routes in English and Arabic (22 route paths).
- Viewports: 1440, 1280, 1024, 768, 390, and 360 CSS px (132 route/viewport checks).
- Screenshots: 34 full-page captures. Home/Work in both locales at 1440, 1024, 768, and 390px; Schooly, Concord CRM, and Product Scraper details in both locales at 1440, 768, and 390px.
- Before set: Phase 3.3 final Home and Work captures in both locales at 1440 and 390px.

## Results

- All 132 requests returned HTTP 200; no document horizontal overflow was found.
- No browser page errors, broken images in the screenshot set, or visible heading clipping were found. An automated heading check initially flagged the hidden 1px screen-reader heading on Work; visual and rendered-bound checks confirmed it is not visible clipping.
- The initial request-failure count came from Next.js route-prefetch requests that were cancelled when each QA page closed. These `?_rsc=` `ERR_ABORTED` prefetches are expected. No unexpected failed asset requests remained.
- Portfolio filters passed in EN and AR and returned four Education projects. Each locale displayed nine unique cards.
- Project language-switch link preserves the current `schooly` slug.
- All nine EN and nine AR detail paths loaded.
- Image links open the in-app accessible lightbox; Escape closes it and restores the original route/focus. Concept cards and detail pages show the concept-only label.
- Before/after screenshots were reviewed at desktop and mobile; screenshots use full-size original project captures inside the new frames.

Detailed route and viewport data: [responsive-qa.json](./responsive-qa.json). The capture filenames are listed there and stored in `screenshots/before/` and `screenshots/after/`.

## Automated commands

All passed on the final source:

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`

## Visual references

Baseline samples: [Home EN 1440](./screenshots/before/en-home-1440.png), [Home AR 1440](./screenshots/before/ar-home-1440.png), [Work EN 1440](./screenshots/before/en-portfolio-1440.png), and [Work AR 1440](./screenshots/before/ar-portfolio-1440.png). Current examples: [Home EN 1440](./screenshots/after/en-home-1440.png), [Home AR 390](./screenshots/after/ar-home-390.png), [Work EN 1440](./screenshots/after/en-portfolio-1440.png), [Work AR 390](./screenshots/after/ar-portfolio-390.png), [Schooly 1440](./screenshots/after/en-schooly-1440.png), [Concord CRM AR 390](./screenshots/after/ar-concord-crm-390.png), and [Product Scraper 1440](./screenshots/after/en-product-scraper-1440.png).
