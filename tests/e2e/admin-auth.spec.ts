import { config as loadEnv } from "dotenv";
import postgres from "postgres";
import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

loadEnv({ path: ".env.local" });

// localhost, not 127.0.0.1: requireSameOrigin() rejects 127.0.0.1 origins on this dev server (documented in docs/phase-5.1-responsive-engineering/19-session-4-live-data-admin-verification.md).
const BASE_URL = "http://localhost:5175";
const SESSION_COOKIE_NAME = "rakmyat_admin_session"; // dev name; production uses the __Host- prefix
const ADMIN_EMAIL = "admin@rakmyat.local";
const ADMIN_PASSWORD = "Rakmyat@Admin2026!";
const AUTH_HEADERS = { Origin: BASE_URL, "Content-Type": "application/json" };

expect.configure({ timeout: 15_000 });

// The admin account allows only 6 login attempts per 15 minutes, so the suite logs in through the
// real endpoint once and reuses that session cookie. Tests 3 and 7 use the form because they cover
// the UI login and sign-out flows.
let cachedSessionCookie: string | null = null;

async function fetchAdminSessionCookie(request: APIRequestContext) {
  const response = await request.post("/api/admin/login", { headers: AUTH_HEADERS, data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD } });
  expect(response.status(), "admin login via API should succeed").toBe(200);
  const setCookie = response.headersArray().find((header) => header.name.toLowerCase() === "set-cookie" && header.value.startsWith(`${SESSION_COOKIE_NAME}=`));
  expect(setCookie, "login response should set the admin session cookie").toBeDefined();
  return setCookie!.value.split(";")[0].slice(SESSION_COOKIE_NAME.length + 1);
}

async function loginAsAdmin(page: Page, request: APIRequestContext) {
  cachedSessionCookie ??= await fetchAdminSessionCookie(request);
  await page.context().addCookies([{ name: SESSION_COOKIE_NAME, value: cachedSessionCookie, url: BASE_URL }]);
}

// Asks the server whether this client IP is in ADMIN_IP_ALLOWLIST. In development every request is keyed
// to 127.0.0.1, so an allowlist containing 127.0.0.1 turns rate limiting off for the whole local run.
async function isRequesterAllowlisted(request: APIRequestContext) {
  cachedSessionCookie ??= await fetchAdminSessionCookie(request);
  const response = await request.get("/api/admin/security", { headers: { Cookie: `${SESSION_COOKIE_NAME}=${cachedSessionCookie}` } });
  expect(response.status(), "security summary should load for the admin session").toBe(200);
  return (await response.json()).ipAllowlisted === true;
}

async function signInThroughForm(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Email", { exact: true }).fill(ADMIN_EMAIL);
  await page.getByLabel("Password", { exact: true }).fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin\/inquiries$/);
}

test.beforeAll(async () => {
  // Rate-limit counters persist in the dev database. Clear them so earlier runs do not block this one.
  const url = process.env.DATABASE_URL;
  expect(url, "DATABASE_URL must be set in .env.local").toBeTruthy();
  expect(new URL(url!).hostname, "refusing to clear rate limits outside localhost").toMatch(/^(localhost|127\.0\.0\.1)$/);
  const sql = postgres(url!, { max: 1, prepare: false });
  try {
    await sql`DELETE FROM rate_limit_buckets`;
  } finally {
    await sql.end({ timeout: 5 });
  }
});

test("Test 1: login page loads correctly", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByRole("heading", { level: 1, name: "Inquiry administration" })).toBeVisible();
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});

test("Test 2: wrong credentials show an error", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email", { exact: true }).fill("wrong@example.com");
  await page.getByLabel("Password", { exact: true }).fill("wrongpassword123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Email or password is incorrect." })).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("Test 3: correct credentials redirect to inquiries", async ({ page }) => {
  await signInThroughForm(page);
  await expect(page.getByRole("heading", { name: "Project inquiries" })).toBeVisible();
});

test("Test 4: authenticated user can access /admin/inquiries", async ({ page, request }) => {
  await loginAsAdmin(page, request);
  await page.goto("/admin/inquiries");
  await expect(page).toHaveURL(/\/admin\/inquiries$/);
  await expect(page.getByRole("heading", { name: "Project inquiries" })).toBeVisible();
});

test("Test 5: authenticated user can access /admin/blog", async ({ page, request }) => {
  await loginAsAdmin(page, request);
  await page.goto("/admin/blog");
  await expect(page).toHaveURL(/\/admin\/blog$/);
  await expect(page.getByRole("heading", { name: /Blog posts/ })).toBeVisible();
});

