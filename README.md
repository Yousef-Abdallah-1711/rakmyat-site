# Iteck Next.js App

The App Router implementation of the seven Iteck SaaS Technology demo pages. It is isolated from the original Vite baseline in the workspace root.

## Routes

| Next.js route | Legacy URL |
|---|---|
| `/` | `/home-saas-technology.html` |
| `/about` | `/page-about-5.html` |
| `/contact` | `/page-contact-5.html` |
| `/portfolio` | `/page-portfolio-5.html` |
| `/services` | `/page-services-5.html` |
| `/services/details` | `/page-services-details-5.html` |
| `/projects/notero` | `/page-single-project-5.html` |

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
- Workspace audit and regression evidence: `../specs/iteck-saas-clone/`

## Implementation notes

Original browser-delivered CSS, images, and fonts retain their local URL paths. Swiper 5 is the only legacy JavaScript runtime used by this app; other unused copied scripts are reversibly quarantined outside the app under `specs/iteck-saas-clone/nextjs-migration/asset-quarantine/legacy-js/`. The contact form is frontend-only. External Maps and the optional YouTube lightbox need network access. Review the documentation above and licensing notes before production use.
