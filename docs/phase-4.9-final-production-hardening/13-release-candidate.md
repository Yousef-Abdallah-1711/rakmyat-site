# 13 — Release candidate

## Local validation image

The current production Dockerfile built and passed local route/SEO and isolated contact/admin integration smoke checks on 2026-10-20. Image: `rakmyat-phase49-rc:20261020-01`; deployment ID: `rakmyat-rc-20261020-01`; image ID/digest: `sha256:b8da5657ea9125dcf12b3958cd1ca6658d5036ab154679bd22ac2429a00ca856`; runtime user: `nextjs`. Build inputs were `NEXT_PUBLIC_SITE_URL=https://release-candidate.example.invalid`, `ROBOTS_INDEXING_ENABLED=false`, and the deployment ID above. This placeholder-origin image verifies the current Docker build and routes; it is not configured for production or approved indexing.

Production candidate build inputs must include the approved `PRODUCTION_HOSTNAME`, matching `NEXT_PUBLIC_SITE_URL=https://<hostname>`, `ROBOTS_INDEXING_ENABLED=false` unless separately approved, `INDEXING_APPROVED=false` by default, and a unique `NEXT_DEPLOYMENT_ID`. Rebuild after owner decisions and host-specific preflight; do not promote the local placeholder-origin image as-is. Record the git revision/worktree patch, lockfile, build output, image digest, preflight result, migration result, smoke results, and rollback image digest. Do not put secrets into build args or image layers.

## Phase 4.9 changed-file inventory

- Runtime/source: `app/[locale]/error.tsx`, `app/admin/error.tsx`, `app/api/admin/inquiries/route.ts`, `app/globals.css`, `components/admin/AdminInquiries.tsx`, `db/migrations/0002_bounded_outbox_retries.sql`, `next.config.ts`, `package.json`, `tsconfig.typecheck.json`.
- Production operations: `deployment/production.env.example`, `docker-compose.production.yml`, `scripts/production-preflight.ps1`.
- Evidence: this `docs/phase-4.9-final-production-hardening/` directory.

This inventory covers edits made in Phase 4.9 only. It does not re-list the substantial pre-existing uncommitted files from earlier phases; those remain in the user's worktree and were neither reverted nor committed.

No production deployment is authorized by this artifact. No rollback image digest has been designated.
