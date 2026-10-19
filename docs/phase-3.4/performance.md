# Phase 3.4 Performance Notes

- The existing 32 original portfolio screenshots total 3,948,052 bytes and remain unchanged.
- The two generated conceptual WebP visuals total 72,566 bytes. Their individual hashes and labels are in the [asset manifest](./asset-manifest.json).
- Portfolio screenshots use Next.js responsive image optimization and `object-fit: contain`; all card images remain lazy by default. The project-detail hero is prioritized. No screenshot gallery was rasterized into additional frame assets.
- In Chromium at 1440px, after deliberately forcing all below-the-fold images to load for measurement, Home and Work each requested 16 optimized image variants totaling 218,220 transferred bytes. This is a full-page image load, not the initial viewport payload.
- Total transferred resources after all images were forced: Home 3,175,223–3,175,369 bytes; Work 1,525,945–1,526,257 bytes. These numbers include the existing theme CSS, JavaScript, fonts, and page resources. They are local lab observations, not field performance or LCP data.
- Runtime layout reserves image frames using aspect ratios and fixed phone-frame dimensions to avoid layout shifts. Only the detail hero is eagerly prioritized; the home and portfolio grid images remain lazy.

No field LCP/CLS/INP measurement was made in this phase.
