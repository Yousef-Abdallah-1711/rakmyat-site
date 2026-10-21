import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: { ...devices["Desktop Chrome"], baseURL: process.env.PHASE43_BASE_URL || "http://127.0.0.1:5212", trace: "retain-on-failure" },
});
