# Phase 3.7 About implementation report

Date: 2026-10-19  
Branch: `phase-3/rakmyat-content-only`  
Baseline: `323d4d1f1b4cbd91caf0236a6d1036f45445e22c`  
Safety checkpoint: `pre-phase-3.7-about-refresh-20261019`  
Status: implemented and validated locally; not deployed.

## Changes

- Replaced the 570px empty About hero panel with a 370px conceptual flow visual. It uses existing Phase 3.6 capability illustrations for websites, business systems, and integrations. Labels and a caption make clear that it describes connected service areas; it is not a product screenshot.
- Updated the About hero and both existing illustrated sections with localized, practical copy. The existing Iteck illustrations, order, and shared layout remain.
- Replaced the repeated Company Focus marquee and the unapproved client-logo-style repetition with five single-instance capability areas.
- Replaced the generic process carousel with a semantic five-step list and project-dependent, qualified descriptions.
- Removed the About-only TeamGrid usage and its placeholder People and Practice section. `TeamGrid.tsx` itself remains untouched.
- Replaced the disconnected About demo form with a localized link to the existing Contact route. Contact content and form were not changed.
- Added About-only CSS Modules and a separate bilingual About content record. No global CSS selectors or shared page content were edited.

## Validation

- `npm.cmd run typecheck`: passed.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed (Next.js 16.4.2).
- About: eight locale/viewport combinations returned 200; no broken images, page errors, clipped headings, horizontal overflow, unlocalized mojibake, duplicate focus labels, About forms, or People and Practice heading.
- CTA navigation: all four English/Arabic Services and Contact link checks reached their expected localized routes.
- Services, Work, and Contact: 12 route/viewport checks (both locales at 1440 and 390) returned 200 with correct document language/direction, no horizontal overflow, and no page errors.
- Homepage: eight matched before/after screenshot comparisons; seven had zero mean RGB delta and Arabic at 768px had 0.001. Heights matched at every width. This is an effectively identical visual result; details are in [homepage regression](./homepage-regression.md).

## Preview

- English About: <http://127.0.0.1:5197/en/about>
- Arabic About: <http://127.0.0.1:5197/ar/about>

## Review

Arabic copy remains subject to the existing professional proofreading requirement. See [remaining review items](./remaining-review-items.md). This work does not certify WCAG conformance and was not deployed.
