# 01 — Current rendering audit

## Baseline and source findings

The Phase 4.6 build served localized pages dynamically because the shared root layout read request headers to choose `lang`/`dir`. The localized catch-all also declared `force-dynamic`. This unnecessarily coupled public HTML to request-time rendering. The portfolio is file-backed in `content/portfolio.ts`; the 9 published project records and other public copy do not require a request-time database call.

The app does have real dynamic workloads: contact submission, authenticated admin screens and APIs, health, internal outbox processing, and runtime robots/sitemap metadata. These must stay request-time and must not be placed in a shared cache. Legacy URL aliases are kept outside the localized tree; `/projects/[slug]` is still a dynamic legacy handler and is not part of the 32-route public locale set.

## Implemented state

Next.js 16.4.2 production build output classifies `/[locale]/[[...path]]` as SSG (32 concrete paths), URL-preserving aliases as static where applicable, and admin/API/health/robots/sitemap handlers as dynamic. A fresh build completed the TypeScript phase and generated 40 static outputs overall. The root not-found output is static; locale not-found is static bilingual content.

The public page data remains in the build artifact. No PostgreSQL reads are needed to render public EN/AR pages. Dynamic routes continue to use private/no-store response policies where they return user-specific or operational data.

## Evidence files

- Fresh production build output: Next 16.4.2, 40 static outputs; see [15-regression-tests.md](15-regression-tests.md).
- Runtime headers: `/en` returns `x-nextjs-cache: HIT`, `x-nextjs-prerender: 1`, `Cache-Control: s-maxage=31536000`; `/admin/login` returns `private, no-cache, no-store`.
- The complete route set is listed in [02-route-rendering-matrix.md](02-route-rendering-matrix.md).
