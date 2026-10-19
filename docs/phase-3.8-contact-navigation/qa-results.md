# QA results

## Build and code checks

- `npm.cmd run typecheck` — passed.
- `npm.cmd run lint` — passed.
- `npm.cmd test` — passed, 4 schema and stable-option-key tests.
- `npm.cmd run build` — passed on Next.js 16.4.2. New Contact, admin, and API routes compile as dynamic App Router handlers/pages.

## Browser and viewport matrix

- Final production build served locally at `http://127.0.0.1:5198`.
- 14 route/locale variants × six widths (1440, 1280, 1024, 768, 390, 360) = 84 captures. Public coverage includes Home, About, Services, Service Details, Work, and Contact in English and Arabic, plus Admin sign-in and Inquiries.
- All 84 requests returned HTTP 200. No page errors, no document horizontal overflow, and no rendered preloader. English pages had `dir=ltr`; Arabic pages had `dir=rtl`.
- 60 before captures cover the ten requested public route/locale pairs × six widths. All are preserved beside the final images. See [`screenshots/captures.json`](./screenshots/captures.json) for each file’s size and SHA-256; total image evidence is approximately 33.4 MB.
- Visual review performed on the final English Contact desktop capture and Arabic Contact mobile capture; other routes received route/direction/overflow checks and screenshot captures, not detailed side-by-side pixel-difference review.

## Interaction and API checks

- Contact submission: blank form focused Full Name and displayed two required field errors; after entering valid required values, a database-unavailable response kept values in place and showed an error. No success state was shown.
- Locale link retained the Contact route and query string; project locale switching retained `/projects/schooly` and its query string.
- Mobile nav opened, Escape closed it, and focus returned to its trigger.
- Admin page displayed its setup gate with no database; the login screen states there is no default account. Unauthenticated admin inquiry API request returned 401.
- Contact API returned 413 for an oversized body, 415 for wrong content type, 422 for invalid fields, and 503 for a valid request because `DATABASE_URL` and `RATE_LIMIT_SECRET` are absent.
- Browser page-error count in the final route matrix: zero. The expected 503 network responses during the form/API fail-closed checks were observed.

## Not verified

No database credentials or SMTP credentials are configured, so actual database persistence, migration execution, admin login/session creation, outbox retries, and inbox delivery were not exercised. Manual screen-reader/keyboard audit beyond the navigation/form checks, full contrast and reflow audit, and WCAG 2.2 AA certification remain outstanding. This is not a production release approval.
