import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: ["**/admin-auth.spec.ts", "**/admin-blog-crud.spec.ts"],
  fullyParallel: false,
  workers: 1,
  retries: 1,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    // localhost, not 127.0.0.1: the dev server's requireSameOrigin() rejects 127.0.0.1 origins (see docs/phase-5.1-responsive-engineering/19-session-4-live-data-admin-verification.md).
    baseURL: "http://localhost:5175",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
