import { expect, test } from "@playwright/test";
import { collectConsoleErrors, collectPageErrors, contentRoutes, localizedUrl, locales } from "./helpers";

test.describe("route smoke tests — static content routes", () => {
  for (const locale of locales) {
    for (const route of contentRoutes) {
      test(`${locale}/${route.name || "(root)"} navigates cleanly, no page/console errors, correct lang+dir`, async ({ page }) => {
        const pageErrors = collectPageErrors(page);
        const consoleErrors = collectConsoleErrors(page);

        const response = await page.goto(localizedUrl(locale, route.path));
        expect(response?.ok(), `navigation to ${localizedUrl(locale, route.path)} should return an ok response`).toBe(true);

        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.locator("html")).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");

        const main = page.locator("main");
        await expect(main.first()).toBeVisible();
        const mainText = await main.first().innerText();
        expect(mainText.trim().length, `main content on ${locale}/${route.name} should not be empty`).toBeGreaterThan(0);

        expect(pageErrors, `uncaught page errors on ${locale}/${route.name}: ${pageErrors.join(" | ")}`).toHaveLength(0);
        expect(consoleErrors, `console errors on ${locale}/${route.name}: ${consoleErrors.join(" | ")}`).toHaveLength(0);
      });
    }
  }
});

test.describe("route smoke tests — admin (unlocalized, unauthenticated-safe)", () => {
  test("admin login renders without errors and is not locale-prefixed", async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);

    const response = await page.goto("/admin/login");
    expect(response?.ok()).toBe(true);
    await expect(page.getByRole("heading", { name: "Inquiry administration" })).toBeVisible();

    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
  });

  test("/ar/admin/login 404s — admin routes are intentionally unlocalized", async ({ page }) => {
    // Separate test, separate error listeners: the 404 below is the thing under
    // test, not an unexpected failure, so it must not pollute another test's
    // "no console errors" assertion.
    const localizedAttempt = await page.goto("/ar/admin/login");
    expect(localizedAttempt?.status()).toBe(404);
  });

  test("admin inquiries shows an honest setup-required state when no local database is configured (BLOCKED beyond this)", async ({ page }) => {
    // This environment has no DATABASE_URL (see docs/KNOWN-ISSUES.md), so the
    // server-rendered page short-circuits to an explicit "Admin setup required"
    // state with a manual sign-in link, rather than attempting to authenticate.
    // This is the real, correct behavior here — not a redirect — confirmed live
    // before writing this assertion. Testing the actual authenticated dashboard
    // (filters/table/pagination) remains BLOCKED without a local database; see
    // docs/phase-5.1-responsive-engineering/14-remaining-limitations.md.
    await page.goto("/admin/inquiries");
    await expect(page.getByRole("heading", { name: "Admin setup required" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Go to sign in" })).toHaveAttribute("href", "/admin/login");
  });
});
