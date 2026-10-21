# 03 — Static generation and ISR

The shared request-header dependency was removed from the public root. The localized layout is now the document root for `/[locale]`, derives `lang` and `dir` from the statically known route segment, and enumerates the supported locales. Public page parameters are generated from the copy route list and the published portfolio list. `dynamicParams=false` makes the build-time route inventory explicit.

The root URL aliases have their own route-group root layout and preserve their old URL paths. Admin has a separate layout with no-index metadata. Locale 404 content no longer calls `headers()`, which was the remaining source of dynamic rendering for every public locale page.

## ISR decision

ISR is not enabled. Current public content is committed file data and changes ship with a build. A one-year Next prerender `s-maxage` is safe only when the deployed artifact is treated as immutable and each release replaces the previous generated HTML. If content later moves to a CMS or database, select one model before implementation: bounded `revalidate` duration, tag/path invalidation with a durable shared cache, or full build-time regeneration. Do not add ISR without a cache-coordination and invalidation policy for multiple replicas.

The route build completed with 32 locale SSG paths and no dynamic rendering for them. Admin/API routes remain dynamic. Dynamic sitemap/robots keep the runtime indexing gate, while static canonicals and metadata use build-time `NEXT_PUBLIC_SITE_URL`; the build and runtime values must be the same release configuration.
