# 07 — Client JavaScript and hydration

The user-facing shell still has interactive client components for navigation, contact form submission, portfolio/media interactions and page effects. Server-rendered copy and project details are HTML from the build; there is no need to hydrate every content section. No bundle analyzer or code-splitting measurement was configured as part of this phase, so this review makes no quantified JS-size claim.

Keep future client boundaries on interaction owners, avoid importing server-only modules into client components, and lazy-load below-the-fold lightbox/media code where it improves first-view work. Use Next build analyzer output or browser coverage before changing component boundaries. The existing visual and responsive evidence remains in Phase 4.4/4.6; this phase did not repeat pixel comparison.
