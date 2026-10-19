# Phase 3.8 — Contact, navigation, and inquiry administration

Status: implementation is local and requires environment setup before contact persistence, notification delivery, or admin use is operational. No deployment has occurred.

## Reports

- [Implementation and database model](./implementation.md)
- [SMTP and admin setup](./operations.md)
- [Security and privacy](./security.md)
- [Navigation and CTA audit](./navigation-cta-audit.md)
- [Performance and loader changes](./performance.md)
- [QA results and remaining gates](./qa-results.md)
- [Outstanding production requirements](./outstanding-requirements.md)
- [`screenshots/before/`](./screenshots/before/) and [`screenshots/after/`](./screenshots/after/): 60 baseline and 84 final images. The final set covers the 10 public page/locale pairs plus Service Details and both admin pages at six viewports. [Manifest with file sizes and SHA-256](./screenshots/captures.json).
- [Route and interaction check results](./route-checks.json).

## Local commands

```powershell
cd next-app
npm.cmd run dev
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

See the operations report before configuring a database or provisioning an admin. Secrets belong in the deployment platform secret store, never in Git.
