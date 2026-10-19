# Performance and loading behavior

- Removed the shared full-screen preloader and its per-navigation 350 ms JavaScript timer. It was the source of the visible global page transition delay; content now paints as soon as the route is ready.
- Kept existing intersection-based section reveals, scroll navigation state, counters, and reduced-motion handling. The preloader’s old CSS remains dormant in the retained theme stylesheet; no element with `id=preloader` is rendered.
- Admin queries are capped at 100 rows and responses are private/no-store. Inquiry search and summary metrics are fetched only after server-side session authorization.
- No skeletons were added. No performance claim is based on synthetic LCP/INP/CLS measurements in this phase.
- Current DB and SMTP operations were not load-tested because the required production services are not configured.
