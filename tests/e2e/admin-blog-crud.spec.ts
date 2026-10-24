import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

// localhost, not 127.0.0.1: requireSameOrigin() rejects 127.0.0.1 origins on this dev server.
const BASE_URL = "http://localhost:5175";
const SESSION_COOKIE_NAME = "rakmyat_admin_session"; // dev name; production uses the __Host- prefix
const ADMIN_EMAIL = "admin@rakmyat.local";
const ADMIN_PASSWORD = "Rakmyat@Admin2026!";
const AUTH_HEADERS = { Origin: BASE_URL, "Content-Type": "application/json" };
const EDIT_URL = /\/admin\/blog\/posts\/[0-9a-f-]{36}\/edit$/i;
const MISSING_ID = "00000000-0000-4000-8000-000000000000";

expect.configure({ timeout: 15_000 });

let cachedSessionCookie: string | null = null;

async function loginAsAdmin(page: Page, request: APIRequestContext) {
  if (!cachedSessionCookie) {
    const response = await request.post("/api/admin/login", { headers: AUTH_HEADERS, data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD } });
    expect(response.status(), "admin login via API should succeed").toBe(200);
    const setCookie = response.headersArray().find((header) => header.name.toLowerCase() === "set-cookie" && header.value.startsWith(`${SESSION_COOKIE_NAME}=`));
    expect(setCookie, "login response should set the admin session cookie").toBeDefined();
    cachedSessionCookie = setCookie!.value.split(";")[0].slice(SESSION_COOKIE_NAME.length + 1);
  }
  await page.context().addCookies([{ name: SESSION_COOKIE_NAME, value: cachedSessionCookie, url: BASE_URL }]);
}

// Headers for direct API calls; call only after loginAsAdmin() has cached the session cookie.
function sessionHeaders() {
  return { Origin: BASE_URL, Cookie: `${SESSION_COOKIE_NAME}=${cachedSessionCookie}`, "Content-Type": "application/json" };
}

test("blog post create, reopen, edit, and delete through the admin routes", async ({ page, request }) => {
  await loginAsAdmin(page, request);
  await page.goto("/admin/blog");
  await expect(page.getByRole("heading", { name: /Blog posts/ })).toBeVisible();
  // The taxonomy tab was moved to the standalone categories/tags pages.
  await expect(page.getByRole("tab")).toHaveCount(0);

  await page.getByRole("button", { name: /New Post/ }).click();
  await expect(page).toHaveURL(/\/admin\/blog\/posts\/new$/);
  await expect(page.getByRole("heading", { name: "Create blog post" })).toBeVisible();

  const stamp = Date.now();
  const slug = `crud-playwright-${stamp}`;
  const titleEn = `CRUD Post ${stamp}`;
  const titleAr = "منشور اختبار";
  await page.getByLabel(/^Slug/).fill(slug);
  await page.getByLabel(/Title \(English\)/).fill(titleEn);
  await page.getByLabel(/Title \(Arabic\)/).fill(titleAr);
  const [created] = await Promise.all([
    page.waitForResponse((response) => response.url().endsWith("/api/admin/blog/posts") && response.request().method() === "POST"),
    page.getByRole("button", { name: /^Save/ }).click(),
  ]);
  expect(created.status()).toBe(201);
  await expect(page.getByRole("status")).toContainText("Saved.");
  await expect(page).toHaveURL(EDIT_URL);

  await page.getByRole("button", { name: /^Back/ }).first().click();
  await expect(page).toHaveURL(/\/admin\/blog$/);
  await page.getByLabel(/^Search/).fill(slug);
  const row = page.getByRole("button", { name: new RegExp(titleEn) });
  await expect(row).toBeVisible();

  await row.click();
  await expect(page).toHaveURL(EDIT_URL);
  await expect(page.getByLabel(/^Slug/)).toHaveValue(slug);
  await expect(page.getByLabel(/Title \(English\)/)).toHaveValue(titleEn);
  await expect(page.getByLabel(/Title \(Arabic\)/)).toHaveValue(titleAr);
  await expect(page.getByLabel(/Author name/)).toHaveValue("Rakmyat");

  const updatedTitle = `${titleEn} Updated`;
  await page.getByLabel(/Title \(English\)/).fill(updatedTitle);
  await page.getByLabel(/Excerpt \(English\)/).fill("Edited excerpt");
  const [updated] = await Promise.all([
    page.waitForResponse((response) => response.url().includes("/api/admin/blog/posts/") && response.request().method() === "PATCH"),
    page.getByRole("button", { name: /^Save/ }).click(),
  ]);
  expect(updated.status()).toBe(200);
  await expect(page.getByRole("status")).toContainText("Saved.");
  await expect(page.getByLabel(/Excerpt \(English\)/)).toHaveValue("Edited excerpt");
  await expect(page.getByRole("heading", { name: updatedTitle })).toBeVisible();

  // Remove the test post so repeated runs leave the dev database clean.
  page.once("dialog", (dialog) => void dialog.accept());
  await page.getByRole("button", { name: /^Delete/ }).click();
  await expect(page).toHaveURL(/\/admin\/blog$/);
  await expect(page.getByRole("status")).toContainText("Post deleted.");
});

