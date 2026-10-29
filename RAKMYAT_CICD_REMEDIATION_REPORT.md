# Rakmyat CI/CD Remediation Report

**Date:** 2026-10-29 UTC  
**Repository:** <https://github.com/Yousef-Abdallah-1711/rakmyat-site>  
**Pull request:** <https://github.com/Yousef-Abdallah-1711/rakmyat-site/pull/1>  
**Branch:** `codex/cicd-remediation-2026-10-29`  
**Validated commit:** `5977afeb63d4d217b7ded1c5e82d35453a2d53c8`  
**Successful PR Actions run:** [40841536173](https://github.com/Yousef-Abdallah-1711/rakmyat-site/actions/runs/40841536173)  
**Scope:** CI/CD remediation and GitHub-hosted PR validation. No production service, VPS, database, Nginx, firewall, GitHub deployment setting, or production deployment was changed.

## A. Original Failure Investigation

The baseline workflow run [40831318065](https://github.com/Yousef-Abdallah-1711/rakmyat-site/actions/runs/40831318065) ran for 27m55s and was manually cancelled by the repository owner. The cancellation itself is not classified as a test failure.

The authorized run logs show the Next.js dev server passed its readiness loop and the responsive suite began. It reported 201 tests across Chromium, Firefox, and WebKit. Before cancellation, the logs also showed repeated 30-second timeouts in the services-details rocket/heading regression test on all three browsers and a timeout in the WebKit how-we-work route sweep. A mobile-menu attempt failed once and passed on retry. The browser suite never completed, so the run did not provide a complete browser pass.

The long runtime came from running the full cross-browser suite in one job with two workers, plus route tests that navigate and scroll through multiple viewports. Browser startup was not the problem; the server was ready and tests were executing. Because the cancelled run ended before its report was finalized, full per-test failure traces were unavailable then.

## B. Root Causes

1. All three browser projects shared one workflow job, increasing total wall-clock time and making progress harder to isolate.
2. The rocket regression test used the stale selector `.inner-header h2`; the current page renders its title as `.inner-header .content h1`. Its `load` navigation also waited for unnecessary page resources before measuring layout.
3. Multi-navigation overflow checks had a 30-second default despite exercising five viewport sizes; a WebKit route sweep exceeded it.
4. File-backed Compose secrets were created mode `0600`, unreadable to the app’s non-root UID 10001.
5. The Phase 4.3 Playwright configuration selected the entire `tests/e2e` tree, including admin and local-database tests unrelated to the disposable integration environment.
6. A first runtime-secret assertion inspected a new `docker compose exec` process, which does not inherit variables exported by the container entrypoint. This was a faulty test assertion, not an application startup defect.
7. The English mobile-menu test could click its server-rendered button before client hydration completed; explicit route readiness was needed before interaction.

## C. Code Changes

- Reworked `.github/workflows/ci-cd.yml` into separate static-validation, browser-matrix, Docker-validation, publish, and deploy jobs.
- Updated `deployment/deploy-production.sh` to accept a full-SHA image tag or a pinned `sha256` digest, so the deployment path can consume the verified registry digest.
- Added `RAKMYAT_CI_IMAGE` to the app services in `docker-compose.phase-4.3.yml`; the workflow supplies the already-built production image instead of rebuilding a different image for integration.
- Removed fixed names from Phase 4.3 volumes and networks so Compose scopes them to the unique per-run project.
- Updated `scripts/run-phase43-e2e.mjs` to use the same `COMPOSE_PROJECT_NAME` and Compose file for its staging-only rate-limit fixture reset.
- Updated `playwright.phase43.config.ts` to run only `phase43-contact.spec.ts`, the integration suite intended for this disposable stack.
- Corrected the services-details layout selectors and added a network-idle readiness wait before the mobile-menu interaction.

## D. Playwright Improvements

- Split Chromium, Firefox, and WebKit into independent GitHub-hosted matrix jobs with `fail-fast: false`, two workers per job, a 40-minute job bound, a 35-minute Playwright global bound, and explicit test/expect timeouts.
- Configured Playwright’s `webServer` readiness probe at the selected local URL with a 120-second startup bound. CI no longer relies on an unbounded background-server shell loop.
- Kept retries at one. Traces are retained only on failure, screenshots are captured only on failure, and the HTML report plus `test-results` are uploaded as run-specific artifacts.
- Raised the core multi-route viewport sweep timeout to 90 seconds because the test performs five navigations and scroll-throughs. The existing home full-matrix test retains its explicit 120-second allowance.
- The successful final run passed all three responsive jobs. Chromium reported 67 passed; Firefox and WebKit reported 37 passed each. The 30 skipped browser-specific cases are the suite’s existing intentional skips.

## E. Docker Integration Improvements

- Each stack uses `rakmyat-ci-${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}` consistently for startup, E2E fixture lookup, health checks, log collection, and cleanup.
- Removed hardcoded external volume/network names so database, media, Mailpit, and Caddy resources are project-scoped. The workflow creates disposable synthetic secrets, makes those files readable to UID 10001, and never uses production credentials or data.
- On failure, the workflow saves `compose ps --all` and service logs before cleanup. Cleanup uses `down --volumes --remove-orphans` for only that job’s project.
- The final run started PostgreSQL, Mailpit, the migration service, app, worker, and local edge; migrations completed, web/worker health checks passed, contact/inquiry E2E tests passed, production Compose parsed, and the run’s stack was removed.

## F. Docker Image Verification

- Pull-request validation builds the production `Dockerfile` once for `linux/amd64`, with no registry push. It verifies the image architecture, OCI revision label, and runtime user `nextjs` (UID 10001 in the running container).
- The same local image is used by the disposable Compose integration stack. The final run verified the app health endpoint, entrypoint secret-file loading without printing values, database migrations, the browser integration suite, and worker health.
- On an eligible main push, the successful validation job uploads the tested image tar and safe build metadata; the publish job loads and publishes that same image rather than rebuilding it. The PR run did not upload a release image artifact because the main-push condition did not apply.
- Candidate image building and runtime integration are verified. Registry publication, remote digest inspection, and deployment-by-digest were not exercised because this was a PR and production remains disabled.

## G. GHCR Release Integrity

- Release tags use the full commit SHA; OCI source and revision labels are set.
- The publish job refuses to overwrite an existing SHA tag, captures the registry digest, pulls the digest reference back, and verifies the published revision and AMD64 architecture.
- Safe release metadata is written to the Actions summary and a 90-day artifact. The deployment job receives `ghcr.io/...@sha256:...` rather than a mutable tag.
- These GHCR publish and post-publish checks are source-reviewed but were correctly skipped in the PR run; no image was published.

## H. GitHub Actions Changes

- Pinned maintained action releases to full commit SHAs: checkout v7.0.1, setup-node v7.1.0, upload-artifact v7.0.2, download-artifact v8.0.2, setup-buildx v4.4.1, build-push v7.4.0, and login v4.7.0.
- Set the runner explicitly to `ubuntu-24.04` and assigned explicit timeouts to every job.
- Production Compose syntax validation now runs on PRs as well as main pushes.
- Kept least-privilege job permissions. PR and manual events can validate only; only a successful push to `main` can publish, and only a main push with the explicit production gate can deploy.

## I. Test Results

Final successful run `40841536173`, head commit `5977afeb63d4d217b7ded1c5e82d35453a2d53c8`:

| Check | Result | Duration/details |
|---|---|---|
| Lint, typecheck, unit tests | **Passed** | Static validation job |
| Next.js production build | **Passed** | PR noindex configuration |
| Production Compose config | **Passed** | Static `config --quiet`; no production stack started |
| Production Docker image build | **Passed** | Linux AMD64, revision and non-root identity verified |
| Disposable Docker integration | **Passed** | Migration, app health, runtime secret loading, contact E2E, worker health |
| Chromium responsive suite | **Passed** | 67 tests passed |
| Firefox responsive suite | **Passed** | 37 tests passed; existing intentional skips retained |
| WebKit responsive suite | **Passed** | 37 tests passed; existing intentional skips retained |
| GHCR publish | **Skipped as intended** | PR event only |
| VPS deploy | **Skipped as intended** | PR event only; production gate unchanged |

Earlier remediation runs were used to diagnose and fix failures: [40837541098](https://github.com/Yousef-Abdallah-1711/rakmyat-site/actions/runs/40837541098) and [40839351595](https://github.com/Yousef-Abdallah-1711/rakmyat-site/actions/runs/40839351595). Their artifacts captured the secret permission failure, stale selector, and incorrect exec-environment assertion. The final run verified the corrections.

## J. Actual Workflow Run IDs

- Baseline cancelled run: `40831318065`.
- First remediation validation: `40837541098` — static job passed; integration secret file permissions and stale layout selector were found.
- Second remediation validation: `40839351595` — Firefox and WebKit passed; Chromium exposed a mobile hydration timing issue; Docker migrations and health checks passed before an invalid exec-process environment assertion stopped that job.
- Final passing PR validation: `40841536173` — all five required validation jobs passed. Publish and deploy were skipped by their event conditions.

## K. Remaining Issues

1. The `main` branch has no branch protection/ruleset. Required status checks, PR reviews, and force-push restrictions therefore are not enforced by repository settings. This was inspected and left unchanged; configure it under the repository owner’s change process.
2. GHCR publication and digest-based VPS deployment were not exercised. The successful CI result verifies the tested image but does not prove production registry access or deployment behavior.
3. The separate production VPS audit still reports unresolved backup/restore proof, disk usage at 95%, exhausted swap, sustained blue/green capacity, deployed image identity, and host deploy-script prerequisites. See [RAKMYAT_LIVE_VPS_AUDIT_2026-10-29.md](RAKMYAT_LIVE_VPS_AUDIT_2026-10-29.md).
4. The CI release build requires explicit Actions variables `NEXT_PUBLIC_SITE_URL`, `ROBOTS_INDEXING_ENABLED=true`, and `INDEXING_APPROVED=true`. These values were not configured by this remediation; PR validation defaults to noindex.

## L. Production Deployment Gate Status

The authenticated read-only GitHub inspection found no repository Actions variables, no `production` environment, and no Actions secrets. In particular, `PRODUCTION_DEPLOY_ENABLED` is absent, so the deploy condition is false. The deploy gate was not enabled and no production job ran. No production host or service was touched.

## M. Final CI Readiness Verdict

### `CI_READY_WITH_BLOCKERS`

The PR validation pipeline completed successfully on the final branch commit, including static checks, a production Docker image build, isolated migration/database/browser integration, and Chromium/Firefox/WebKit responsive suites. The exact tested image is wired for later main-push publication by digest, but GHCR publication and VPS deployment were not run from this PR.

The remaining blockers are repository enforcement and production release readiness: `main` is unprotected, approved release variables are absent, and the separate VPS audit still has backup, capacity, disk/swap, and deploy-prerequisite gaps. This verdict means CI validation is green; it is not an authorization or readiness claim for production deployment. No merge or production change was made.
