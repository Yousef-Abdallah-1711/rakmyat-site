# Changed files

Files changed by this hardening work:

- `.env.example` — names and defaults for production Origin, trusted-IP, and limit configuration.
- `package.json`, `package-lock.json` — maintained strict phone-number metadata dependency.
- `lib/inquiry-schema.ts` — shared strict validation and E.164 phone normalization.
- `lib/inquiry-security-policy.ts` — testable Origin, trusted-IP, limit parsing, and retry helpers.
- `lib/server/security.ts` — explicit trusted client identity, atomic window limiter, expired bucket cleanup.
- `app/api/inquiries/route.ts` — Origin/media/payload checks and dual persistent rate limits.
- `app/api/admin/login/route.ts` — pass request headers to the shared trusted-IP policy; absent production proxy configuration fails closed.
- `db/migrations/0001_contact_admin.sql` — idempotent cleanup index on rate-limit window time.
- `components/forms/ContactInquiryForm.tsx`, `content/inquiry-copy.ts` — localized shared-schema live validation, accessible summary/focus, phone keyboard hint, and retained form state on errors/429.
- `components/admin/AdminInquiries.tsx` — allowlist legacy reference links to HTTP(S).
- `tests/inquiry-schema.test.ts`, `tests/inquiry-security-policy.test.ts` — schema and policy regression coverage.
- `docs/contact-security-hardening/` — this report set, QA script/results, and 10 screenshots.

Pre-existing unrelated working-tree changes in the homepage/header and global CSS were left untouched and are not part of the hardening commit. No BDA source project files were changed.
