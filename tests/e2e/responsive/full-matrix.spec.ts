import { expect, test } from "@playwright/test";
import {
  OVERFLOW_TOLERANCE_PX,
  contentRoutes,
  fullViewportMatrix,
  horizontalOverflowPx,
  localizedUrl,
  locales,
  portfolioSlugs,
  scrollThroughPage,
} from "./helpers";

/**
 * Session 3: the brief's full 15-viewport matrix, run on EVERY public content
 * route and EVERY portfolio detail route, in both locales — not just home
 * (overflow.spec.ts) or a 5-point subset. This is Chromium-only by design: the
 * brief's own coverage strategy (section 7) asks for the full matrix on the
 * primary browser and representative checks across all three engines —
 * overflow.spec.ts's existing cross-browser tests already cover the
 * representative side. Running this file's ~30 tests × 15 viewports × 3
 * browsers would be ~90 minutes of redundant coverage for no proportional
 * evidence gain; skipping non-Chromium here (visibly, not silently — these
 * show as "skipped" in the report, never silently omitted from the route list)
 * is the documented tradeoff.
 */
// eslint-disable-next-line no-empty-pattern -- Playwright requires this literal destructuring shape to detect fixtures
test.beforeEach(async ({}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Full 15-viewport sweep runs on the primary browser only — see file header comment.");
});

async function sweepFullMatrix(page: import("@playwright/test").Page, url: string, label: string) {
  test.setTimeout(150_000);
  const failures: string[] = [];
  for (const viewport of fullViewportMatrix) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(url);
    await scrollThroughPage(page);
    const overflow = await horizontalOverflowPx(page);
    if (overflow > OVERFLOW_TOLERANCE_PX) failures.push(`${viewport.label}: ${overflow}px`);
  }
  expect(failures, `${label} overflowed at: ${failures.join(", ")}`).toHaveLength(0);
}

test.describe("full 15-viewport matrix — all content routes", () => {
  for (const locale of locales) {
    for (const route of contentRoutes) {
      test(`${route.name} (${locale}): no horizontal overflow across all 15 brief viewports`, async ({ page }) => {
        await sweepFullMatrix(page, localizedUrl(locale, route.path), `${route.name} (${locale})`);
      });
    }
  }
});

test.describe("full 15-viewport matrix — all 9 portfolio detail routes", () => {
  for (const locale of locales) {
    for (const slug of portfolioSlugs) {
      test(`projects/${slug} (${locale}): no horizontal overflow across all 15 brief viewports`, async ({ page }) => {
        await sweepFullMatrix(page, `/${locale}/projects/${slug}`, `projects/${slug} (${locale})`);
      });
    }
  }
});
