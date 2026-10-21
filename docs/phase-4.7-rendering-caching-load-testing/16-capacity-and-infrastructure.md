# 16 — Capacity and infrastructure

The controlled target was a standalone Next production build running directly on the Windows host, with a separate 1-CPU/512-MiB temporary PostgreSQL container using tmpfs. The test generator ran on the same machine (8 physical / 16 logical CPU host, about 7.1 GiB free RAM at test start). This is not equivalent to production compose, whose planned limits are web 1.5 GiB/2 CPU, PostgreSQL 1 GiB/2 CPU, worker 256 MiB/0.5 CPU and Caddy 192 MiB/0.5 CPU.

The production compose definitions give an initial resource envelope; they have not been load-tested together. Before release, measure the candidate image behind Caddy and the selected CDN, with the intended DB limits, using an isolated environment and realistic external generators. Test at least 500 VUs only if the approved target can be monitored and safely aborted. Also test cold start, warm cache, cache churn and recovery after a replica restart.

**Capacity verdict: NOT VERIFIED.** The local origin-only public page/asset workload passed at 500 k6 VUs with all configured request, latency and check thresholds passing. The full representative workload, cache phases, and production-like proxy/CDN path were not tested, so this does not meet the prompt's 500-visitor verification criteria. Do not promise 500 concurrent real users from this test.
