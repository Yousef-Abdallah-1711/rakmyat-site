# Homepage regression comparison

Home was captured before and after at 1440, 1280, 768, and 390 CSS pixels in both locales. The baseline was built from commit `323d4d1` in a temporary worktree and captured with the same production browser, font readiness, eager image decoding, full-page JPEG quality, and disabled CSS/Web Animations as the final build.

The decoded image dimensions and page heights match for every pair. Mean absolute RGB channel difference was zero for seven comparisons and 0.001 for Arabic at 768px (one near-threshold pixel-level variation across the full page). There is no visible homepage change. All paired images are listed in [captures.json](./captures.json), and exact metrics are in [homepage-regression.json](./homepage-regression.json).

Source isolation also confirms the homepage is untouched: `HomeSourceSections.tsx`, `app/globals.css`, shared site chrome, and homepage content records are unchanged. New CSS is a CSS Module imported only by the About component.
