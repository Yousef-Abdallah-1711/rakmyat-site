# 09 — Accessibility and portfolio

Existing Phase 4.5 evidence records automated axe/keyboard checks on representative EN/AR/admin routes with zero reported violations, while noting incomplete color-contrast/prohibited-attribute rules and no screen-reader review. Current contact controls expose labels, invalid state, described-by errors, live status, and focusable error links. Admin pagination controls have accessible names, disabled states, and a live page count; localized public and admin error boundaries use generic retry messages without leaking exception details. Portfolio gallery images have explicit source metadata; long screenshots use focused previews, mobile screenshots retain device proportions, and the lightbox has keyboard handling and localized direction. Reduced-motion CSS/JS handling exists in the reviewed sections.

Phase 4.6 imagery/layout work and Phase 4.5 route observations remain in their original evidence folders; this phase makes no redesign or fabricated media changes. No new huge browser matrix or Lighthouse sweep was run.

## Manual accessibility sign-off

- Keyboard through navigation, contact form, filter controls, and lightbox open/close/next/previous; confirm visible focus and logical return focus.
- Review representative English and Arabic pages with screen reader, including validation, success, and server-failure messages.
- Check contrast for text, placeholders, focus indicators, and status colors; check 200% zoom and 320 px width.
- Confirm RTL reading/focus order and that reduced-motion preference removes nonessential movement.
- Record owner review; do not describe this as WCAG 2.2 AA certification without qualified human assessment.
