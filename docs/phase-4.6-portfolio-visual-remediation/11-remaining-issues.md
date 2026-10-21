# Remaining issues

1. **Concord CRM and Product Scraper:** only conceptual illustrations exist for these projects. They remain clearly labeled as concepts. For real case-study screenshots, provide owner-approved desktop and mobile captures in both languages where available; do not replace the illustrations with invented product UI.
2. **Build memory:** Next's build-time type validation exceeded 4 GB and 6 GB heaps in the isolated build. The separate source `tsc --noEmit` passed, and the isolated production compile completed with build type validation skipped. A higher-memory CI build can confirm the default combined build path.
3. **Accessibility scope:** no formal assistive-technology session or exhaustive contrast audit was run.

No broken image, horizontal overflow, or known unresolved screenshot-layout defect remained in the tested project routes.
