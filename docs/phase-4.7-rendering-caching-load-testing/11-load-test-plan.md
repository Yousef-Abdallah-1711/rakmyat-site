# 11 — Load-test plan

## Scope and safeguards

Target: a fresh production build served by standalone Next on `127.0.0.1:5214`, with a separate temporary PostgreSQL container at `127.0.0.1:5547`. The 5214 server, source tree and DB were isolated from existing previews and the persisted staging volume. No public or production endpoint was used. The test requests only public GET routes and static assets; it does not submit forms, exercise SMTP, or hit admin APIs.

## Workload and acceptance thresholds

The k6 script chooses uniformly among all 32 public EN/AR routes, checks HTTP 200 and locale markup, then fetches one logo or font source asset and sleeps 2–4 seconds. It ramps gradually through 10, 50, 100, 200, 350, then 500 VUs, sustains 500 for 90 seconds, and ramps down. Thresholds: overall request failure rate below 1%, zero route/asset checks failing, HTTP p95 below 500 ms, p99 below 1,500 ms, and public HTML p95 below 500 ms. Static rendering is verified separately through build output, route smoke and origin headers.

The recorded run omitted the suggested 25-VU plateau and did not separately record cold-cache, warm-cache, cache-invalidation, spike, or post-spike recovery phases. It also did not exercise the contact submission or the separately scoped admin sessions, Caddy/CDN, or browser rendering. Those are outstanding phases, not implied by the 500-VU result.

This is a local, same-machine generator and target test. It demonstrates that this build handled the bounded public GET workload on this host; it cannot establish the full visitor journey mix, global latency, edge/cache behavior, or safe production capacity. Stop if host memory pressure, error rate or latency rises sharply. Script: [k6/public-journeys.js](k6/public-journeys.js).

## Follow-up environment check — 2026-10-20

The full mixed-journey, cache-stage, spike, and recovery run was not repeated during this follow-up. The existing Phase 4.3 staging project is active on `127.0.0.1:5212`; its web container was using about 985 MiB of its 1 GiB limit. Other unrelated development projects were also active. Host CPU samples were 28–39% before any new candidate was started. Adding a 500-VU run on this shared host risks affecting those workloads, and the staging stack is not an isolated candidate. No requests were sent to that stack for this benchmark, and no containers, databases, or volumes were changed.

Resume the outstanding stages on an isolated host or an approved quiet window using a fresh candidate and disposable database. First measure the idle host, then progress through the planned VU plateaus with abort thresholds. Keep the Caddy/origin measurements separate from any future CDN measurements; no CDN provider or public hostname has been selected.
