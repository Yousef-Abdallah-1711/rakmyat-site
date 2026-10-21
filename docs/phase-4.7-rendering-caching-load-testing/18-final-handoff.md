# 18 — Final handoff

## What changed

- Localized public EN/AR pages now generate static HTML for the 32 supported page/project routes.
- The default root and unprefixed aliases resolve to Arabic; `/en` remains available, with Arabic as the `x-default` language target.
- Rendering roots are split between URL-preserving aliases, locale pages and admin pages; the public tree no longer depends on request headers.
- Unknown localized paths are excluded from static parameter generation.
- Public source assets have bounded browser cache headers; optimized image derivatives use a one-day minimum cache lifetime.
- Production builds carry an explicit deployment identifier; production preflight rejects a missing placeholder ID.
- This folder records route policy, cache/CDN plan, database checks, contact/admin privacy and bounded load-test evidence.
- A recovery checkpoint for the pre-existing working tree is stored outside the repository at `C:\Users\yosea\Desktop\AI SASSSS\phase-4.7-checkpoint-20261020b` (tracked patch, untracked-file archive, and manifest).

## What to verify before production

- Formal capacity verdict: **NOT VERIFIED**. The 500-VU local public page/asset run passed, but the complete journey mix and required cache/spike/recovery stages remain outstanding.
- The full run was not repeated in this follow-up: the shared host was already running several development stacks, host CPU samples were 28–39%, and the existing Rakmyat staging web container was at about 985 MiB of its 1 GiB memory limit. See [11-load-test-plan.md](11-load-test-plan.md). No existing staging endpoint, container, database, or volume was used or modified for this follow-up.

- Choose the public hostname and CDN. Confirm edge cache key and purge behavior, Next `Vary` headers, `_rsc` and `dpl` query handling, and that admin/API/POST responses bypass shared cache.
- Build the exact release image with approved host, indexing and unique deployment ID; run the production preflight.
- Load-test the full candidate behind Caddy and the chosen edge in an isolated representative environment. Reconcile the measured result with [12-load-test-results.md](12-load-test-results.md); do not convert VU count into a user capacity promise.
- Set PostgreSQL connection limits and resource budgets using expected web replicas plus workers and operational reserve.
- Test outbox retries/deduplication with a safe SMTP sink and monitor queue age.
- Check the final site's canonical URLs and robots response after the owner has approved the hostname and indexing policy.

No production deployment, CDN mutation, SMTP delivery, external load test, or change to existing staging data was performed.
