# Remaining limitations and release gates

- Configure and verify the real production proxy's sanitized client-IP header (`TRUSTED_CLIENT_IP_HEADER`). Production without this configuration rejects submissions and admin login with a safe 503.
- Set exact `CONTACT_ALLOWED_ORIGINS`, stable `RATE_LIMIT_SECRET`, PostgreSQL URL, and operational limits in the hosting secret store.
- Apply the idempotent SQL migration to an isolated/production database through the normal deployment process; confirm the cleanup index exists. This task did not mutate a database.
- Run PostgreSQL integration tests for concurrent requests, 3/15-minute and 10/24-hour enforcement, Retry-After boundaries, store outage, idempotent duplicate submissions, transactional outbox behavior, and admin reads using a dedicated test database.
- Configure SMTP and test the existing notification workflow with non-production mail. A successful SMTP handoff does not prove delivery to a recipient; exactly-once email cannot be promised if a process fails between SMTP acceptance and the outbox status update.
- The checked browser scenario used a mocked 429 to verify localized feedback and state retention. Real production request quotas were not exercised.
- Client-side validation can be bypassed; server-side schema, Origin policy, payload limits, honeypot, trusted IP identity, and PostgreSQL limits remain the security boundary.
- Per-IP limits can be distributed across networks or affect users behind shared NAT. Tune only from observed traffic and abuse monitoring.
- Existing application database privileges were not inspected or changed. Confirm least privilege in the deployment environment.
- The form remains a user-provided contact channel. Set applicable privacy notice, retention, and operational access policy before production use.

No deployment occurred.
