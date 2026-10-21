# Home and About Hero Swap — Implementation Report

Date: 2026-10-19  
Branch: `phase-3/rakmyat-content-only`  
HEAD: `512c18c305620891dd2ebc4bf99f288a9c2f51d9`  
Status: implemented and verified locally; not deployed.

## Change summary

Swapped the existing hero compositions between Home and About in English and Arabic. The original visual markup and image assets were reused: Home now has the About capability illustration, three connected cards, and surrounding decorations; About now has the Home dashboard illustration and two 3D hands. No artwork was replaced or regenerated.

Only the hero composition and its page-specific copy/CTA changed in the application. No header, footer, below-hero section, global stylesheet, contact form, unrelated route, or public asset was modified for this task. A small scoped module stylesheet preserves the original About hero decoration positions on Home.

## Copy

### Home — English

- **Heading:** Software built around your business needs.
- **Description:** We build websites, applications, and business systems that simplify your operations, connect your tools, and help your business grow.
- **Cards:** Websites & Applications · Business Systems · AI & Integrations
- **Supporting line:** From customer experiences to everyday operations — software that works together.
- **CTA:** Discuss Your Project → `/en/contact`

### Home — Arabic

- **Heading:** برمجيات مصممة لاحتياجات عملك
- **Description:** بنطوّر مواقع وتطبيقات وأنظمة أعمال تساعدك تنظّم شغلك، وتربط أدواتك ببعض، وتسهّل تجربة عملائك.
- **Cards:** مواقع وتطبيقات · أنظمة أعمال · ذكاء اصطناعي وتكاملات
- **Supporting line:** من تجربة العميل لإدارة شغلك اليومي، حلول برمجية مترابطة تخدم أعمالك.
- **CTA:** ناقش مشروعك معنا → `/ar/contact`

### About — English

- **Heading:** We turn business needs into practical software.
- **Description:** At Rakmyat, we combine business understanding, thoughtful design, and software engineering to build digital solutions around real workflows and the people who use them.
- **CTA:** How We Work → `/en/how-we-work`

### About — Arabic

- **Heading:** بنحوّل احتياجات عملك لحلول برمجية عملية
- **Description:** في رقميات، بنجمع بين فهم طبيعة الأعمال والتصميم المدروس والهندسة البرمجية، عشان نبني حلول رقمية مناسبة لطريقة شغلك واحتياجات المستخدمين.
- **CTA:** اعرف طريقة شغلنا → `/ar/how-we-work`

## Files changed for this task

- `components/sections/PageHeroes.tsx` — shared rendering for the two existing hero compositions.
- `components/sections/PageHeroes.module.css` — scoped positioning and capability-hero styling transferred from the About composition.
- `components/sections/HomeSourceSections.tsx` — Home now renders the capability hero; content sections after it were left intact.
- `components/sections/AboutSourceSections.tsx` — About now renders the dashboard hero; sections after it were left intact.
- `content/page-heroes.ts` — localized Home and About hero copy and CTAs.
- `content/home.ts` — removed the moved Home-hero strings from the Home content record.
- `content/about-copy.ts` — removed the moved About-hero strings; all copy for subsequent About sections remains.
- `docs/hero-swap-evidence/` — before/after screenshots, manifests, QA scripts, comparisons, and this report.

Pre-existing uncommitted Phase 4 work remains in the shared working tree and was not discarded. A reversible archive of the pre-swap tracked diff and untracked files was created outside the repository at `%TEMP%/rakmyat-hero-swap-checkpoint-512c18c305.zip` (60,342,560 bytes).

## Visual and responsive verification

- Captured both pages in both locales at 1440, 1280, 768, and 390 pixels, before and after. Each set has 16 full-page captures and 16 hero-only captures; all manifest paths resolve.
- All 32 before/after route captures returned HTTP 200, have one H1, report no broken page images, and have no horizontal overflow.
- The aligned below-hero comparison has equal post-hero content height or differs by at most 1 CSS pixel. Mean absolute RGB-channel differences range from 0.0176 to 3.25148 on a 0–255 scale. This is not a claim of pixel-perfect rendering; screenshot timing and responsive capture variation account for small differences. See [visual-comparison.json](./visual-comparison.json).
- Hero layouts and CTA destinations were checked at 1440, 1280, 1024, 768, 390, and 360 pixels for both locales: 24/24 checks passed. Each CTA was activated and navigated to its localized destination; all hero images loaded.
- English and Arabic Services, How We Work, Portfolio, and Contact routes returned HTTP 200 after the change.

## Validation

- `npm.cmd run typecheck` — passed.
- `npm.cmd run lint` — passed.
- `npm.cmd test` — passed, 11 tests.
- `npm.cmd run build` — passed using an isolated physical copy of the current app. This kept the active preview server's `.next` directory intact.
- No deployment was performed.

## Preview

- [English Home](http://127.0.0.1:5210/en)
- [Arabic Home](http://127.0.0.1:5210/ar)
- [English About](http://127.0.0.1:5210/en/about)
- [Arabic About](http://127.0.0.1:5210/ar/about)

## Git

The current commit remains `512c18c305620891dd2ebc4bf99f288a9c2f51d9`; no commit was created because the shared tree contains pre-existing uncommitted Phase 4 changes. Checkpoint archive is stored outside the repository as noted above.
