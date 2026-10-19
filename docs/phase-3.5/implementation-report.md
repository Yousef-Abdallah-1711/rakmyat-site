# Phase 3.5 — Portfolio Image Presentation Refinement

Status: implemented and validated locally; not deployed. Branch: `phase-3/rakmyat-content-only`.

## Finding

The seven genuine desktop captures were already available at 1440×900 and each has a real 390×844 mobile capture. Their content appeared small because a faux browser toolbar consumed image space and an overlapping phone obscured part of the desktop screenshot. Project-specific gradient stages and strong shadows repeated the same mockup treatment across every card. The two remaining covers are conceptual illustrations, not interface screenshots.

The supplied Phase 3.5 attachment contained the brief but no separate reference image files. Before screenshots therefore use the retained Phase 3.4 production captures at the same routes and viewports.

## Changes

- Removed faux browser chrome and floating phone overlays from desktop project covers.
- Kept genuine screenshots on their existing asset paths; the images are contained so the source UI is not cropped or stretched.
- Removed project-specific decorative gradients and heavy image shadows; retained only a thin neutral edge.
- Simplified gallery frames. Portrait mobile screenshots use their source aspect ratio with a subtle border instead of a thick dark phone bezel.
- Kept the concept disclosures visible on Concord CRM and Product Scraper to WooCommerce.
- Preserved all nine projects, project links, labels, card copy, responsive grid/layout, localization, and the lightbox interaction.

No project content, route, filter, grid, card-width, typography, non-image style, asset, dependency, or unrelated page was changed. The homepage and Work page use the same project visuals component, so both benefit from the scoped presentation update.

Project-by-project source and image decisions: [treatment matrix](./treatment-matrix.md).

## Visual evidence

Full-page before captures are retained from Phase 3.4; fresh production after captures were made after images decoded. Comparison pairs:

| View | Before | After |
|---|---|---|
| Home, 1440px | [before](./screenshots/before/home-en-1440.png) | [after](./screenshots/after/home-en-1440.png) |
| Home, 390px | [before](./screenshots/before/home-en-390.png) | [after](./screenshots/after/home-en-390.png) |
| Work, 1440px | [before](./screenshots/before/work-en-1440.png) | [after](./screenshots/after/work-en-1440.png) |
| Work, 390px | [before](./screenshots/before/work-en-390.png) | [after](./screenshots/after/work-en-390.png) |
| Schooly detail, 1440px | [before](./screenshots/before/schooly-detail-en-1440.png) | [after](./screenshots/after/schooly-detail-en-1440.png) |
| Concord CRM concept detail, 1440px | [before](./screenshots/before/concord-concept-en-1440.png) | [after](./screenshots/after/concord-concept-en-1440.png) |

## Rendered dimensions

Measured on the Work grid in the production build. The first card is representative; the remaining cards use the same grid and image ratios. Home uses the same two-column desktop and one-column mobile rules.

| Viewport | Columns | Card width × height | Image frame width × height |
|---:|---:|---:|---:|
| 1440px | 2 | 628 × 598.4px | 626 × 396.2px |
| 1280px | 2 | 553 × 550.9px | 551 × 348.7px |
| 1024px | 2 | 480 × 522.7px | 478 × 302.5px |
| 768px | 2 | 352 × 464.8px | 350 × 221.5px |
| 390px | 1 | 360 × 471.8px | 358 × 259.4px |
| 360px | 1 | 330 × 471.5px | 328 × 237.7px |

Card and image frame dimensions are controlled by the same existing layout and aspect-ratio rules as before; only image presentation styles changed. The browser optimizer serves appropriately sized versions; source assets are intact.

## Verification

- `npm.cmd run typecheck`: passed.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- Playwright responsive run: Home and Work in English and Arabic at 1440, 1280, 1024, 768, 390, and 360px (24 cases); Schooly and Concord CRM detail heroes in both locales at 1440 and 390px (8 cases).
- Across those 32 cases: zero document-width overflow and zero broken images. Screenshot `object-fit` is `contain`; concept disclosures were visible in both locales and both tested sizes.
- Work interaction checks: all nine projects render; a category filter reduced the set to four and the All filter restored nine; project detail link resolves; image lightbox opens and Escape closes it.
- The measured cover files include seven real desktop/mobile pairs and two concept-only illustrations. The concept projects still need genuine screenshots before they can be presented as delivered interfaces.

Machine-readable dimensions and interaction evidence: [responsive-qa.json](./responsive-qa.json). The Phase 3.2 source inventory and SHA-256 verification remain in [asset-review.json](../phase-3.2/asset-review.json).

## Preview and Git

Local production preview: <http://127.0.0.1:5193/en/portfolio>.

A reversible checkpoint tag `pre-rakmyat-phase3-5` marks the pre-change commit. The implementation commit hash will be recorded after commit.
