# Performance and image loading

The gallery uses Next.js `<Image>` with responsive `sizes`; content below the fold remains lazy-loaded. Small previews come from Next's responsive optimizer while the anchor still points to the unchanged original file. No gallery dependency was added and no gallery originals were preloaded.

A same-browser, fresh-page Schooly desktop sample loaded 12 image requests including related cards. Total transferred image response bytes changed from **55,716 B** on the existing 5211 baseline to **51,489 B** on the isolated 5213 after preview, a measured **7.6% reduction**. The preview selected 640 px optimized gallery sources for the 629 px frames; viewer links retain native originals. This is one representative route sample, not a whole-site aggregate.

The unique portfolio sources total 4.02 MB on disk, but those originals are not all sent on page load.
