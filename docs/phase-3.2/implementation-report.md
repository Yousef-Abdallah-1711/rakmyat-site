# Phase 3.2 Implementation Report

Date: 2026-10-19  
Target: `next-app/`, branch `phase-3/rakmyat-content-only`  
Status: implemented locally and validated; not deployed.

## Outcome

Integrated all nine owner-confirmed projects into the existing Iteck design. The portfolio grid retains its original layout and filtering pattern; detail pages reuse one typed bilingual project record and one shared single-project composition. English and Arabic routes are available at `/en/projects/[slug]` and `/ar/projects/[slug]`. Concord CRM and Product Scraper use labeled identity treatments without fabricated interface screenshots.

The existing homepage work/client strip now links to four featured projects (Schooly, Nora Store, Nama Academy, GC Hardware). Service cards link to relevant projects. The contact form remains a client-side demo without delivery. Old Notero routes remain unpublished.

## Projects and media

Seven projects use selected images from the read-only BDA source library; two have no screenshots. The curated set contains 32 images (3,948,052 bytes), copied byte-for-byte and verified by SHA-256 and image decode. There are no duplicate image hashes or unreferenced copied assets. The list of selected files and dimensions is in [asset review](./asset-review.json); the project-by-project source, confidentiality, media-rights, and public-URL status is in the [publication register](./project-publication-register.json).

Ownership is confirmed by the owner. That confirmation does not establish rights to publish client names, marks, product photos, course media, or other third-party content visible in screenshots. Those clearances remain open; the selected images are present in this local review build and need item-by-item approval before public production. Project websites shown in the register were observed in source review and were not live-verified during this phase. Two projects have only name-level information, so no detailed technical claims were added.

## Content, localization, and metadata

Portfolio copy and project detail content are typed English/Arabic records. Stable English slugs are shared between locales; the switcher preserves the current project slug. Document `lang`/`dir`, localized route titles/descriptions, Open Graph title/description, and English/Arabic hreflang alternates were checked for all 18 project routes. Canonical and absolute Open Graph image URLs are emitted only when `NEXT_PUBLIC_SITE_URL` is configured. No production domain is configured, so canonical URLs and absolute social image metadata are intentionally absent. The sitemap includes localized project entries only with a configured production URL.

Arabic copy is an editorial draft and still needs professional proofreading. Candidate contact details, prices, testimonials, metrics, customer logos, and production domain remain unpublished or unconfigured.

## QA and evidence

- `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build`: passed.
- Viewport matrix: 120/120 captures across 15 routes × 2 locales × 4 widths (1440, 1280, 768, 390).
- Route results: 120 status 200; zero document-width overflow, broken images, visible static heading clipping, console errors, page errors, or unexpected local request failures.
- Eight captures report a wider body box than viewport because fixed Iteck decorative elements and off-canvas carousel slides extend beyond it; the document scroll width remains the viewport and no horizontal page scrolling was observed.
- Interaction suite: 18 checks passed, covering the four category filters, nine portfolio cards, project and related-project navigation, language switch and RTL state, gallery lightbox and Escape, mobile menu and focus restoration, service carousel and links, back-to-top, form constraint validation, unknown/retired routes, six legacy aliases, and metadata for all 18 project routes.
- Manual screenshot review: `en-1440-portfolio.jpg`, `en-1440-schooly.jpg`, `ar-390-home.jpg`, `ar-390-schooly.jpg`, and `ar-390-product-scraper.jpg`.
- Structural reference review: compared the current English home hero/header with the preserved Phase 2 `home-saas-technology-1440.png`; the Iteck light header, hero placement, underline motif, email CTA, and original illustration composition remain. New content changes the copy and logo, as intended.
- Machine-readable results and all screenshots: [visual QA](./visual-qa.json), [capture manifest](./captures.json), [interaction QA](./interaction-qa.json), and [`screenshots/`](./screenshots/).

Visual checks used local route health and layout signals, not pixel MAE against changed page content. Historical Phase 2/3.1 screenshots remain untouched. Manual contrast, screen-reader, cross-browser, production contact-delivery, live project URL, and asset-rights review are still outstanding.

## Preview

- English home: <http://127.0.0.1:5191/en>
- Arabic home: <http://127.0.0.1:5191/ar>
- English Work: <http://127.0.0.1:5191/en/portfolio>
- Arabic Work: <http://127.0.0.1:5191/ar/portfolio>
- Example detail: <http://127.0.0.1:5191/en/projects/schooly>
- Example Arabic detail: <http://127.0.0.1:5191/ar/projects/schooly>

No deployment was performed. See [known production decisions](../KNOWN-ISSUES.md) and `../../content/content-status.ts` before release.

## Git

Baseline before Phase 3.2: `5fe0730a1675457b90f64ef61bc994f675e33e37` on `phase-3/rakmyat-content-only`. The reversible `pre-rakmyat-phase3-2` checkpoint tag points to that baseline. Focused implementation commits:

1. `1ab449f` — bilingual portfolio model and ownership status.
2. `b4d2c0c` — curated portfolio image assets.
3. `9ea85b6` — project detail routes, localization, metadata, and Notero retirement.
4. `e8d1a6e` — portfolio/homepage/service integration and bilingual copy.

QA evidence and documentation are committed separately after implementation.
