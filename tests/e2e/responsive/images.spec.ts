import { expect, test } from "@playwright/test";
import { localizedUrl, scrollThroughPage, waitForImagesToSettle } from "./helpers";

/**
 * Validates that every visible <img> on a route actually finishes loading (not
 * just requested) after the lazy-load-safe scroll-through — catches broken src
 * and failed requests, while giving genuinely in-flight images (next/image's
 * dev-mode on-demand transform can be slow for large requested widths) up to
 * 15s to settle before treating them as broken. This also guards against the
 * lazy-load timing false-positive documented in session 1
 * (docs/phase-5.1-responsive-engineering/11-test-coverage-and-verification.md).
 */
async function assertAllVisibleImagesLoaded(page: import("@playwright/test").Page, label: string) {
  await scrollThroughPage(page);
  await waitForImagesToSettle(page).catch(() => {
    // Let the explicit assertion below report which ones, with their src, rather
    // than surfacing a bare waitForFunction timeout.
  });
  const broken = await page.evaluate(() => {
    const images = [...document.querySelectorAll("img")];
    return images
      .filter((img) => {
        const rect = img.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0; // only images actually rendered somewhere in the doc
      })
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.getAttribute("src") || img.getAttribute("srcset") || "(no src)");
  });
  expect(broken, `${label}: images that failed to load after scroll-through: ${broken.join(", ")}`).toHaveLength(0);
}

test.describe("image loading — representative routes", () => {
  test("home (ar) — all rendered images load after scroll-through", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(localizedUrl("ar", ""));
    await assertAllVisibleImagesLoaded(page, "home (ar)");
  });

  test("portfolio listing (en) — all 9 project card images load after scroll-through", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(localizedUrl("en", "portfolio"));
    await assertAllVisibleImagesLoaded(page, "portfolio listing (en)");
    const cards = page.locator(".project-showcase-card");
    await expect(cards).toHaveCount(9);
  });

  test("portfolio detail with gallery (ar, nora-store) — all images including gallery load after scroll-through", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/ar/projects/nora-store");
    await assertAllVisibleImagesLoaded(page, "nora-store (ar)");
  });

  test("services-details (ar, 1440px) — rocket decoration does not overlap heading text (regression guard for session-1 fix)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/ar/services/details", { waitUntil: "domcontentloaded" });
    const heading = page.locator(".inner-header h2");
    const rocket = page.locator(".inner-header .side-img");
    await expect(heading).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const headingBox = await heading.boundingBox();
    const rocketBox = await rocket.boundingBox();
    expect(headingBox && rocketBox).toBeTruthy();
    if (headingBox && rocketBox) {
      const overlapsHorizontally = rocketBox.x < headingBox.x + headingBox.width && rocketBox.x + rocketBox.width > headingBox.x;
      const overlapsVertically = rocketBox.y < headingBox.y + headingBox.height && rocketBox.y + rocketBox.height > headingBox.y;
      expect(overlapsHorizontally && overlapsVertically, "rocket decoration must not overlap the heading's bounding box").toBe(false);
    }
  });

  test("home hero heading stays readable at mobile width (regression guard for session-3 fix)", async ({ page }) => {
    // The home hero <h1> (#home-hero-title) never received any responsive
    // font-size reduction — stuck at 60px from 390px through 1440px in both
    // locales, because its structurally-identical twin on the About page gets
    // a vendor mobile override this one's ancestor chain doesn't match (see
    // docs/phase-5.1-responsive-engineering/02-responsive-defect-matrix.md).
    // At narrow English viewports this forced up to 6 single-word lines. Fixed
    // with a clamp(); guard against the font-size regressing back to a flat
    // 60px (no narrow-width reduction) or being over-corrected (unreadably
    // small, or a vendor-override reappearing and shrinking desktop).
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(localizedUrl("en", ""));
    const heading = page.locator("#home-hero-title");
    const mobileSize = Number((await heading.evaluate((el) => getComputedStyle(el).fontSize)).replace("px", ""));
    expect(mobileSize, "home hero heading should be reduced below the 60px desktop size on narrow mobile").toBeLessThan(45);
    expect(mobileSize, "home hero heading should not be shrunk to the point of being hard to read").toBeGreaterThan(20);

    await page.setViewportSize({ width: 1440, height: 900 });
    const desktopSize = Number((await heading.evaluate((el) => getComputedStyle(el).fontSize)).replace("px", ""));
    expect(desktopSize, "home hero heading's desktop size must remain unchanged at 60px").toBe(60);
  });
});
