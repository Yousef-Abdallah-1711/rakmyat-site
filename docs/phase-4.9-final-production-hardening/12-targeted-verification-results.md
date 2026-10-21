# 12 — Targeted verification results

Run after the Phase 4.9 configuration/code edits on 2026-10-20. No service was started by the Compose validation.

| Check | Result | Notes |
|---|---|---|
| `npm.cmd run lint` | PASS | ESLint clean. |
| `npm.cmd test` | PASS, 17/17 | Current unit suite. |
| Source TypeScript check | PASS | `npm.cmd run typecheck` now uses `tsconfig.typecheck.json`, excluding stale generated `.next` route types; Next build still validates generated route types. |
| Production Compose config | PASS | `docker compose --env-file deployment/production.env.example -f docker-compose.production.yml config --quiet`; validates configuration only. |
| PostgreSQL role/migration smoke | PASS | Disposable PostgreSQL 17 with tmpfs: role initializer, both migrations applied twice, and synthetic insert as `rakmyat_app`; container removed. |
| Dependency audit | PASS | `npm.cmd audit --omit=dev`: zero production dependency vulnerabilities reported. |
| Default full `tsc` against preserved `.next` | FAIL, expected stale artifacts | `.next/dev/types/validator.ts` and `.next/types/validator.ts` reference old `app/*` routes removed by the previous route migration. Generated directory last modified 2026-10-19 and was not overwritten. |
| Production build / image | PASS | Built `rakmyat-phase49-rc:20261020-01` with placeholder origin `https://release-candidate.example.invalid`, indexing disabled, and deployment ID `rakmyat-rc-20261020-01`. Next.js 16.4.2 build and generated route type validation passed; all 40 static pages generated. Image ID/digest: `sha256:b8da5657ea9125dcf12b3958cd1ca6658d5036ab154679bd22ac2429a00ca856`; runtime user is `nextjs`. This is a local validation image, not a production-configured release. |
| Route/SEO smoke | PASS | Disposable image container returned 200 for 32/32 localized EN/AR routes with expected language and H1, Arabic-default `/` redirect, 200 admin login, and `robots.txt` disallowing indexing. Container removed. |
| Contact/outbox/admin integration smoke | PASS | Separate internal Docker network with tmpfs PostgreSQL 17, the candidate image, temporary worker, and local Mailpit. Contact submission, idempotent replay, Arabic locale persistence, local outbox delivery, admin login, 25+1 pagination, record update, and logout revocation passed. All temporary containers and the network were stopped/removed; no staging service/data/volume was used. |
| SMTP provider / inbox | NOT VERIFIED | No rotated password or external-email authorization. |
| 500-VU, spike, soak, huge browser matrix | NOT RUN | Explicitly excluded by this phase's instructions. |

The production-preflight PowerShell file parsed without syntax errors, but runtime execution was blocked by this machine's PowerShell execution policy for unsigned local scripts. It was not bypassed. The supplied example is intentionally a placeholder and preflight requires owner-approved hostname and secrets. No real SMTP credentials, recipient delivery, production database, external CDN, load test, deployment, or indexing enablement was used. Previous Phase 4.3/4.5/4.7 results remain separately documented and are not represented as new test runs here.
