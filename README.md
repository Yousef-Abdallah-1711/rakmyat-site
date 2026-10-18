# Iteck Next.js Migration

The App Router implementation of the seven Iteck SaaS technology pages is isolated from the original Vite project in the workspace root.

## Routes

- `/` (legacy alias: `/home-saas-technology.html`)
- `/about` (`/page-about-5.html`)
- `/contact` (`/page-contact-5.html`)
- `/portfolio` (`/page-portfolio-5.html`)
- `/services` (`/page-services-5.html`)
- `/services/details` (`/page-services-details-5.html`)
- `/projects/notero` (`/page-single-project-5.html`)

## Development

Use Node.js and npm, then run these commands from this directory:

```powershell
npm.cmd ci
npm.cmd run dev
```

The development server listens on `http://127.0.0.1:5175`.

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
npm.cmd run start
```

## Notes

- The original browser-delivered CSS, images, and fonts are kept at their original local URL paths. Only Swiper 5 is executed from the original JavaScript set; other unused copied scripts are reversibly quarantined outside this app under `specs/iteck-saas-clone/nextjs-migration/asset-quarantine/legacy-js/`.
- Pricing, testimonial, logo and most page prose have not yet been extracted into typed content models. See the migration reports under `specs/iteck-saas-clone/nextjs-migration/`.
- The contact form has no backend. Maps and the optional YouTube lightbox use external services. Confirm asset licenses before public redistribution.
