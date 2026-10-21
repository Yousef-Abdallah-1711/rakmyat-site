# Owner approval gates

Engineering work is prepared, but these decisions are required before deployment:

1. Select managed container + managed PostgreSQL or a dedicated Linux VPS; approve budget/provider and operational owner.
2. Approve the website hostname (mailbox domain does not imply website domain), canonical host/redirect policy, and DNS ownership.
3. Provision separate production database, app/migrator/bootstrap secrets, rate-limit key, and internal worker secret through an approved secret store; choose TLS and backup retention.
4. Rotate the exposed SMTP password and provision the replacement only through a secure local/host secret store. Separately authorize exactly one synthetic external SMTP message and its recipient verification.
5. Name administrators and decide admin network/identity/MFA requirements; never reuse staging credentials.
6. Approve monitoring destination, alert recipient, incident owner, RPO/RTO, backup destination and retention.
7. Approve indexing separately; until then keep `ROBOTS_INDEXING_ENABLED=false`.
8. Obtain privacy notice, data retention/deletion, theme/font/media/client-rights evidence, and English/Arabic claims/copy approval.
9. Complete qualified accessibility review and resolve confirmed release-blocking findings.
10. Approve immutable candidate identifier and explicit deployment scope before any public exposure.

The current prompt does not provide blanket authorization for these external actions. No approval has been inferred from silence.
