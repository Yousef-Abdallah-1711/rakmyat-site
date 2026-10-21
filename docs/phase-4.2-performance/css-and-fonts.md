# CSS and font loading

## Changes

Converted the nine Inter weight files used by `inter.css` from TTF to WOFF2. CSS face declarations point to matching WOFF2 files; weights, glyph mapping, and horizontal metrics were checked. The nine TTF sources total 2,933,604 bytes; the WOFF2 outputs total 993,856 bytes, saving 1,939,748 bytes (66.1%). The `public/fonts` directory also contains the pre-existing Bootstrap Icons WOFF2, which is not part of this comparison. TTF originals are retained.

The Service Details-only `inner5_back.webp` background is preloaded from the localized route response. This makes a CSS background discoverable before the page stylesheet finishes parsing. No broad preload was added.

## Stylesheet scope

Legacy stylesheets and global CSS are still loaded to preserve route styling. Lighthouse reported unused CSS, but safe critical-CSS extraction or selector pruning needs a separate visual regression process across all routes and states. No visual rules were removed in this phase.
