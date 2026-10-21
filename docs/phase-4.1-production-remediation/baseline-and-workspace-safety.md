# Baseline and workspace safety

The audit target was `next-app/`, branch `phase-3/rakmyat-content-only`, baseline commit `512c18c305620891dd2ebc4bf99f288a9c2f51d9`. The pre-existing working tree contained uncommitted Phase 4/how-we-work and hero restoration changes. These were retained.

Before Phase 4.1 edits, a source snapshot and tracked diff patch were written outside the repository at `C:\Users\yosea\Desktop\Rakmyat-Production-Audit-2026-10-19\phase-4.1-baseline-source` and `phase-4.1-preexisting-worktree.patch`. The remediation build ran from the sibling `phase-4.1-build-copy` with its own dependencies; source `.next` and `node_modules` were not used as the build destination. Package manifests were not changed. The root Vite project and BDA source project were not edited.

The changed-file set contains prior user work as well as the remediation. There is no commit so those unrelated, already-uncommitted changes are not accidentally bundled. There was no deployment, migration against a real database, email send, or real contact submission.
