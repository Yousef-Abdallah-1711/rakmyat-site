# Production operations

| Requirement | Status | Evidence / remaining action |
|---|---|---|
| Hosting/domain/HTTPS | BLOCKED | Provider and approved domain absent |
| Database/migrations | CODE READY / CONFIGURATION PENDING | Local Postgres migration tested; production provisioning and migration runbook needed |
| SMTP delivery | BLOCKED | Mailpit only; external owner-approved test pending |
| Secrets | NOT VERIFIED for production | Local secret files ignored; production secret manager absent |
| Backup and restore | PASS locally / BLOCKED production | Disposable restore verified; schedule, retention, offsite copy and production drill needed |
| Monitoring/alerts/logging | BLOCKED | No production service or evidence |
| Health checks | PASS locally | `/api/health` returned 200 with local dependencies healthy |
| Rollback/runbook/incident ownership | BLOCKED | Not documented for chosen provider |
| Privacy retention/deletion | OWNER APPROVAL REQUIRED | Policy and workflow approval absent |
| Dependency security | NOT VERIFIED current | Historical audit snapshot is not a current approved dependency review |

No service was provisioned and no deployment occurred.
