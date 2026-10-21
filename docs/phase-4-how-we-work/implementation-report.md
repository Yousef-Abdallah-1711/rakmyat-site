# Phase 4 — How We Work Implementation Report

Date: 2026-10-19  
Target: `next-app/`, branch `phase-3/rakmyat-content-only`  
Status: implemented and validated locally; not deployed.

## Delivered

- Added bilingual `/en/how-we-work` and `/ar/how-we-work` routes, page metadata, language alternates, sitemap entries, and active desktop/mobile navigation.
- Added a nine-stage process section on both Home pages after Connected software capabilities and before Our Work. Each stage links to its full explanation on the process page.
- Added the detailed process page with stage descriptions, activities, outputs, client participation, approval points, document examples, staging and release flow, support expectations, FAQ disclosures, and localized Contact calls to action.
- Wrote English and Arabic copy from the owner-provided process brief. No fixed prices, unsupported timelines, guarantees, or new customer claims were added.
- Added scoped responsive styles, semantic headings and lists, keyboard-accessible links, native FAQ disclosures, RTL direction, and reduced-motion handling.

## Artwork

No raster image or source asset was added or changed. The available image-generation tool was not available for this run, so the section uses purpose-drawn inline SVG vector illustrations for the nine stages and overview. They follow the existing light blue/lavender visual language and avoid presenting fabricated product screenshots. This is a deliberate vector fallback; the figures are not generated 3D artwork.

## Files

New implementation files: `content/process.ts`, `components/sections/HowWeWork.tsx`, `components/sections/HowWeWork.module.css`, `components/sections/ProcessArtwork.tsx`, and `components/sections/ProcessArtwork.module.css`.

Updated routing and navigation files: `app/[locale]/[[...path]]/page.tsx`, `app/sitemap.ts`, `components/layout/SiteHeader.tsx`, `components/layout/SiteLayout.tsx`, `components/sections/HomeSourceSections.tsx`, and `content/i18n.ts`.

No changes were made to the BDA source project, contact API/form behavior, About or Services implementation, project records, or public image assets. Existing shared working-tree edits were preserved.

## Validation

- `npm.cmd run typecheck` — passed.
- `npm.cmd run lint` — passed.
- `npm.cmd test` — passed, 11 tests.
- `npm.cmd run build` — passed using an isolated physical copy of the current application source, so the running preview servers' `.next` directories were not disturbed.
- Browser captures: 28 final images, including English and Arabic Home and How We Work at 1440, 1280, 1024, 768, 390, and 360 pixels. All captured routes returned successfully, images loaded, and document scroll width matched viewport width.
- Interaction checks: 18/18 passed, including nav and mobile-menu behavior, locale switching, keyboard CTA activation, FAQ disclosure, RTL direction, reduced motion, and portfolio filter/card regression checks.
- Regression routes: English and Arabic About, Services, Work, Contact, and Schooly project pages, plus admin login and inquiries. All returned HTTP 200 with no horizontal page overflow or page errors.
- Pixel comparison: eight baseline/final Home comparisons crop at the start of the new section, excluding the inserted section. Mean absolute channel difference ranged from 0.2492 to 0.6584 on an 8-bit channel scale. See [visual-regression.json](./visual-regression.json); small remaining differences can include animation or capture timing variation.
- Screenshot manifests resolve to existing files. There are 8 baseline captures and 28 final captures; final capture image bytes total 50,172,535.

Measured Home process section top positions, in document pixels:

| Viewport | English | Arabic |
|---:|---:|---:|
| 1440 | 4618 | 4508 |
| 1280 | 4681 | 4460 |
| 1024 | 4745 | 4743 |
| 768 | 6621 | 6440 |
| 390 | 7207 | 6791 |
| 360 | 7203 | 6728 |

All six widths were checked. Baseline screenshots were requested at 1440, 1280, 768, and 390; after captures cover all six widths. Per-capture DOM and viewport metrics are in `captures.json`.

## Evidence and preview

See the [Phase 4 evidence index](./README.md). Preview: [English Home](http://127.0.0.1:5210/en), [Arabic Home](http://127.0.0.1:5210/ar), [English How We Work](http://127.0.0.1:5210/en/how-we-work), [Arabic How We Work](http://127.0.0.1:5210/ar/how-we-work).

## Git and release

- Branch: `phase-3/rakmyat-content-only`.
- HEAD at completion: `512c18c305620891dd2ebc4bf99f288a9c2f51d9`.
- Reversible checkpoint: `pre-phase4-how-we-work-512c18c` points to that same baseline.
- No commit was created. The worktree already contained user changes in shared app files before this task; those edits were preserved and overlap with the Home/navigation files needed here. No deployment occurred.
