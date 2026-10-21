# Accessibility review

- Every screenshot retains localized descriptive `alt` text. Gallery links include the project name and image description in their accessible label; gallery previews add a visible localized caption.
- The viewer remains a modal dialog with localized labels; controls are semantic buttons with 44x44 px minimum targets and visible focus.
- Escape closes; left/right arrows navigate; previous/next buttons and touch swipe work; the viewer traps focus and restores it to the opening link.
- Background page scrolling is locked while the viewer is open and restored on close. Tall images scroll inside a contained viewport; zoom can be reset.
- Modal control placement uses logical inline properties for RTL; no screenshot is mirrored. Route checks confirmed `lang=ar` and `dir=rtl` on Arabic pages.
- Viewer image transition follows the existing `prefers-reduced-motion` rule.

Playwright exercised zoom, arrow navigation, Escape, focus return, Arabic controls, and scroll lock. This is a targeted interaction review; a formal screen-reader audit and full WCAG contrast measurement were not performed.
