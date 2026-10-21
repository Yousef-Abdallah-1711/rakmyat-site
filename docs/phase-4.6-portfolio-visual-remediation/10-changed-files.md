# Changed files

## Application code

- `content/portfolio.ts` | explicit native dimensions and image presentation metadata for all 19 gallery image uses.
- `components/projects/ProjectVisualFrame.tsx` | metadata-driven image framing and localized captions/labels.
- `components/sections/MediaLightbox.tsx` | accessible zoomable, scrollable, keyboard/touch viewer and scroll/focus management.
- `app/globals.css` | gallery composition, tall/mobile modes, viewer controls, responsive behavior, and reduced-motion handling.

## Regression coverage

- `tests/portfolio-media.test.ts` | metadata and source existence checks.
- `tests/e2e/portfolio-media.spec.ts` | viewer interactions, Arabic RTL, and all localized project routes.

No original screenshot file was edited. No unrelated site section, admin flow, or infrastructure was changed.
