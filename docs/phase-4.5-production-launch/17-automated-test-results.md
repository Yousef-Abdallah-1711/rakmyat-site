# Automated test results

Historical Phase 4.3 and 4.4 reports remain in their original folders. Phase 4.5 outcomes below were recorded on 2026-10-20; detailed route and Lighthouse JSON files preserve sample timestamps and metadata.

| Check | Command/environment | Result | Evidence / limitation |
|---|---|---|---|
| Baseline/checkpoint | Git inspection and external checkpoint | PASS | `01-current-state-and-baseline.md` |
| Phase 4.3 stack | Docker Compose inspection, loopback only | PASS locally | No production provider |
| TypeScript | `npm.cmd run typecheck` | PASS | Full current worktree |
| ESLint | `npm.cmd run lint` | PASS | Full current worktree |
| Unit tests | `npm.cmd test` | PASS, 15/15 | Synthetic/local only |
| Production Compose syntax | `docker compose -f docker-compose.production.yml --env-file deployment/production.env.example config --quiet` | PASS | Did not start services |
| Docker production image | `docker build --tag rakmyat-phase45-candidate:20261020b --file Dockerfile .` | PASS | Isolated candidate; digest `sha256:9775a9a627565d43fc64497b3d43a1efbb715c9ace69737ee9c0485f76c8831e` |
| Chromium/Firefox/WebKit route matrix | Phase 4.5 runner; 33 routes x 17 widths x 3 engines | PASS, 1,683 observations | `responsive-route-results.json`; 0 route/layout/image/page issues; CSP diagnostics classified separately |
| Accessibility | Axe-core 4.10.3 and keyboard checks on 5 EN/AR/admin routes | PASS WITH INCOMPLETE RULES | 0 violations; color-contrast and prohibited-attribute rules need manual review; no screen reader review |
| Lighthouse | Lighthouse 13.5.0 / Chromium 156.0.8078.4; 3 runs per route/profile, devtools throttling | PASS LOCALLY / PERFORMANCE FOLLOW-UP | 18 reports; home mobile median LCP 3.61s EN / 3.86s AR; field data unavailable |
| Candidate HTTP smoke | 16 representative routes plus optimized image endpoint, loopback only | PASS, HTTP 200 | `candidate-smoke-results.json`; fresh read-only candidate with bounded cache tmpfs; no cache write errors |
| Candidate health | `/api/health` on database-disconnected preview | EXPECTED 503 | Intentionally no database; not production health evidence |
| Production preflight | Default missing-secret fail-closed case and synthetic `.test` fixture | PASS LOCALLY | No production host or credentials contacted |
| Real SMTP / production PostgreSQL / HTTPS | Not run | BLOCKED | Approval and provisioned service required |

Machine-readable requirement-by-requirement status is in `acceptance-matrix.json`. Human accessibility, live services, deployment, production backup restoration and operational alert delivery remain untested or blocked.
