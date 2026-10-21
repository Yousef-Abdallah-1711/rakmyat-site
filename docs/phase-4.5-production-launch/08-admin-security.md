# Admin security

Existing admin provisioning is an interactive local script; password hashes use scrypt, sessions store token hashes, cookies are HTTP-only and SameSite strict, production cookies are Secure, sessions expire after 12 hours, and server-side authorization protects inquiries. Phase 4.3 contains synthetic login, unauthorized API, logout, and session evidence.

Production provisioning is opt-in through Compose's `tools` profile and uses the app database role. Do not seed a default user or reuse staging credentials. Create a named admin only after host approval, use a unique generated password via an interactive terminal/password manager, and verify the first login. Keep admin access behind the approved network/identity boundary where practical.

MFA is not implemented in the current app. Production should add an approved identity provider or network access control if the owner requires MFA; do not claim MFA coverage. Audit events and centralized alerting for login failures require a privacy-conscious operational design.
