# Performance measurements

The existing audit’s localhost Lighthouse mobile snapshots reported LCP of 7.3s (EN home), 12.6s (AR home), 11.3s (services), 7.9–10.3s (About), 8.9s (Portfolio), and 4.4s (Contact). Fresh Phase 4.1 runs are saved in `lighthouse/`; the EN home and services reruns measured 14.0s and 11.4s respectively. Localhost Lighthouse samples varied, and the fresh home sample is slower than the earlier one. These are lab results, not field Core Web Vitals. Audit attribution identified the hero H1 as the LCP element; blocking CSS and image payload were also opportunities, but they were not established as the LCP element.

| Current mobile route | Lighthouse LCP | CLS | Accessibility |
|---|---:|---:|---:|
| EN Home | 14.0s | 0.006 | 100 |
| AR Home | 12.6s | 0.002 | 100 |
| EN Services | 11.4s | 0.101 | 100 |
| AR Services | 11.4s | 0.000 | 100 |

Phase 4.1 did not make speculative global image or CSS changes: they risk altering the established page appearance and do not directly address the measured text LCP candidate. The before/after full-page captures document visual stability. The fresh lab runs do not show an LCP improvement; mobile LCP remains high and is an open performance issue. Compare like-for-like routes and treat localhost variation as lab noise. Field LCP/CLS/INP remains unavailable until a real deployment with consented measurement.

Performance remains a release follow-up: inspect font and critical CSS loading, determine if hero text paint is delayed by font/CSS, then repeat matched runs before changing assets or layout.
