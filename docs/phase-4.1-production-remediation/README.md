# Phase 4.1 — Production readiness remediation

Date: 2026-10-19  
Status: local remediation and evidence completed; no deployment.  
Baseline: `phase-3/rakmyat-content-only` at `512c18c305620891dd2ebc4bf99f288a9c2f51d9`.

This work follows the existing production audit reports. It does not repeat the audit or claim production readiness. It addresses safe code-level items that did not require owner decisions: gated SEO metadata, basic response headers, accessibility semantics and contrast, and an accessible mobile navigation hit area. Existing visual and content work was preserved.

## Results

- TypeScript, ESLint, and 15 unit tests pass. An isolated production build passes.
- Production canonical URLs, indexing, and sitemap entries require an explicit HTTPS origin plus `ROBOTS_INDEXING_ENABLED=true`; without that setup public pages stay `noindex` and the sitemap is empty.
- The responsive sweep measured 510 route/viewport combinations across 34 routes and 15 widths. Final result: 0 HTTP failures, document overflow, clipped visible headings, broken images, or browser page errors.
- After the latest header and service-card changes, a focused 900px sweep rechecked all 34 routes. It found 0 HTTP failures, overflow, clipped headings, broken images, or page errors; the responsive menu passed all four EN/AR home/services interaction checks. See [900px results](./responsive-900-qa.json) and [captures](./screenshots/responsive-900/).
- Interaction checks pass 27/27, including localized navigation, portfolio filters and case-study navigation, contact validation/error retention, admin/API protections, and the 44px mobile menu target.
- Contact POSTs returned 403 in this isolated preview because production origin allowlisting and persistence services were intentionally absent. No real inquiry was submitted or stored.

## Evidence

- [Baseline and workspace safety](./baseline-and-workspace-safety.md)
- [Remediation matrix](./remediation-matrix.md)
- [SEO](./seo-fixes.md) · [Accessibility](./accessibility-fixes.md)
- [Performance](./performance-before-after.md) · [Security and contact](./security-and-contact-review.md)
- [Localization](./localization-review.md) · [Responsive regression](./responsive-regression.md)
- [Test results](./test-results.md) · [Owner blockers](./owner-blockers.md)
- [Remaining risks](./remaining-risks.md) · [Final scorecard](./final-readiness-scorecard.md)
- Machine-readable: [interaction results](./interaction-results.json), [responsive results](./responsive-regression.json), and [responsive capture script](./capture-responsive.py).
- Fresh mobile Lighthouse JSON and run logs are in [`lighthouse/`](./lighthouse/); these are localhost lab measurements, not field data.
- Before/after full-page references are in [`screenshots/`](./screenshots/).
- Screenshot dimensions, byte sizes, and hashes are listed in [the screenshot manifest](./screenshot-manifest.json).

## Preview

The isolated verification build is available at <http://127.0.0.1:5211>. Its temporary `https://www.example.test` metadata origin was supplied only to the isolated build process for testing and is not a Rakmyat domain or a production recommendation.

No commit was created because the Phase 4/how-we-work and visual restoration work was already present as uncommitted user work before remediation. A source snapshot and patch were made outside the repository before changes; see the safety report.
