# Performance verification

Phase 4.2 evidence contains 32 paired baseline/after Lighthouse JSON reports for eight page types, EN/AR, mobile/desktop. Reported mobile medians: performance 75 to 79.5, LCP 3.98s to 3.58s (10.1% decrease), transfer 1802 to 1369 KiB (24.1% decrease). Desktop medians: score 90 to 94, LCP 1.75s to 1.48s (15.5% decrease), transfer 1811 to 1378 KiB (23.9% decrease). An EN Services mobile CLS 0.1024 font-related outlier remains documented; preload experiment increased LCP and was not retained.

This review inspected the prior report summaries and retained raw JSON but did not execute a new repeated Lighthouse comparison, so no new before/after claim is made. These are single-run localhost lab records, not field Core Web Vitals. Production CDN, field data, request/payload trend, and all project page performance remain unverified.
