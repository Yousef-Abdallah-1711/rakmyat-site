# Rakmyat Website

The bilingual Rakmyat website uses the preserved Iteck design, implemented with Next.js App Router, React, and TypeScript. It is isolated from the original Vite clone in the workspace root.

## Main routes

English and Arabic routes are rooted at `/en` and `/ar`; each locale contains home, about, services, service details, portfolio, and contact pages. The nine portfolio detail routes use `/[locale]/projects/[slug]`.

Legacy HTML aliases redirect to the matching English pages. The retired Notero page remains unpublished and returns 404.

## Development

Use Node.js and npm, then run these commands from `next-app/`:

```powershell
npm.cmd ci
npm.cmd run dev
```

The development server listens at `http://127.0.0.1:5175/`.

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
npm.cmd run start
```

## Documentation

- [Architecture and folder organization](docs/ARCHITECTURE.md)
- [Migration history and validation](docs/MIGRATION-SUMMARY.md)
- [Known issues and production decisions](docs/KNOWN-ISSUES.md)
- [Phase 3.2 portfolio and visual QA evidence](docs/phase-3.2/README.md)
- Workspace audit and regression evidence: `../specs/iteck-saas-clone/`

## Implementation notes

Original browser-delivered CSS, images, and fonts retain their local URL paths. Swiper 5 is the only legacy JavaScript runtime used by this app; other unused copied scripts are reversibly quarantined outside the app under `specs/iteck-saas-clone/nextjs-migration/asset-quarantine/legacy-js/`. The contact form is frontend-only. External Maps and the optional YouTube lightbox need network access. Review the documentation above and licensing notes before production use.
