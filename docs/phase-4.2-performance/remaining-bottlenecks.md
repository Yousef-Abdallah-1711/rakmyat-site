# Remaining performance bottlenecks

- Mobile median FCP moved slightly later (3.53 to 3.58 s) and TBT was nearly flat (168 to 175 ms). The performance work reduced transfer and median LCP but did not remove client/main-thread costs.
- English Services had a single after-run CLS of 0.1024, caused mostly by Inter 700 loading after first paint. Arabic Services and most routes were near zero. A critical font preload reduced CLS to about 0.00175 in three repeats, but those repeats had LCP around 4.1 s versus about 3.4 s on the paired after sample, so the preload was not retained. The four raw preload experiments are in [`reports/experiments/font-preload/`](./reports/experiments/font-preload/).
- Home and How We Work retain mobile LCP near 3.7 to 4.2 s in the one-run comparison. Home's LCP is text, not one of the converted illustrations.
- Lighthouse still identifies unused CSS and JavaScript. Legacy global styles were retained to avoid breaking route appearance or states.
- HTML cache remains private/no-store, and there is no CDN or field performance data.
- All measurements are Lighthouse lab data from localhost, not CrUX, RUM, or production device results.

These remaining items need real-user monitoring and browser testing on the eventual deployment platform before making a production readiness claim.
