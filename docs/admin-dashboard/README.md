# Admin Dashboard

## Overview

The admin dashboard manages contact inquiries, the blog (posts, categories, tags), and uploaded media. It uses a persistent sidebar (`components/admin/AdminShell.tsx`) that collapses to a horizontal top bar on small screens. Each admin page calls `getAdminSession()` and redirects to `/admin/login` if there is no valid session.

Related: [Blog CMS](../blog-cms/README.md), [Architecture](../ARCHITECTURE.md), [Known issues](../KNOWN-ISSUES.md).

## Access

- URL: `http://localhost:5175/admin/login`
- Credentials (local development only): `admin@rakmyat.local` / `Rakmyat@Admin2026!`

These credentials exist only in the local development database. Do not reuse them in any shared or deployed environment. Create separate accounts there with `npm.cmd run admin:create`.

Use `localhost`, not `127.0.0.1`, in the browser. Session cookies are host-scoped, so keep the same host for sign-in and every admin page.

## Pages

| Page | URL | Description |
|---|---|---|
| Sign in | `/admin/login` | Email and password form. Shows a countdown when sign-in is rate-limited. |
| Inquiries | `/admin/inquiries` | Contact submissions with status workflow, notes, search, and the security settings panel. |
| Blog Posts | `/admin/blog` | Post list, create and edit form, and a Taxonomy tab (categories, tags, post types). |
| Categories | `/admin/blog/categories` | Create, edit, and delete blog categories. |
| Tags | `/admin/blog/tags` | Create, edit, and delete blog tags. |

The sidebar links to Inquiries, Blog Posts, Categories, and Tags. The media library has no page of its own. It opens as a modal from the blog editor (the image button in the rich-text editor and the cover-image field).

## Media library

- Upload by drag-and-drop or file picker (`react-dropzone`). The media library opens from the blog editor, not from its own page.
- Accepted types: JPEG, PNG, WebP, GIF, AVIF images; MP4 and WebM videos. The server checks each file's magic bytes against its MIME type and rejects mismatches.
- Maximum size: 50 MB per file.
- Files are saved to `public/uploads/images/` or `public/uploads/videos/` and served as static files.
- Deleting a file in the library asks for confirmation. Posts that already embed it will show a broken image.

## Auth and security

### Sign-in and sessions

- `POST /api/admin/login` checks the email and password (password up to 200 characters). Passwords are stored as scrypt hashes.
- A successful sign-in creates a random session token. Only its SHA-256 digest is stored, in `admin_sessions.token_hash`.
- Sessions expire 12 hours after sign-in. The expiry is fixed at sign-in and is not extended on use.
- Disabled accounts (`admin_users.disabled_at` set) cannot use existing sessions.
- The session cookie is `rakmyat_admin_session` in development. In production it is `__Host-rakmyat_admin_session`, which requires `Secure`, `Path=/`, and no `Domain`. Both are `HttpOnly` and `SameSite=Strict`.
- Admin mutations check the request origin against the host (`requireSameOrigin`).

### IP allowlist

`ADMIN_IP_ALLOWLIST` is a comma-separated list of IPs. Login attempts from these IPs skip rate limiting. They still need valid credentials. The local `.env.local` sets `127.0.0.1,::1,localhost`. `::1` is normalised to `127.0.0.1` for matching.

Keep the list to addresses you control. The allowlist is read from the environment, so changing it needs a server restart.

### Rate limiting

Login has two limits, each over a 15-minute window (900 seconds):

- 10 failed attempts per client IP.
- 6 failed attempts per account (email).

Only failed password attempts count. Successful sign-ins do not use up attempts. When a limit is hit, the server returns `429` with a `Retry-After` header, and the sign-in form shows a countdown until the limit clears.

Bucket keys are HMAC-SHA256 digests keyed with `RATE_LIMIT_SECRET`, so raw IPs and emails are not stored in `rate_limit_buckets`. Expired buckets are removed after two days.

### Security settings panel

The Inquiries page includes a security panel that shows:

- Whether the IP allowlist is active, with the allowlisted IPs masked (`GET /api/admin/security`).
- Current rate-limit bucket statistics (`GET /api/admin/rate-limits`).
- A "clear all" action (`DELETE /api/admin/rate-limits`) that resets every login and inquiry counter after a confirmation prompt.

Clearing rate limits takes effect immediately. Use it only when you have confirmed the lockout is not an attack.

## Creating an admin account

From `next-app/`, in an interactive terminal:

```powershell
npm.cmd run admin:create
```

The script loads `.env.local` and needs `DATABASE_URL`. It prompts for:

1. Admin email. It is lowercased and must be a valid email address.
2. New password, at least 14 characters. Input is hidden.
3. Password confirmation.

The password is stored as an scrypt hash (16-byte salt, 64-byte derived key). The script refuses to run without a TTY, so the password is never echoed. If the email already exists, the script stops. The codebase has no password-reset or rotation tool, so rotating a password needs a controlled manual process.

## Sign out

- Sidebar: the sign-out button (`AdminSignOutButton`) calls `POST /api/admin/logout`, which ends the current session.
- Navigating to `/admin/login` without signing out leaves the session active until it expires.

`destroyAllAdminSessions()` in `lib/server/security.ts` ends every session for an account. No UI calls it at the time of writing.
