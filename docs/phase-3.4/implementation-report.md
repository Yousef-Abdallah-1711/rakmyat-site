# Phase 3.4 Implementation Report

Date: 2026-10-19  
Branch: `phase-3/rakmyat-content-only`  
Baseline: `138a9d7f5537bb68b16af2478b82ec2ed80b8927`  
Status: implemented and validated locally; not deployed.

Implementation/assets commit: `16026751e77bcd145325593e298b2f51ffb3f3e7`. Documentation and screenshot evidence are committed separately.

## Result

The homepage’s four-item mini carousel was replaced in its existing position by a two-column showcase that reads all nine bilingual project records from `content/portfolio.ts`. The Work page keeps its category filters and two-column grid, now using the same cards and presentation frames. Project detail routes use those frames for their hero, gallery, and related-project cards.

The screen presentation adds a restrained browser bar and neutral colored surround around the original screenshot pixels. Where a supplied mobile capture exists, a smaller phone frame overlaps the desktop screen. Images use `object-fit: contain`; full originals open in the existing accessible lightbox. Concord CRM and Product Scraper use generated, clearly labeled conceptual artwork and do not show fabricated product interfaces.

## Root cause and scope

The homepage used a narrow scrolling strip with repeated selected projects and tiny thumbnails. The Work page’s Phase 3.3 grid was already two columns; it needed a consistent image-first presentation rather than another layout redesign. The new CSS is scoped to `.project-showcase-*` and `.project-visual*`. The About page keeps its original client-logo section. Home hero, service, pricing, About, shared navigation, footer, route structure, existing screenshot library, and BDA source project were not changed.

## Components and content

- `ProjectVisualFrame`: real screenshot or conceptual cover, browser chrome, optional supplied mobile screenshot, responsive Next Image, and accessible full-size viewing.
- `ProjectScreenshotFrame`: framed gallery image or phone capture.
- `ProjectShowcaseCard` and `ProjectShowcaseGrid`: shared cards for Home, Work, and related projects.
- `ProjectShowcaseSection`: localized section heading and CTA using all nine typed project records.
- `MediaLightbox`: now groups and opens any `data-fancybox` image link, including project-specific groups; Escape closes and restores focus.
- `content/portfolio.ts`: specific EN/AR card summaries for all nine projects, explicit cover-kind metadata, and evidence-limited wording for the two name-level projects.

## Actual card geometry

Measurements are CSS pixels from the rendered page at 1× device scale. Home and Work use the same two-column grid on desktop/tablet and one column below 576px.

| Viewport | Grid | Card width | Card height (representative) | Main image frame |
|---:|---|---:|---:|---:|
| 1440 | 2 columns | 628–629 | 598–599 | 536–537 × 299–300 |
| 1280 | 2 columns | 553–554 | 551–552 | 472–473 × 259–260 |
| 1024 | 2 columns | 480–481 | 499–523 | 409–410 × 221 |
| 768 | 2 columns | 352–353 | 441–465 | 299–300 × 153–154 |
| 390 | 1 column | 360 | 438–488 | 313 × 191 |
| 360 | 1 column | 330 | 438–488 | 287 × 173 |

Height varies with localized text wrapping. Both conceptual cards display their concept label within the artwork frame. Detail-page related cards use a compact three-column layout on wide screens and collapse responsively.

## Evidence and limitations

The baseline screenshots are copied from the final Phase 3.3 capture set. The Phase 3.4 captures include full-page EN/AR Home and Work at 1440, 1024, 768, and 390px, and Schooly, Concord CRM, and Product Scraper detail pages in both locales at 1440, 768, and 390px. The additional 1280px and 360px checks are recorded in the machine-readable results.

The project ownership/attribution confirmation remains separate from third-party media and trademark rights. Existing captures show client marks, interface copy, product imagery, and people; clear their use before public production. Arabic copy is an editorial draft and still needs professional proofreading. See [content evidence](./content-evidence.md) and the [Phase 3.2 publication register](../phase-3.2/project-publication-register.json).

Preview: <http://127.0.0.1:5192>
