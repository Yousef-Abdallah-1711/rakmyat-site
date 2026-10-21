# LCP investigation

Baseline LCP varied by page. The four saved mobile traces show two actionable resource-priority problems:

- On `/en/services/details` and `/ar/services/details`, the LCP is the `.inner-header` CSS background `/assets/img/inner5_back.png`. The browser discovers it after CSS parsing, roughly 2.9 seconds after navigation; it then takes about 8.0 to 8.4 seconds to finish in the captured single runs. The image was converted losslessly to WebP and preloaded only on Service Details.
- On `/ar/portfolio`, the first visible Schooly card cover was the LCP element but had `loading="lazy"`. It started at about 6.6 seconds and completed at about 7.8 seconds. The first visible grid card now uses eager loading and high fetch priority; cards after the first remain lazy.
- About's hero illustration was low priority in the baseline. Its existing `<img>` now has high fetch priority.

The Home LCP was a text heading, so image work alone cannot solve every route. Lighthouse changes remain lab measurements. See the raw baseline reports and traces in `reports/`.
