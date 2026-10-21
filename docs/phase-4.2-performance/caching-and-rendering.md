# Caching and rendering

The application remains dynamically rendered so the response can set the correct localized document `lang` and `dir`. Existing `private, no-cache, no-store` HTML response headers remain unchanged. Baseline local TTFB was 8 to 43 ms, and the measured LCP delays came from client resources, not local server response time.

No production CDN, hosting platform, or deployment configuration is available. Static asset cache headers and public HTML cache policy require platform-specific verification. This local performance pass does not claim production caching is configured.
