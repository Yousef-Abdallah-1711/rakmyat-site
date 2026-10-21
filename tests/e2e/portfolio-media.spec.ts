import { expect, test } from "@playwright/test";

const projects = [
  "schooly", "nora-store", "edtech-platform", "live-workshop", "eduflow",
  "legal-translation", "gc-hardware", "concord-crm", "product-scraper",
];

test("full-size viewer supports zoom, navigation, Escape, and focus return", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/en/projects/schooly");
  const opener = page.locator(".project-detail-gallery-grid a[data-fancybox]").first();
  const original = await opener.getAttribute("href");
  await opener.click();

  const dialog = page.getByRole("dialog", { name: "Image gallery" });
  await expect.poll(() => page.locator("body").evaluate((element) => getComputedStyle(element).overflow)).toBe("hidden");
  const image = dialog.locator(".media-lightbox__image");
  await dialog.getByRole("button", { name: "Close media" }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Next image" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close media" })).toBeFocused();
  await expect(image).toHaveAttribute("src", new RegExp("schools-desktop\\.webp"));
  const initialWidth = Number(await image.evaluate((element) => getComputedStyle(element).width.replace("px", "")));
  await dialog.getByRole("button", { name: "Zoom in" }).click();
  const zoomedWidth = Number(await image.evaluate((element) => getComputedStyle(element).width.replace("px", "")));
  expect(zoomedWidth).toBeGreaterThan(initialWidth);
  await page.keyboard.press("ArrowRight");
  await expect(image).toHaveAttribute("src", new RegExp("compare-desktop\\.webp"));
  await page.keyboard.press("ArrowLeft");
  await expect(image).toHaveAttribute("src", new RegExp("schools-desktop\\.webp"));
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect.poll(() => page.locator("body").evaluate((element) => getComputedStyle(element).overflow)).not.toBe("hidden");
  await expect(opener).toBeFocused();
  expect(original).toContain("schools-desktop.webp");
});

test("Arabic gallery keeps RTL semantics and mobile full-size controls usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ar/projects/schooly");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  const opener = page.locator(".project-detail-gallery-grid a[data-fancybox]").first();
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "معرض الصور" });
  await expect(dialog.getByRole("button", { name: "تكبير" })).toBeVisible();
  await dialog.getByRole("button", { name: "الصورة التالية" }).click();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test("previous/next and related-project links open the expected case studies", async ({ page }) => {
  await page.goto("/en/projects/schooly");
  const neighbors = page.locator(".project-neighbor-links a");
  await expect(neighbors).toHaveCount(2);
  await expect(neighbors.nth(0)).toHaveAttribute("href", "/en/projects/product-scraper");
  await expect(neighbors.nth(1)).toHaveAttribute("href", "/en/projects/nora-store");
  await page.locator(".project-related a.project-showcase-link").first().click();
  await expect(page.locator("main.project-detail")).toHaveAttribute("data-project", "edtech-platform");
});

test("all published project detail routes render in both locales", async ({ page }) => {
  for (const locale of ["en", "ar"]) {
    for (const project of projects) {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`/${locale}/projects/${project}`);
      await expect(page.locator("main.project-detail")).toHaveAttribute("data-project", project);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, `${locale}/${project} should not overflow horizontally`).toBe(false);
    }
  }
});
