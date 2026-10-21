# 13 — Before/after comparison

| Evidence | Before: Phase 4.6 build | After: Phase 4.7 build | Reading |
|---|---|---|---|
| Localized public route rendering | `/en` was dynamic; response had private/no-cache/no-store | 32 EN/AR routes are SSG; `x-nextjs-prerender: 1`, `x-nextjs-cache: HIT`, shared `s-maxage` | Public page requests can be served from the generated route artifact. |
| Route smoke | No Phase 4.7 32-route smoke artifact | 32/32 returned 200, correct locale markup and one H1 | Content structure and locale metadata survived the layout split. |
| Optimized image cache | Existing optimizer setting/default had no Phase 4.7 cache evidence | Cold MISS then warm HIT, 80,968-byte variant, 1-day cache header | Local optimizer cache is active; edge cache remains untested. |
| Private admin | Existing dynamic route | Login works; authenticated admin API 200 private/no-store; unauthenticated API 401 no-store | Personal/admin data is excluded from shared caching. |
| Baseline load | Isolated old build, 10–50 VUs; 1,058 requests, HTTP p95 26.39 ms, HTML custom-trend p95 32.45 ms, reported failure rate 0; raw [baseline summary](k6/baseline-summary.json) | — | Different build and low-load setup; useful only as an indicative local reference. |
| Sustained peak | Not tested | 500 VUs held 90s; 65,064 requests at 161.32 req/s; 0 failures; overall p95 9.61 ms, HTML p95 5.88 ms; all assertions passed | Not a controlled before/after comparison because the after workload and load level differ materially. |

The old 5213 process was an isolated host Node preview, not the Phase 4.3 persisted database service, Caddy, or production. k6's exported baseline threshold metadata showed an inconsistent `fails` field despite `http_req_failed.value=0`; the conclusion relies on the zero failure rate metric, and the old result is labelled indicative. The new test summary is authoritative for the new run.
