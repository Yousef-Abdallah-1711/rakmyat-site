import { expect, test } from "@playwright/test";

const runId = Date.now().toString(36);

test("English and Arabic contact forms validate and persist synthetic inquiries", async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const mailpitBefore = await request.get("http://127.0.0.1:18025/api/v1/messages");
  expect(mailpitBefore.ok()).toBeTruthy();
  const beforeCount = (await mailpitBefore.json()).messages.length;

  await page.goto("/en/contact");
  await page.screenshot({ path: "docs/phase-4.3-docker-integrations/evidence/contact-en-390.png" });
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.locator(".inquiry-form div[role='alert'].col-12")).toContainText("Full name");
  await page.getByLabel("Full name").fill("Synthetic Browser QA");
  await page.getByLabel("Phone number").fill("not-a-phone");
  await page.getByLabel("Email address").fill("invalid-email");
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.locator(".inquiry-form div[role='alert'].col-12")).toContainText("Phone number");
  await expect(page.locator(".inquiry-form div[role='alert'].col-12")).toContainText("Email address");
  await expect(page.getByLabel("Full name")).toHaveValue("Synthetic Browser QA");
  await page.getByLabel("Phone number").fill("+201001234571");
  await page.getByLabel("Email address").fill(`phase43-${runId.toLowerCase()}@example.invalid`);
  await page.getByLabel("Project details").fill("Automated synthetic staging inquiry, English.");
  await page.route("**/api/inquiries", (route) => route.fulfill({ status: 503, contentType: "application/json", body: '{"error":"service_unavailable"}' }));
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.locator("p.inquiry-status--error")).toHaveText("We could not save your inquiry. Your entries are still here; please try again shortly.");
  await expect(page.getByLabel("Full name")).toHaveValue("Synthetic Browser QA");
  await page.unroute("**/api/inquiries");
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.getByRole("status")).toHaveText("Your inquiry was saved for review.");

  await page.goto("/ar/contact");
  await page.screenshot({ path: "docs/phase-4.3-docker-integrations/evidence/contact-ar-390.png" });
  await page.getByLabel("الاسم الكامل").fill("اختبار آلي");
  await page.getByLabel("رقم الهاتف").fill("+201001234572");
  await page.getByLabel("البريد الإلكتروني").fill(`phase43-ar-${runId.toLowerCase()}@example.invalid`);
  await page.getByLabel("تفاصيل المشروع").fill("اختبار آلي تجريبي باللغة العربية.");
  await page.getByRole("button", { name: "إرسال الاستفسار" }).click();
  await expect(page.getByRole("status")).toHaveText("تم حفظ استفسارك للمراجعة.");

  await expect.poll(async () => {
    const response = await request.get("http://127.0.0.1:18025/api/v1/messages");
    const body = await response.json();
    return body.messages?.length || 0;
  }, { timeout: 30000 }).toBeGreaterThanOrEqual(beforeCount + 2);
});

test("public pages load at mobile, tablet, and desktop widths; admin data stays private", async ({ page, request }) => {
  for (const width of [390, 900, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/en", "/ar", "/en/contact", "/ar/contact", "/en/portfolio", "/en/how-we-work"]) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} at ${width}px`).toBe(200);
      await expect(page.locator("body")).toBeVisible();
      const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
      expect(horizontalOverflow, `${path} horizontal overflow at ${width}px`).toBeFalsy();
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/admin/login");
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await page.screenshot({ path: "docs/phase-4.3-docker-integrations/evidence/admin-login-390.png" });
  const privateData = await request.get("/api/admin/inquiries");
  expect(privateData.status()).toBe(401);
});
