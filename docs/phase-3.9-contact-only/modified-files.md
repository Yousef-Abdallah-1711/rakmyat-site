# Modified files and allowlist

## Phase 3.9 source changes

1. `components/sections/ContactSourceSections.tsx` — Contact-only hero/form markup, localized Contact copy, and the scoped CSS Module import.
2. `components/forms/ContactInquiryForm.tsx` — explicit `dir="ltr"` for phone, email, and URL inputs. Validation, requiredness, select values, request body, endpoint, status transitions, and persistence behavior were not changed.
3. `components/sections/ContactPage.module.css` — new styles scoped to the Contact root and its existing form classes.

## Phase 3.9 evidence and tooling

- `docs/phase-3.9-contact-only/README.md`
- `docs/phase-3.9-contact-only/contact-design-audit.md`
- `docs/phase-3.9-contact-only/modified-files.md`
- `docs/phase-3.9-contact-only/responsive-qa.md`
- `docs/phase-3.9-contact-only/form-interaction-tests.md`
- `docs/phase-3.9-contact-only/visual-regression.md`
- `docs/phase-3.9-contact-only/capture-qa.py`
- `docs/phase-3.9-contact-only/form-interactions.py`
- `docs/phase-3.9-contact-only/before-captures.json`
- `docs/phase-3.9-contact-only/after-captures.json`
- `docs/phase-3.9-contact-only/form-interaction-results.json`
- Before and after PNGs in `docs/phase-3.9-contact-only/screenshots/`.

## Excluded existing work

Before Phase 3.9, the working tree already contained changes to `app/globals.css`, `components/layout/SiteChrome.tsx`, `components/layout/SiteHeader.tsx`, and `components/sections/HomeSourceSections.tsx`. Those files are outside the Phase 3.9 allowlist and are not part of its commit. The Phase 3.9 source diff contains only the three Contact files listed above.

Rollback tag: `pre-phase-3.9-contact-only` points to the branch commit that preceded this Phase 3.9 commit.
