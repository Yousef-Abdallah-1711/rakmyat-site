# Outstanding production requirements

1. Provision PostgreSQL, set `DATABASE_URL` and `RATE_LIMIT_SECRET`, apply the migration, provision the first admin, and verify restore/backups.
2. Configure SMTP and verify delivery to the pinned owner inbox. Schedule the retry command and monitor pending notification age.
3. Approve and publish a privacy notice, retention period, deletion/subject-access process, and data processor terms. Add retention automation only after the owner selects a period.
4. Review the bilingual field labels, option values, validation, focus order, contrast, screen-reader behavior, zoom/reflow, and manual WCAG 2.2 AA checks.
5. Review all screenshots and keyboard/mobile navigation behavior. Browser coverage here is local and is not a WCAG conformance certification.
6. Confirm production reverse proxy forwarding-header behavior, HTTPS, origin/domain, CORS policy, secrets, and database permission/monitoring setup.
7. Run a real end-to-end test against a staging database and SMTP account, including rate limiting, duplicate idempotency, outbox retry, admin login/logout, status updates, and private notes.

No deployment, production database write, admin account, or email send occurred in this phase.
