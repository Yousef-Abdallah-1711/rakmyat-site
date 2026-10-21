# Gallery presentation system

Shared project components now use explicit per-image `width`, `height`, and `presentation` metadata. This preserves intrinsic layout, gives Next.js the rendered frame sizes, and avoids filename/order-based CSS exceptions.

| Mode | Source | Page preview | Viewer |
|---|---|---|---|
| `landscape` | Standard landscape or compact detail | Frame uses the source aspect ratio; content remains uncropped | Original source |
| `tall-preview` | Full-page desktop capture | Fixed landscape browser window, top-aligned intentional crop | Complete original, scrollable and zoomable |
| `mobile` | Phone screenshot or long mobile page | Portrait phone frame and top-fold preview | Complete original, scrollable and zoomable |

Gallery cards align to the top with consistent column and row gaps; captions use localized source alt text. Original screenshots remain byte-for-byte unchanged. The full-size viewer is local code with no new gallery dependency; it supports zoom levels through 300%, scrolling/panning, touch swipe, previous/next, Escape, focus trapping/return, and body-scroll locking. Buttons meet the 44 px target.