test("Test 6: unauthenticated user is redirected from /admin/inquiries", async ({ browser }) => {
  // A new context has no cookies, so the server-side guard should send the user to the login page.
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto("/admin/inquiries");
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.getByRole("heading", { level: 1, name: "Inquiry administration" })).toBeVisible();
  } finally {
    await context.close();
  }
});

test("Test 7: sign out ends the session", async ({ page }) => {
  await signInThroughForm(page);
  await expect(page.getByRole("heading", { name: "Project inquiries" })).toBeVisible();
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  const cookies = await page.context().cookies();
  expect(cookies.map((cookie) => cookie.name)).not.toContain(SESSION_COOKIE_NAME);
  await page.goto("/admin/inquiries");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("Test 8: blog post creation through the admin UI", async ({ page, request }) => {
  await loginAsAdmin(page, request);
  await page.goto("/admin/blog");
  await expect(page.getByRole("heading", { name: /Blog posts/ })).toBeVisible();
  await page.getByRole("button", { name: /New Post/ }).click();

  const slug = `test-post-playwright-${Date.now()}`;
  const titleEn = "Test Post EN";
  await page.getByLabel(/^Slug/).fill(slug);
  await page.getByLabel(/Title \(English\)/).fill(titleEn);
  await page.getByLabel(/Title \(Arabic\)/).fill("منشور تجريبي");
  await page.getByRole("button", { name: /^Save/ }).click();
  await expect(page.getByRole("status")).toContainText("Saved.");

  await page.getByRole("button", { name: /^Back/ }).first().click();
  await page.getByLabel(/^Search/).fill(slug);
  const row = page.getByRole("button", { name: new RegExp(titleEn) });
  await expect(row).toBeVisible();

  // Remove the test post so repeated runs leave the dev database clean.
  await row.click();
  page.once("dialog", (dialog) => void dialog.accept());
  await page.getByRole("button", { name: /^Delete/ }).click();
  await expect(page.getByRole("status")).toContainText("Post deleted.");
});

test("Test 9: repeated failed logins are rate limited with Retry-After", async ({ request }) => {
  // Uses a throwaway address so the admin account itself is not locked out.
  // Only failed attempts consume rate-limit tokens now; successful logins do not.
  // Requests from an ADMIN_IP_ALLOWLIST address skip rate limiting, so the expected result depends on that config.
  const allowlisted = await isRequesterAllowlisted(request);
  const statuses: number[] = [];
  let retryAfter: string | undefined;
  for (let attempt = 0; attempt < 7; attempt++) {
    const response = await request.post("/api/admin/login", {
      headers: AUTH_HEADERS,
      data: { email: "ratelimit-probe@example.com", password: "wrongpassword123" },
    });
    statuses.push(response.status());
    if (response.status() === 429 && retryAfter === undefined) retryAfter = response.headers()["retry-after"];
  }
  if (allowlisted) {
    expect(statuses.every((status) => status === 401), "allowlisted IP should never be rate limited").toBe(true);
    expect(retryAfter).toBeUndefined();
  } else {
    expect(statuses).toContain(429);
    expect(Number(retryAfter)).toBeGreaterThan(0);
  }
});

test("Test 10: login form shows a Retry-After countdown when rate limited", async ({ page, request }) => {
  test.skip(await isRequesterAllowlisted(request), "this IP is in ADMIN_IP_ALLOWLIST, so the login form is never rate limited");
  await page.goto("/admin/login");
  await page.getByLabel("Email", { exact: true }).fill("countdown-probe@example.com");
  await page.getByLabel("Password", { exact: true }).fill("wrongpassword123");
  const submit = page.getByRole("button", { name: "Sign in" });
  // Submit until the server answers 429; earlier tests may already have used the shared login budget.
  for (let attempt = 0; attempt < 8; attempt++) {
    const [response] = await Promise.all([
      page.waitForResponse((item) => item.url().endsWith("/api/admin/login")),
      submit.click(),
    ]);
    if (response.status() === 429) {
      expect(Number(response.headers()["retry-after"])).toBeGreaterThan(0);
      break;
    }
  }
  await expect(page.getByRole("alert").filter({ hasText: /Too many attempts\. Try again in \d+ seconds?\./ })).toBeVisible();
  await expect(submit).toBeDisabled();
});
