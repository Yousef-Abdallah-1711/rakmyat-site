# Rakmyat visual restoration report

Date: 2026-10-19  
Branch: `phase-3/rakmyat-content-only`  
Restored source baseline: `5cb84e80f38fef7ca258c77fb92f6bff33128d7d` (completed Phase 3.6)  
Reference comparison: `4a1c946` (completed Phase 3.4 tree after documentation cleanup)

## Finding and cause

The working tree was interrupted during an uncommitted Phase 3.7 About-page pass. It changed `AboutSourceSections.tsx`, `page-copy.ts`, and `globals.css`, removed the unused-in-that-draft `TeamGrid.tsx`, and added a newly generated About hero illustration. These changes replaced the previous About page structure and were the only uncommitted application changes found. They were not committed.

Before restoring, the current commit and all uncommitted and untracked files were preserved on branch `emergency/phase-3-7-visual-restore-20261019` and in `stash@{0}` (`emergency backup before visual restoration 2026-10-19`). The generated image also remains in the Codex generated-images directory. The working tree was then returned to the completed Phase 3.6 commit; the backup can restore the interrupted work if requested.

The repository history contains no later broad visual redesign commit. Phase 3.5 (`1c19cef`) intentionally adjusted project screenshot framing and records before/after captures. Phase 3.6 (`5cb84e8`) intentionally replaced the eight capability icons and changed only their shared section and image shadow. Their reports and QA show the intended scoped changes. Both phases remain intact.

## Checkpoint note

The user-provided `pre-rakmyat-phase3-4` tag points to `138a9d7`, before the Phase 3.4 portfolio implementation. The actual Phase 3.4 completed tree is at `4a1c946` (also tagged `pre-rakmyat-phase3-5`). I used `4a1c946` for historical comparison and preserved later verified Phase 3.5 and 3.6 work. No reset or history rewrite was performed.

## Verification

- `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build`: passed.
- Production preview: <http://127.0.0.1:5197/en>. Port 5192 was already occupied, so the verified preview uses 5197.
- 12 localized routes × 2 viewport widths (1440 and 390): all 24 returned HTTP 200. Routes include Home, About, Services, Portfolio, Contact, and the Schooly project detail in English and Arabic.
- All captured pages had zero broken images, page errors, console errors, unexpected failed requests, and horizontal overflow (`scrollWidth` equals `clientWidth`). English documents use `lang=en`/LTR; Arabic documents use `lang=ar`/RTL.
- Portfolio filters displayed 9 projects, narrowed Education to 4, and restored all 9 with All. Schooly project links were present.
- Language switch navigated from `/en/about` to `/ar/about` with Arabic RTL document state.
- Mobile menu opened and exposed its expanded state. Schooly image lightbox opened and closed with Escape.
- Contact remains the pre-existing demo form; no delivery backend was present or changed.

Route-level measurements and screenshot filenames are in [route-qa.json](./route-qa.json); interaction checks are in [interaction-qa.json](./interaction-qa.json).

## Screenshot evidence

The four pre-change About screenshots are in [`screenshots/before/`](./screenshots/before/). Current post-restoration captures for every tested route and viewport are in [`screenshots/`](./screenshots/). The Phase 3.4–3.6 visual comparisons remain in their original report folders and were not modified.

## Git

This restoration changes no application code: it returns the worktree to the verified Phase 3.6 implementation. The focused commit records the restoration decision and fresh verification evidence only.
