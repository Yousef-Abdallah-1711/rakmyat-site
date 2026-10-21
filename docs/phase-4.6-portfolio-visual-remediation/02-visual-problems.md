# Visual problems and root causes

## Confirmed root causes

1. Nine desktop full-page captures (2,964x12,106 px tall) and one very long mobile capture (13,474 px tall) were fitted into short fixed-ratio preview frames. The current page CSS used `object-fit: contain`; the result was a narrow, unreadable strip with large blank margins.
2. Gallery cards used one landscape ratio regardless of source, so a standard 1.19:1 Schooly comparison image and wide hero screens were both placed into the same ratio.
3. Mobile gallery figures were forced to span two grid rows, introducing large gaps and uneven alignment.
4. The existing viewer opened the original image but constrained it to the viewport height without zoom or scrolling, so very tall sources could not be explored comfortably. It also did not lock background scrolling.
5. Most project pages have genuine screenshot assets; Concord CRM and Product Scraper have conceptual illustrations only. Their current labels correctly identify these as concepts, so no fake screenshot was added.

## Evidence

The defects are visible in the [Schooly before screenshot](before/rendered/schooly-en-1440.jpg), [English gallery comparison](gallery-before-after-en.jpg), and the original source contact sheets. The underlying source files are intact. The 10 tall captures now use deliberate top-fold previews, with originals available in the viewer.
