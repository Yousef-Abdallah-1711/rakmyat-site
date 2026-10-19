# Phase 3.10 — Services workflow cards

Status: implemented and validated locally; not deployed. Scope: the “Software for customer and team workflows” section on `/en/services` and `/ar/services`.

## Change

Replaced the repeated service carousel with five localized service cards in a responsive grid. The cards use the existing service content records and link only to relevant published projects. Five matching, standalone WebP illustrations replace the old repeated carousel imagery. The illustrations are generated conceptual artwork, not screenshots of delivered products. Existing service page sections outside this component, route structure, content records, project routes, and shared site styles remain unchanged.

Responsive grid: five columns from 1200px, three columns from 901–1199px, two columns from 621–900px, and one column at 620px and below.

## Rendered card dimensions

Dimensions are card width × height in CSS pixels; localized copy changes card height.

| Viewport | Columns | English card | Arabic card |
|---:|---:|---:|---:|
| 1440 | 5 | 262 × 574 | 262 × 527 |
| 1280 | 5 | 230 × 611 | 230 × 525 |
| 1024 | 3 | 312 × 490 | 312 × 468 |
| 768 | 2 | 352 × 478 | 352 × 456 |
| 390 | 1 | 358 × 476 | 358 × 454 |
| 360 | 1 | 328 × 476 | 328 × 454 |

## Validation

- `npm.cmd run typecheck` — passed.
- `npm.cmd run lint` — passed.
- `npm.cmd test` — passed, 4 tests.
- `npm.cmd run build` — passed.
- Browser QA — 32/32 captures returned HTTP 200 (12 Services locale/width captures and 20 regression captures across Home, About, Contact, Work, and the Schooly detail route).
- Service grid checks — all 12 locale/width combinations have five unique cards, five loaded illustrations, no horizontal overflow, clipped heading, text overflow, or broken image; Arabic reports RTL; responsive column counts match the breakpoints; project links are keyboard accessible and valid.
- Console errors — none.
- Regression image hashes — 19/20 non-Services captures were identical. The remaining Arabic Contact 1440 capture differed by 32 pixels out of 2,907,360; mean absolute RGB difference was 0.0000049, consistent with negligible capture variation. No Contact source was changed.
- `git diff --check` — passed.

## Screenshots and evidence

Before and after full-page screenshots plus measured dimensions and file hashes are indexed in [`before-captures.json`](./before-captures.json) and [`after-captures.json`](./after-captures.json). The screenshot trees retain both Services captures at all six widths and bilingual regression captures for Home, About, Contact, Work, and Schooly.

Capture automation: [`capture-qa.py`](./capture-qa.py).

## Preview

- English Services: <http://127.0.0.1:5202/en/services>
- Arabic Services: <http://127.0.0.1:5202/ar/services>
