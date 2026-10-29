import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  // The container-backed CI suite is intentionally limited to its synthetic
  // contact/inquiry integration file. Other E2E specs require a local dev DB,
  // provisioned admin users, or the responsive browser config.
  testMatch: "phase43-contact.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: { ...devices["Desktop Chrome"], baseURL: process.env.PHASE43_BASE_URL || "http://127.0.0.1:5212", trace: "retain-on-failure" },
});
