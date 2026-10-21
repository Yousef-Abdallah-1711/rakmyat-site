# Test results

## Environment and containers

- Branch `phase-3/rakmyat-content-only`; HEAD remains `512c18c305620891dd2ebc4bf99f288a9c2f51d9` (changes are uncommitted in the existing user working tree).
- Production Docker image built successfully with Next.js 16.4.2 standalone output.
- Running Phase 4.3 services: `postgres`, `mailpit`, `web`, `email-worker`, and `edge`; all report healthy. Migration service exited successfully after applying both migrations. No other Compose project was stopped or modified.
- PostgreSQL 17.11 is internal only. Mailpit SMTP is internal only. Caddy publishes only `127.0.0.1:5212` and `127.0.0.1:18025`.
- `/api/health` returned `{"status":"ok"}` after stack start and recovery.

## Database, contact form, and email

- `0001_contact_admin.sql` and `0002_bounded_outbox_retries.sql` applied. A repeat migration run succeeded without reapplying either version.
- English and Arabic forms were submitted through the real production-mode Docker app using synthetic data. Both rendered the localized success state, and PostgreSQL persisted the inquiry with the matching `en`/`ar` locale and outbox row.
- Playwright E2E: 2 passed. It checks required, phone, and optional email validation; retains fields after a simulated 503 and after validation errors; submits EN/AR forms and verifies Mailpit capture; checks six routes at 390/900/1440 px for horizontal overflow; and confirms unauthenticated admin API rejection.
- Mailpit received messages with sender `info@rakmyat.online`, configured notification recipient, subject, text and HTML bodies. Arabic UTF-8 code points were verified in subject/body and the body locale was `ar`. The two-worker concurrency test yielded one Mailpit message per inquiry.
- Origin tests: unauthorized, missing, and Host-tampered requests returned 403. Rate-limit test allowed eight bounded submissions and then returned 429.
- SQL injection-shaped admin search returned zero results; a synthetic `<script>` private note was retained as plain string data. Admin status update persisted.

## Admin and recovery

- Provisioned a temporary synthetic account using the interactive no-echo script and a random credential; login/list/update/logout/expiry were verified. The account and local plaintext test credential were removed afterward. No default owner account was added.
- Admin checks: unauthenticated listing 401; wrong and nonexistent accounts 401; invalid Origin and Host-tampered login 403; login 200; authenticated list/dashboard 200; session cookie had `HttpOnly`, `Secure`, and `SameSite=Strict`; logout invalidated the session (401); forced expiry rejected access (401).
- Database outage returned health 503 and contact POST 503. Recovery restored health and retained data.
- SMTP outage kept the inquiry pending and retried successfully after Mailpit returned. Five failed attempts moved to terminal status `failed`.
- Worker restart preserved pending outbox data; two concurrent workers processed separate pending rows without duplicate Message-IDs.
- Forced failure during outbox insert returned 503 and transaction rollback left no partial inquiry.
- PostgreSQL restart preserved records. Backup/restore matched inquiry/outbox/admin counts `9:9:1` in a disposable restore target.

## Automated code checks

- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run test`: 15/15 PASS.
- Docker production build: PASS.
- `npm run phase43:e2e`: 2/2 PASS.

## Not verified

- Hostinger SMTP and inbox receipt remain BLOCKED; no external email was sent.
- No production deployment, production provider setup, or field monitoring was performed.
- The admin list retains its existing 100-row cap; pagination is not implemented.
