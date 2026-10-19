# Phase 3.1 Implementation Report

Date: 2026-10-19
Target branch at start: `phase-3/rakmyat-content-only`
Baseline: `75732a7179829e97ac4ab35ac3931c1a19405c88`
Implementation commit: `5c599e509adb88ff69215f8f6a78b73cb70411d6`. No deployment performed.

## Implemented

- Preserved the existing Next.js App Router and Iteck section composition, theme styles, illustrations, grid/card structures, responsive CSS, animations, and existing interaction components.
- Replaced generic discussion placeholders with bilingual software-house copy derived from the owner-provided BDA product and service material. Copy covers websites/e-commerce, mobile applications, custom business systems, AI/automation, and integrations/APIs. Service records are typed and centralized in `next-app/content/services.ts`, including customer problem, typical solution, capabilities, CTA, and SEO fields.
- Updated the home hero and close, About, Services, service details, shared capability strips, metadata, and footer-adjacent copy. Arabic uses editorial Modern Standard Arabic draft copy and RTL. Professional proofreading is still required.
- Kept the original Iteck pricing section geometry while making it an explicit non-priced service-area comparison. It is not a package, quote, or published rate. Replaced the testimonial-shaped content with a clearly labeled illustrative workflow; no customer quote is fabricated.
- Integrated the BDA documented user-supplied Rakmyat mark export in the existing header/footer wordmark positions. Copied one file, `rakmyat-mark.webp` (13,486 bytes), byte-for-byte; SHA-256 starts `9F9ECFFF197B80F7AD358AD23152`. Kept Iteck's original light palette and existing local font stack because no approved palette/type sheet or font rights record was found.
- Created [`content-inventory.md`](./content-inventory.md) and [`portfolio-candidate-review.json`](./portfolio-candidate-review.json). All nine nominated projects are individually recorded with source route, available source captures, attribution state, publication permission, observed description, missing proof, and recommendation.
- Kept all nine portfolio projects unpublished. The two source-only candidates (Concord CRM and Product Scraper) have no screenshots in the BDA public portfolio library; the other seven have 4–9 source captures each. No portfolio capture was copied into `next-app/public/`. The Work page instead uses five capability cards and retains its category filtering.
- Left candidate email, phone, and domain unpublished. BDA material lists `info@rakmyat.online`, phone `01023516495`, and `rakmyat.online`; current confirmation and destination details were not independently established. No social profiles were found.
- Updated `next-app/content/content-status.ts` and `next-app/docs/KNOWN-ISSUES.md` with the source classifications and remaining owner approvals.

## Source review and protection

Read-only inspection covered BDA `PRODUCT.md`, `PORTFOLIO_DISCOVERY.md`, `BRAND_ASSETS.md`, `docs/FINAL-PRODUCTION-READINESS-REPORT.md`, `src/App.tsx`, `public/assets/`, and `public/portfolio/`, plus pilot `reference/BRAND_ASSETS.md`, `reference/CONTENT.md`, `reference/PRODUCT.md`, and `shared-assets/`. No BDA or pilot files were edited. The BDA folder does not expose a Git repository for a status check.

## Validation performed

| Check | Result |
|---|---|
| `npm.cmd run typecheck` | Passed. |
| `npm.cmd run lint` | Passed after removing one unused map parameter. |
| `npm.cmd run build` | Passed; Next.js production build completed. |
| Edge bilingual route smoke check | Six pages in English and six in Arabic returned page content and expected titles. HTML `lang`/`dir` values were `en/ltr` and `ar/rtl`. |
| Initial image and overflow check | Zero broken images and no document horizontal overflow on those 12 routes at Edge's 1424×954 CSS viewport. |
| Portfolio filter | Selecting “AI & integrations” showed the two matching capability cards. |
| Project publication gate | `/en/projects/notero` returned the not-found page with `noindex`; no candidate project detail is published. |
| Contact behavior | Required email field is invalid while empty. Form has no action and remains demo-only; no message was sent. |
| External references | Contact route DOM contained no absolute HTTP asset/script references. App source still contains dormant optional YouTube lightbox logic and an unused legacy Notero record; no current candidate case route exposes it. |
| SEO/domain | Localized `en`/`ar` alternate links were present. Canonical URL was absent and sitemap empty while `NEXT_PUBLIC_SITE_URL` is unset, as intended. |
| Visual review | Edge screenshots were reviewed for the Home and About hero states and the Services route. The original Iteck section framework and illustrations remain visible. The first capture after navigation showed the existing preloader; it cleared after the theme's load transition. No matched pixel-diff was produced. |

## Not completed / release gate

The Edge browser session does not expose a direct viewport override, and the Next app has no Playwright dependency. Therefore the specific 1440, 1280, 768, and 390 width comparison in both locales was not run. No cross-viewport screenshot certification or pixel-perfect parity claim is made. A matched run needs a viewport-capable browser setup and should include all active route pairs, with special attention to long Arabic headings and the scope table. Also pending: professional Arabic proofreading, owner approval of the source-derived service wording, logo/media usage-right documentation, project attribution and image permissions, confirmed contact/domain, approved price model, and manual accessibility review.

## Preview

Production build preview started locally at `http://127.0.0.1:5191`. This is not deployed.

## Commit

Implementation commit: `5c599e509adb88ff69215f8f6a78b73cb70411d6`. The report-only follow-up records the hash without rewriting the implementation commit.
