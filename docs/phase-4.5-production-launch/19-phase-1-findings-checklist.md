# Phase 1 and 1.1 recovery checklist

This checklist records evidence gathered during the recovery on 2026-10-25. The original F-1 through F-16 finding descriptions were not present in the recovered repository or the execution prompt. Only the findings explicitly identified by number in that prompt are mapped below; the remaining numbers are deliberately left open rather than guessed.

## Finding status

| Finding | Status | Evidence and remaining boundary |
| --- | --- | --- |
| F-1 | Unmapped / open | Original finding text was not recoverable. Needs the source audit to map and verify. |
| F-2 | Unmapped / open | Original finding text was not recoverable. Needs the source audit to map and verify. |
| F-3 | Verified in disposable tests | Encrypted media backup and restore passed for populated media; empty-media restore passed; file/byte counts and checksums were checked. PostgreSQL 17 encrypted dump/restore and refusing a non-empty target passed. Production media was not read or modified. |
| F-4 | Unmapped / open | Original finding text was not recoverable. Needs the source audit to map and verify. |
| F-5 | Unmapped / open | Original finding text was not recoverable. Needs the source audit to map and verify. |
| F-6 | Unmapped / open | Original finding text was not recoverable. Needs the source audit to map and verify. |
| F-7 | Unmapped / open | Original finding text was not recoverable. Needs the source audit to map and verify. |
| F-8 | See final handover for current refs | `origin/main` was `5d9e837823dc63561b4ec11c57e15b83b876543d` when this checklist was started; local production checkout HEAD was `6ce64a7882a5ebbe849d23008cffdc8576c4f60d`. Current local and remote refs are reported separately in the handover because committing this checklist changes the local target SHA. Exact reported commit `9f24f04` was not recoverable. |
| F-9 | Unmapped / open | Original finding text was not recoverable. Needs the source audit to map and verify. |
| F-10 | Unmapped / open | Original finding text was not recoverable. Needs the source audit to map and verify. |
| F-11 | Unmapped / open | Original finding text was not recoverable. Needs the source audit to map and verify. |
| F-12 | Verified in disposable PostgreSQL 17 | A synthetic encrypted custom-format dump was restored into a pre-created empty PostgreSQL 17 database and the two expected rows were read back. The script refused a non-empty database and the production database name. No production database was used. |
| F-13 | Verified against the local HTTP route | Admin HTTP E2E accepted a 12 MiB MP4, checked its serving headers/body, and returned 413 for a 52 MiB chunked request. The Next proxy buffer is configured to 54 MiB so its default 10 MiB truncation does not preempt the route's 51 MiB limit. The VPS Nginx `/api/` path has not been exercised. |
| F-14 | Partial | The application media route returns one-year immutable cache headers and the admin media E2E checks them. The inspected VPS Nginx upload location serves media directly with a seven-day public cache. CDN/browser purge behavior is documented; no production cache configuration was changed. |
| F-15 | Unmapped / open | Original finding text was not recoverable. Needs the source audit to map and verify. |
| F-16 | Fixed by transaction boundary | Create and update read the resulting post inside the database transaction before commit; a missing readback throws and rolls back rather than returning 503 after a committed write. Normal create/update paths pass the disposable-database Playwright suite. No injected database readback failure was performed. |

## Phase 1 and 1.1 implementation evidence

- Development seed data is under `db/dev-seeds/`; production migration discovery only sees numbered files under `db/migrations/`. The Docker runtime copies migrations only.
- Migration `0006_blog_lifecycle.sql` adds soft-delete timestamps, post revisions, and hashed idempotency keys. Soft-deleted slugs remain reserved.
- Admin create supports idempotency replay and payload mismatch rejection. Admin update requires an `If-Match` revision; restore is explicit.
- Public blog queries exclude trashed posts. Post create, edit, trash, restore, idempotency replay, and media-library flows are covered by the disposable admin Playwright suite.
- Compose configuration validates for production with its host override and for Phase 4.3 staging using placeholder secret files. The production application image built successfully; production deployment was not performed.
- Production backup and restore scripts were exercised with a disposable GPG key, synthetic media, and PostgreSQL 17. They were not run against production paths, keys, containers, or data.
- Remaining release gates include a normal Git push, the original F-1/F-2/F-4 through F-7/F-9 through F-11/F-15 mapping, production upload-proxy verification, the VPS GPG key and off-host backup policy, and explicit production deployment authorization.
