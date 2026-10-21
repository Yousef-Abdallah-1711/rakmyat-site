# 14 — Owner actions

1. Select the production host/platform and approve the public domain, DNS, TLS ownership, CDN, and allowed outbound network destinations.
2. Decide private PostgreSQL versus managed PostgreSQL. If managed, approve a reviewed provider-specific topology, TLS, network allowlist, role grants, and backup plan.
3. Supply newly rotated Hostinger credentials through the host secret manager and approve a single external SMTP acceptance/inbox test. Confirm the notification recipient.
4. Name the production administrator(s), access/recovery policy, and emergency credential rotation owner.
5. Select monitoring/error reporting and alert destinations; choose encrypted off-host backup storage, GPG key custody, schedule, and retention.
6. Approve privacy notice, inquiry retention/deletion policy, asset/theme licensing, and English/Arabic copy.
7. Complete human accessibility review and sign-off.
8. After candidate evidence is complete, separately approve production deployment and, if desired, search indexing (`INDEXING_APPROVED=true` plus the indexing flag).

No approval above is implied by local code or test evidence.
