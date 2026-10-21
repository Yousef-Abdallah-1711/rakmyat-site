# 19 — Session 4: live-data admin verification

## Objective

The single highest-value open item across Sessions 1–3: verify the admin dashboard's responsive CSS fixes (`.admin-shell` box-sizing, `.admin-filters` grid) against a real authenticated session with real data, not just code review. This had been blocked every prior session by the absence of a local `DATABASE_URL`.

## Approach: fully isolated, disposable, and fully torn down afterward

No existing infrastructure was touched. A brand-new, uniquely-named Postgres container (`rakmyat-session4-disposable-pg`, `postgres:17-alpine`, port 5680, throwaway credentials) was created solely for this session — entirely separate from the pre-existing `rakmyat-phase43-staging-*` Docker stack, which was left running and untouched throughout. Migrations (`db/migrations/0001_contact_admin.sql`, `0002_bounded_outbox_retries.sql`) were applied via the project's own `scripts/migrate.ts`. One test admin account and six varied test inquiries (mixed locales, long names/emails/URLs, all four status values) were seeded via a throwaway script replicating the exact `scrypt` hashing scheme used by `scripts/create-admin.ts` (that script itself requires an interactive TTY for its password prompt, which isn't available in this environment — rather than bypass that deliberate safeguard, a separate non-interactive script was used against the separate disposable database only).

**Everything created this session was torn down before finishing:** the dev server was stopped and restarted without the database config, `.env.local` was deleted, the disposable Postgres container was stopped and removed, and the two throwaway Node scripts used to seed it were deleted from the project root. The environment is back to exactly the state Sessions 1–3 left it in — confirmed by re-checking `/admin/inquiries` renders the same "Admin setup required" message as before, and `git status` shows no new paths beyond what Sessions 1–3 already added.

## A significant finding: admin login is unreachable via `127.0.0.1`, only via `localhost`

While attempting to log in through the browser at `http://127.0.0.1:5175/admin/login` — the exact address this project's own `npm run dev` script binds to (`next dev --hostname 127.0.0.1 --port 5175`), and the address used throughout every manual check in Sessions 1–3 — login consistently failed with "Email or password is incorrect," even with verified-correct credentials (confirmed by independently replicating the app's own `verifyPassword` function against the stored hash outside the app: it returned `true`).

Network inspection showed the real status was `403 origin_rejected`, not `401`— `AdminLogin.tsx`'s error-message mapping doesn't have a case for 403, so it falls through to the generic "incorrect" message, which is itself a minor secondary UX finding worth noting (a 403 from a same-origin check looks identical to the user as wrong credentials).

**Root cause, isolated with a temporary debug log (added, used, and fully removed — confirmed via `git diff` showing zero residual change to `lib/server/security.ts`):** `requireSameOrigin()` in `lib/server/security.ts` compares the request's `Origin`/`Referer` header against `new URL(request.url).origin`. The browser correctly sends `Origin: http://127.0.0.1:5175`. But inside the Next.js (Turbopack) dev server, `request.url` for the same request reports `http://localhost:5175/api/admin/login` — a different hostname than the browser actually used. This is **not** this app's `proxy.ts` (checked directly: it returns `NextResponse.next()` immediately for any `/api/` path, before touching anything) — it appears to be Next.js/Turbopack's own dev-server request handling normalizing the reported URL hostname to `localhost` regardless of the `--hostname 127.0.0.1` the server was actually started with. The app's same-origin check is doing exactly what it should; the two sides of the comparison just disagree about what "same" means in this specific local dev configuration.

Confirmed this is purely a `127.0.0.1`-vs-`localhost` mismatch, not a credentials or database problem: the identical login attempt against `http://localhost:5175/admin/login` succeeded immediately and reached `/admin/inquiries`.

**This was not "fixed."** `requireSameOrigin` is a CSRF-relevant security control. Altering its logic carries real risk of weakening it, and that decision deserves explicit human review rather than a unilateral edit buried inside a responsive-engineering task — especially since the existing (pre-Session-4, already-uncommitted) code shows someone already began addressing a related angle of this (`x-forwarded-host`/`x-forwarded-proto`, gated behind `TRUSTED_CLIENT_IP_HEADER === "x-real-ip"`, presumably for the Caddy-fronted production/staging setup) without resolving the plain-`127.0.0.1`-dev-server case. **Practical, safe workaround documented here for future sessions: use `http://localhost:5175` instead of `http://127.0.0.1:5175` for any testing that needs to reach authenticated admin routes.** This has no bearing on the responsive CSS findings below, which were verified the same way regardless of hostname.

## Responsive verification results: all three Session 1 fixes confirmed correct against real data

Logged in via `http://localhost:5175/admin/inquiries` and tested at 375px, 768px, and 1440px with the seeded data (deliberately including a very long Arabic name/company, a long email address, and a long reference URL, specifically to stress-test the wrapping and containment fixed in Session 1):

- **No horizontal overflow at any of the three widths** (`scrollWidth === clientWidth` throughout).
- **The `.admin-shell` box-sizing fix holds**: search input and status `<select>` render correctly inset within their container at all three widths — this is the exact control that was previously overflowing by ~23px.
- **The `.admin-filters` grid fix holds**: search + status render as a clean two-column row at 768px and 1440px, and correctly stack to one column below 600px (the pre-existing breakpoint, unchanged).
- **Long content wraps correctly, never overflows**: the long Arabic name/company wrapped cleanly in the card list and detail view at every width; the long email address and the long reference URL both wrapped onto multiple lines in the detail view without creating horizontal scroll (`overflow-wrap: anywhere` on `.admin-detail dd`, confirmed working as designed).
- **Pagination buttons show correct disabled styling** at "Page 1 of 1."
- **Real interactions work end-to-end**: changed an inquiry's status via the `<select>` (PATCH request, 200 OK, list correctly refetched and metrics updated); typed into the search filter (list correctly narrowed to the matching inquiry, pagination count updated to match).

No new responsive defects found. Screenshots: `admin-inquiries-live-375.png`, `-375-detail.png`, `-375-notes.png`, `-768.png`, `-1440.png`, `-search-filtered.png`.

## Verification

- `npm run lint` — PASS
- `npm run typecheck` — PASS
- `npm test` — 17/17 PASS, unchanged
- Environment fully restored: no `.env.local`, no disposable container, no throwaway scripts, dev server back to its original no-database state, confirmed by re-navigating to `/admin/inquiries` and seeing the same "Admin setup required" message as before this session.

## Repository and infrastructure safety

No commits. No destructive git operations. No pre-existing uncommitted work touched or discarded — the only files modified were `lib/server/security.ts` (one temporary debug line, added and then fully removed — net zero diff beyond what was already there) during root-cause diagnosis. The pre-existing `rakmyat-phase43-staging-*` Docker stack was never started, stopped, or queried beyond an initial `docker ps` to discover it exists — no data in it was read, written, or touched. The disposable container and all seeded data existed only in a container this session created and destroyed itself.

## Updated status

Live-data admin verification — **the oldest open item from all three prior sessions — is now resolved.** The Session 1 CSS fixes are confirmed correct against real, varied, stress-test data at three viewports. See [14-remaining-limitations.md](14-remaining-limitations.md) for the updated gap list, and the new `127.0.0.1`-vs-`localhost` admin-login finding, now tracked there as a distinct, separate item from the responsive-engineering scope.
