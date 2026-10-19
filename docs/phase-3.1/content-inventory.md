# Phase 3.1 content and asset inventory

Date: 2026-10-19  
Target: `next-app/` on `phase-3/rakmyat-content-only`  
Source: `C:\Users\yosea\Desktop\BDA\rakmyat-landing` (read only) and the separately supplied pilot brand reference (read only)

## Classification

| Item | Classification | Evidence and handling |
|---|---|---|
| Company name: Rakmyat / رقميات | Verified owner-provided fact | Present throughout BDA project and product documentation. |
| Company category: software house | Verified owner-provided fact | `PRODUCT.md`. |
| Service catalogue | Owner-provided candidate content | BDA `src/App.tsx` and product materials identify websites/e-commerce, mobile apps, custom systems, AI/automation, and integrations. Localized records are in `next-app/content/services.ts`. They describe service areas, not delivery history or guaranteed scope. Public marketing approval and project-specific deliverables remain owner decisions. |
| Positioning and engineering approach | Owner-provided candidate content | `PRODUCT.md` describes business workflow fit, connected systems, clear boundaries, and practical user needs. Used as editorial direction; no history, metrics, or customer outcomes were added. |
| Rakmyat logo mark | Owner-provided brand asset; usage rights not independently evidenced | BDA `BRAND_ASSETS.md` identifies `brand-source/rakmyat-logo-original.png` as user-supplied and authoritative, and describes `public/assets/rakmyat-mark.webp` as a derived mark export. The derived mark was copied byte-for-byte to `next-app/public/assets/rakmyat/brand/rakmyat-mark.webp` and placed in existing header/footer wordmarks. BDA source and pilot project were not modified. |
| Brand palette | Missing approval | No token specification or written palette approval found. Existing Iteck light palette retained. |
| Fonts | Candidate / approval and license evidence missing | Pilot contains Tajawal WOFF2 files; no license record or typography approval was found. Existing local Iteck font setup retained. |
| Contact: `info@rakmyat.online` | Owner-provided candidate | Appears in BDA app source and pilot content. Not published until destination is confirmed. |
| Contact phone: `01023516495` | Candidate / not independently verified | Appears in BDA app source only; not published. |
| Domain: `rakmyat.online` | Candidate | Appears in BDA source; domain ownership and production URL not verified. No canonical domain configured. |
| Social profiles | Missing | No verified profile URLs were found; none added. |
| Fixed prices, testimonials, client logos, statistics | Missing / not publishable | No permission-cleared source evidence. Iteck sections remain as labeled service-scope information and an illustrative workflow, without fabricated values or endorsements. |
| Nine nominated portfolio entries | Candidate | All remain unpublished; attribution and screenshot/content rights are pending. See [`portfolio-candidate-review.json`](./portfolio-candidate-review.json). |
| Arabic copy | Editorial draft | Natural bilingual copy added from the supplied product/service material. Professional Arabic proofreading is still required before production. |

## Application content source of truth

- `next-app/content/services.ts`: typed EN/AR service descriptions, customer problem, typical solution, capabilities, CTA, and SEO fields.
- `next-app/content/home.ts`: localized home hero and closing CTA.
- `next-app/content/page-copy.ts`: localized About, Services, service details, Portfolio, and Contact copy.
- `next-app/content/pricing.ts`: typed, non-priced service-area comparison; explicitly not a package or quote.
- `next-app/content/i18n.ts`: route metadata and shared navigation labels.
- `next-app/content/content-status.ts`: facts, source-derived copy, and pending approvals.

## Publication and asset decision

Only the logo mark was integrated into the public asset tree. Portfolio screenshots were inventoried but not copied into `public/`: the candidate register explicitly requires confirmation of Rakmyat attribution and permission to republish media. Candidate project details remain in review documentation, and the live Work page presents service capabilities, not candidate projects as delivered work. The contact address, phone, and domain remain unpublished pending confirmation.

## Evidence reviewed

- BDA `PRODUCT.md`, `PORTFOLIO_DISCOVERY.md`, `BRAND_ASSETS.md`, `docs/FINAL-PRODUCTION-READINESS-REPORT.md`, `src/App.tsx`, and `public/assets/` and `public/portfolio/` inventories.
- Pilot `reference/BRAND_ASSETS.md`, `reference/CONTENT.md`, `reference/PRODUCT.md`, and `shared-assets/` inventory. Pilot design directions and generated imagery were not imported.
- Target baseline at `75732a7179829e97ac4ab35ac3931c1a19405c88`, branch `phase-3/rakmyat-content-only`; working tree clean at inspection.
