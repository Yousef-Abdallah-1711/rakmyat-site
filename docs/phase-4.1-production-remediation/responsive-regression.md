# Responsive regression

The final responsive sweep covers 34 localized/public/project/admin routes at 15 widths: 320, 360, 375, 390, 414, 480, 576, 768, 820, 1024, 1280, 1366, 1440, 1920, and 2560 pixels (510 observations). It checks HTTP success, document overflow, visible heading clipping, image load state, and browser page errors. Results are stored in `responsive-regression.json`; final target is 0 failures for each check.

Full-page baseline and after references at 1440px cover EN/AR home, services, and portfolio under `screenshots/before/` and `screenshots/after/`. They are review references, not pixel-difference acceptance; Phase 4.1 only changed scoped text colors/semantics and the mobile menu control height. The contact and navigation interaction matrix is in `interaction-results.json`.