test("malformed post id redirects to the list", async ({ page, request }) => {
  await loginAsAdmin(page, request);
  await page.goto("/admin/blog/posts/not-a-uuid/edit");
  await expect(page).toHaveURL(/\/admin\/blog$/);
});

test("unknown post id shows a not-found message with a way back", async ({ page, request }) => {
  await loginAsAdmin(page, request);
  await page.goto(`/admin/blog/posts/${MISSING_ID}/edit`);
  await expect(page.getByRole("alert").filter({ hasText: "Post not found" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Back to posts/ })).toBeVisible();
});

test("unauthenticated visitors are redirected from the new and edit post routes", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto("/admin/blog/posts/new");
    await expect(page).toHaveURL(/\/admin\/login$/);
    await page.goto(`/admin/blog/posts/${MISSING_ID}/edit`);
    await expect(page).toHaveURL(/\/admin\/login$/);
  } finally {
    await context.close();
  }
});

test("draft autosave creates the post after a pause and moves the URL to its edit route", async ({ page, request }) => {
  await loginAsAdmin(page, request);
  await page.goto("/admin/blog/posts/new");
  await expect(page.getByRole("heading", { name: "Create blog post" })).toBeVisible();

  const stamp = Date.now();
  await page.getByLabel(/^Slug/).fill(`autosave-playwright-${stamp}`);
  await page.getByLabel(/Title \(English\)/).fill(`Autosave Test EN ${stamp}`);
  await page.getByLabel(/Title \(Arabic\)/).fill(`اختبار الحفظ التلقائي ${stamp}`);

  // Nothing was clicked: the debounced autosave alone should create the draft and switch to edit mode.
  await page.waitForURL(EDIT_URL, { timeout: 15_000 });
  await expect(page.getByText(/Draft autosaved/)).toBeVisible();

  const id = new URL(page.url()).pathname.match(/\/posts\/([0-9a-f-]{36})\/edit$/i)?.[1];
  expect(id, "autosave should leave the post id in the URL").toBeTruthy();
  const removed = await request.delete(`/api/admin/blog/posts/${id}`, { headers: sessionHeaders() });
  expect(removed.status()).toBe(200);
});

test("category management page loads", async ({ page, request }) => {
  await loginAsAdmin(page, request);
  await page.goto("/admin/blog/categories");
  await expect(page.getByRole("heading", { name: /categor/i }).first()).toBeVisible();
});

test("tag management page loads", async ({ page, request }) => {
  await loginAsAdmin(page, request);
  await page.goto("/admin/blog/tags");
  await expect(page.getByRole("heading", { name: /tag/i }).first()).toBeVisible();
});

test("media library page loads for authenticated users", async ({ page, request }) => {
  await loginAsAdmin(page, request);
  await page.goto("/admin/media");
  await expect(page.getByRole("heading", { name: /media/i }).first()).toBeVisible();
});

test("XSS in blog body is sanitized on create and on update", async ({ page, request }) => {
  await loginAsAdmin(page, request);
  const stamp = Date.now();
  const xssBody = '<p>Safe text</p><script>alert("xss")</script><p onclick="steal()">After</p><img src="x" onerror="alert(1)">';

  const createRes = await request.post("/api/admin/blog/posts", {
    headers: sessionHeaders(),
    data: { slug: `xss-test-${stamp}`, title_en: "XSS Test", title_ar: "اختبار", body_en: xssBody },
  });
  expect(createRes.status()).toBe(201);
  const created = (await createRes.json()) as { post: { id: string; body_en: string } };
  try {
    expect(created.post.body_en).not.toContain("<script");
    expect(created.post.body_en).not.toContain("onclick");
    expect(created.post.body_en).not.toContain("onerror");
    expect(created.post.body_en).toContain("Safe text");

    const patchRes = await request.patch(`/api/admin/blog/posts/${created.post.id}`, {
      headers: sessionHeaders(),
      data: { body_en: '<p>Patched</p><iframe src="https://evil.example/x"></iframe>' },
    });
    expect(patchRes.status()).toBe(200);
    const patched = (await patchRes.json()) as { post: { body_en: string } };
    expect(patched.post.body_en).toContain("Patched");
    expect(patched.post.body_en).not.toContain("<iframe");
    expect(patched.post.body_en).not.toContain("evil.example");
  } finally {
    await request.delete(`/api/admin/blog/posts/${created.post.id}`, { headers: sessionHeaders() });
  }
});
