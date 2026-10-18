# Architecture

## Runtime and routing

The app uses Next.js App Router with React and strict TypeScript. Page entry points live in `app/`; each route renders page-specific section components while sharing the global layout and interaction components. The seven primary routes and their legacy URL aliases are listed in the project [README](../README.md).

The root layout and global stylesheet are in `app/layout.tsx` and `app/globals.css`. The existing theme and vendor CSS are kept to preserve the original cascade and appearance. The Next app serves its own `public/` directory; it does not read files from the sibling Vite project at runtime.

## Source organization

| Directory | Responsibility |
|---|---|
| `app/` | App Router layouts, route entries, and not-found page |
| `components/layout/` | Shared site chrome, header, layout effects, scroll-to-top |
| `components/sections/` | Route sections and reusable content sections |
| `components/forms/`, `components/pricing/` | Contact form and pricing interactions |
| `content/` | Typed page, site, service, project, pricing, team, and repeated-content records |
| `lib/` | Shared runtime helpers |
| `public/` | Local CSS, fonts, images, and the active Swiper script |
| `scripts/`, `tests/` | Maintenance/QA scripts and test material |

Most pages preserve the source DOM structure and classes through JSX components. Shared page chrome and repeated sections are React components. Client behavior is scoped to client components where browser state or browser APIs are needed; page structure and most content remain server rendered by App Router.

## Content and editing boundaries

Typed records under `content/` cover global settings, headings and copy, services, portfolio/projects, pricing, testimonials, clients, features, reasons, and team content. Some small labels and section prose remain inline in route section components. This is a code-owned content model, not a CMS or editor interface; see [Known Issues](KNOWN-ISSUES.md).

## Legacy runtime and assets

Bootstrap CSS, theme CSS, local fonts/icons, Animate.css, and Swiper styles are retained for fidelity. Swiper 5 is initialized from a scoped client component. Legacy jQuery-based theme scripts and plugins are not executed. Unused script payloads remain in a reversible quarantine outside this app. Google Maps and the optional YouTube lightbox are external runtime destinations.

## Verification and evidence

The final Phase 2 evidence is in [`specs/iteck-saas-clone/nextjs-migration/phase-2/`](../../specs/iteck-saas-clone/nextjs-migration/phase-2/), including `final-qa.json`, the 28-capture manifest/metrics, route matrix, accessibility checks, CSS coverage, and network audit. The complete workspace cleanup is recorded in [`specs/iteck-saas-clone/cleanup-report.md`](../../specs/iteck-saas-clone/cleanup-report.md).
