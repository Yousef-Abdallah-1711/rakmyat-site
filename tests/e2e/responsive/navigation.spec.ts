import { expect, test } from "@playwright/test";
import { localizedUrl } from "./helpers";

test.describe("shared navigation — mobile menu", () => {
  for (const locale of ["ar", "en"] as const) {
    test(`${locale}: mobile menu opens, closes on Escape, and locks background scroll`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(localizedUrl(locale, ""));
      // The server-rendered control is present before React hydrates it. Wait
      // for the route's scripts to settle so this click exercises the handler.
      await page.waitForLoadState("networkidle");

      const toggle = page.locator(".navbar-toggler");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");

      const bodyOverflowX = await page.evaluate(() => getComputedStyle(document.body).overflowX);
      expect(bodyOverflowX, "body overflow-x should be hidden while the mobile menu is open, to block background scroll").toBe("hidden");

      await page.keyboard.press("Escape");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
    });
  }
});

test.describe("shared navigation — language switcher", () => {
  test("ar -> en preserves the current page (not just the homepage)", async ({ page }) => {
    await page.goto("/ar/services");
    const summary = page.locator('[class*="language-switcher"] summary').first();
    await summary.click();
    const enLink = page.locator('[class*="language-switcher-menu"] a').filter({ hasText: /EN|English/i }).first();
    await expect(enLink).toHaveAttribute("href", "/en/services");
  });

  test("en -> ar preserves the current page", async ({ page }) => {
    await page.goto("/en/about");
    const summary = page.locator('[class*="language-switcher"] summary').first();
    await summary.click();
    const arLink = page.locator('[class*="language-switcher-menu"] a').filter({ hasText: /AR|العربية/i }).first();
    await expect(arLink).toHaveAttribute("href", "/ar/about");
  });
});

test.describe("shared navigation — desktop nav stays fixed at the real top", () => {
  test("nav is position:fixed and anchored to the viewport top after scrolling a tall page", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/ar/how-we-work");
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.35));
    await page.waitForTimeout(200);

    const nav = page.locator("nav.navbar");
    await expect(nav).toHaveCSS("position", "fixed");
    const box = await nav.boundingBox();
    expect(box?.y, "fixed nav should render at the viewport top regardless of scroll position").toBeLessThanOrEqual(1);
  });
});
