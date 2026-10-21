# 12 — Load-test results

## Controlled 500-VU public journey run

The raw k6 summary is [k6/500-vu-summary.json](k6/500-vu-summary.json). The test used a local production build at `127.0.0.1:5214`; k6 ran on the same Windows host. It ramped from 10 to 500 VUs, held 500 for 90 seconds, and covered all 32 public locale paths plus one source asset per iteration. The test did not touch production or the existing persisted staging database. Two earlier full runs are retained as [k6/500-vu-harness-check-failure.json](k6/500-vu-harness-check-failure.json) and [k6/500-vu-harness-check-failure-rerun.json](k6/500-vu-harness-check-failure-rerun.json); both passed HTTP status and latency thresholds, but k6 did not expose the internal prerender marker in its response-header map, so that redundant assertion failed. The final script uses user-visible status, locale markup and asset assertions. SSG is verified independently by the production build route table, route smoke, and direct origin response.

| Metric | Result | Threshold | Result |
|---|---:|---:|---|
| Maximum VUs | 500 | Reach 500 | Pass |
| Plateau | 90 seconds at 500 VUs | 90 seconds | Pass |
| Iterations | 32,532 | — | — |
| HTTP requests | 65,064 (161.32 req/s) | — | — |
| HTTP failures | 0 / 65,064 (0%) | <1% | Pass |
| Checks | 97,596 passed; 0 failed | zero failed | Pass |
| Overall HTTP p95 / p99 | 9.61 ms / 19.52 ms | <500 ms / <1,500 ms | Pass |
| Public HTML p95 | 5.88 ms | <500 ms | Pass |
| Public asset p95 | 12.90 ms | informational | — |
| Largest observed HTTP response | 129.06 ms | informational | — |

The CLI reported every configured threshold as passing. At a sample during the 500-VU plateau, the Next process was about 401 MB resident and the host had 6.83 GB of free RAM. The load generator and server share the same host, so these latency and throughput figures are local loopback measurements, not internet-user latency.

**Scoped benchmark result: PASS at 500 k6 VUs for this local public HTML-plus-source-asset workload. Formal capacity verdict: NOT VERIFIED.** The full requested representative workload and cold/warm, invalidation, spike, and recovery phases were not completed. VUs are simulated sessions; this result is not a claim of 500 real users or a production RPS ceiling.

## Interpretation

This is origin-only local evidence. It omits Caddy/TLS, a CDN, external client networks, realistic browser rendering, cache churn across replicas, SMTP, admin operations, and real production data. A passing outcome would be a bounded test-host result, not a production capacity guarantee. See [16-capacity-and-infrastructure.md](16-capacity-and-infrastructure.md).
