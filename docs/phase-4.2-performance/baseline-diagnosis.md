# Baseline diagnosis

## Method

The baseline came from an isolated production build at `127.0.0.1:5214`, measured with Lighthouse CLI 13.5.0 and Chromium. It covers Home, About, Services, Service Details, How We Work, Portfolio, Nora Store project detail, and Contact, in English and Arabic, on mobile and desktop: 32 reports total. Mobile used a 412 x 823 CSS-pixel viewport, device scale factor 1.75, 4x CPU slowdown, 150 ms RTT, and 1.6 Mbps download. Desktop used a 1350 x 940 viewport and Lighthouse desktop throttling. There is one sample per route, locale, and device; cross-route medians are descriptive lab summaries, not stable field estimates.

Raw reports are in [`reports/baseline/`](./reports/baseline/). Four representative trace JSON files and DevTools logs are gzip-compressed in [`reports/traces/`](./reports/traces/) with a manifest. The traces cover English Home, English and Arabic Service Details, and Arabic Portfolio.

## Measured results

| Page | Mobile LCP EN / AR | Desktop LCP EN / AR | Mobile transfer EN / AR |
|---|---:|---:|---:|
| Home | 3.76 / 3.73 s | 2.16 / 2.16 s | 2,936 / 2,937 KiB |
| About | 4.17 / 4.15 s | 1.83 / 1.93 s | 2,244 / 2,243 KiB |
| Services | 3.32 / 3.56 s | 1.95 / 1.88 s | 2,625 / 2,626 KiB |
| Service Details | 10.92 / 11.36 s | 1.88 / 1.90 s | 3,067 / 3,068 KiB |
| How We Work | 4.09 / 4.29 s | 1.55 / 1.53 s | 1,231 / 1,232 KiB |
| Portfolio | 5.44 / 7.82 s | 1.67 / 1.67 s | 1,360 / 1,361 KiB |
| Nora Store detail | 3.65 / 3.87 s | 1.58 / 1.61 s | 1,331 / 1,333 KiB |
| Contact | 3.36 / 3.50 s | 1.33 / 1.33 s | 1,054 / 1,055 KiB |

Across the 16 mobile reports, median performance score was 75, LCP 3.98 s, FCP 3.53 s, TBT 168 ms, and transfer size 1,802 KiB. Across desktop reports, medians were 90, 1.75 s, 1.18 s, 0 ms, and 1,812 KiB. Median CLS was below 0.001 for both profiles; one Services mobile sample measured 0.103 and is a high single-run outlier that should be repeated.

## Bottlenecks confirmed by reports and source inspection

- Images and fonts dominate transfer. Home mobile transfers about 1.56 MiB of images and 912 KiB of fonts; Service Details transfers about 1.73 MiB of images and 892 KiB of fonts.
- Service Details requested a 1.25 MB `mob1.png`. Several shared illustrations were 100 to 305 KB PNGs. Nine Inter weights were about 325 KB each as TTF, though each route loads only the weights it needs.
- Mobile Service Details had the clearest LCP regression. The trace identifies `/assets/img/inner5_back.png`, the CSS background on `.inner-header`: the browser discovers it after CSS parsing, about 2.9 seconds after navigation, and it takes 8.0 to 8.4 seconds to load in these captured runs. Local TTFB was about 8 to 43 ms.
- The Arabic Portfolio trace identifies the first visible Schooly card cover as the LCP element. It was marked `loading="lazy"`, started at about 6.6 seconds, and completed at about 7.8 seconds.
- Lighthouse estimated about 153 KiB unused JavaScript on Home, including Swiper, which is needed only by Home's current client carousel.
- Global stylesheets accounted for about 156 KiB transfer per route. Home estimated about 123 KiB unused CSS. Blind pruning could break route appearance or interaction states, so styles were retained.
- HTML responses use `private, no-cache, no-store`. The app uses request headers for correctly localized server-rendered `lang` and `dir`; rendering mode and cache behavior remain unchanged.

## Limits

These are throttled localhost lab runs, not real-user Core Web Vitals. Lighthouse scores and Total Blocking Time vary between runs. Field LCP/INP/CLS data, a production CDN, and deployment configuration are unavailable. The performance work must preserve the design, copy, locale behavior, project media, menus, forms, and galleries.
