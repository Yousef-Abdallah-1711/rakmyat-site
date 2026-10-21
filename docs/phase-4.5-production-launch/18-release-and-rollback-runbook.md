# Release and rollback runbook

Do not deploy this current dirty worktree. The release identifier for this preparation is `phase45-local-20261020-512c18c3` (branch/HEAD plus local worktree; it is not a commit or immutable production image). Before release, review all pre-existing Phase 3–4 changes, create an owner-approved clean release commit or signed source archive, record its checksum, and build/tag the immutable image from that exact source.

1. Obtain the approvals in `19-owner-approval-gates.md`; confirm domain, host, DB, secrets, admin policy, monitoring and legal signoff.
2. Run production preflight; verify secret access and a recent encrypted backup. Do not echo environment or secret contents.
3. Build and scan the immutable candidate image. Validate Compose config; confirm only 80/443 are public and the database has no published ports.
4. Confirm migration review/restore plan, then run the one-shot migration only against the approved target.
5. Start services; verify DB/web/worker/edge health, TLS, English/Arabic public routes, contact without sending real inquiry, robots/sitemap gate, headers and admin authorization.
6. Monitor logs/alerts and inquiry/outbox state. Enable indexing only after separate owner approval.

Rollback: stop routing to the candidate, restore the previous immutable image tag, and retain the database. Do not reverse a schema migration automatically. If data compatibility is uncertain, use the approved backup restore plan into a replacement database and require owner approval before cutover. Record who authorized each operation, timestamp, image digest, migration ID and outcome. This procedure has not been rehearsed on a production provider.
