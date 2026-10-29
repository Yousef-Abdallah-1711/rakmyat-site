import { expect, test } from "@playwright/test";
import {
  OVERFLOW_TOLERANCE_PX,
  contentRoutes,
  coreViewports,
  fullViewportMatrix,
  horizontalOverflowPx,
  localizedUrl,
  locales,
  scrollThroughPage,
} from "./helpers";

// Home gets the full 15-viewport brief matrix in both locales — it's the one
// route every visitor hits and carries the heaviest decorative/hero content.
test.describe("overflow — home, full 15-viewport matrix", () => {
  for (const locale of locales) {
    test(`home (${locale}) has no horizontal overflow across the full viewport matrix`, async ({ page }) => {
      // 15 full navigations + scroll-throughs genuinely take longer than the
      // suite's default 30s budget; this isn't a hung page, it's 15 real page loads.
      test.setTimeout(120_000);
      const failures: string[] = [];
      for (const viewport of fullViewportMatrix) {
         
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
         
        await page.goto(localizedUrl(locale, ""));
         
        await scrollThroughPage(page);
         
        const overflow = await horizontalOverflowPx(page);
        if (overflow > OVERFLOW_TOLERANCE_PX) failures.push(`${viewport.label}: ${overflow}px`);
      }
      expect(failures, `home (${locale}) overflowed at: ${failures.join(", ")}`).toHaveLength(0);
    });
  }
});

// Remaining content routes get the 5-point representative matrix (narrowest
// mobile, common mobile, tablet portrait, tablet landscape, desktop) in both
// locales — documented tradeoff in 16-responsive-regression-suite.md.
test.describe("overflow — content routes, core viewport subset", () => {
  for (const locale of locales) {
    for (const route of contentRoutes.filter((r) => r.name !== "home")) {
      test(`${route.name} (${locale}) has no horizontal overflow across core viewports`, async ({ page }) => {
        // Five independent navigations plus scroll-through checks can exceed
        // the short default used by single-page interaction tests on WebKit CI.
        test.setTimeout(90_000);
        const failures: string[] = [];
        for (const viewport of coreViewports) {
           
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
           
          await page.goto(localizedUrl(locale, route.path));
           
          await scrollThroughPage(page);
           
          const overflow = await horizontalOverflowPx(page);
          if (overflow > OVERFLOW_TOLERANCE_PX) failures.push(`${viewport.label}: ${overflow}px`);
        }
        expect(failures, `${route.name} (${locale}) overflowed at: ${failures.join(", ")}`).toHaveLength(0);
      });
    }
  }
});
