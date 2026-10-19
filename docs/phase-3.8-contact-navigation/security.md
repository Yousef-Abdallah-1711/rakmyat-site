# Security and privacy notes

- Public payloads are capped at 16 KiB and server-validated. Name, phone, optional email, lengths, URLs, locale, and fixed option enums are checked. Control characters in names are rejected. A honeypot and shared PostgreSQL fixed-window rate limiter are included.
- Inquiries and email notifications are persisted atomically; idempotency keys are unique. SQL uses parameterized statements. Contact notifications escape all user values before HTML email rendering.
- The notification recipient is fixed to the owner-provided `yoseabdallah866@gmail.com`. SMTP credentials and database secrets are server-only environment variables. Error responses do not echo database/SMTP details.
- Login and inquiry rate limiting share a database across app instances and hash request identifiers with a secret pepper. Production proxy configuration must overwrite or sanitize `x-forwarded-for`/`x-real-ip`; do not trust client-provided forwarding headers at a directly exposed origin.
- Admin routes and API responses are private and no-store. Authentication is checked server-side. Mutations reject cross-origin requests. Session cookies are HttpOnly, SameSite=Strict, Secure in production, and backed by revocable database session hashes.
- Passwords are scrypt-hashed; login attempts are rate limited by both address and account identifier. There is no default password or public signup.
- Contact data is personal information. The owner has not specified an approved retention period, privacy notice, deletion request process, processor/DPA requirements, or production incident contact. Establish these before release. No automatic inquiry deletion is configured, to avoid silently discarding leads.
- Apply least-privilege database permissions, TLS, encrypted backups, a restore test, database monitoring, and a secret rotation plan before production.
