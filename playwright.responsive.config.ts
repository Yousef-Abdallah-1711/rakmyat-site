import { defineConfig, devices } from "@playwright/test";

/**
 * Dedicated config for the Phase 5.1 responsive regression suite
 * (tests/e2e/responsive/). Deliberately separate from playwright.phase43.config.ts:
 * that config's testDir includes phase43-contact.spec.ts, which requires a
 * disposable Docker Postgres staging container and truncates a rate-limit table
 * before running. This suite only exercises public, static-content pages and the
 * already-running local dev server — no database, no Docker, nothing destructive.
 *
 * Usage: npx playwright test -c playwright.responsive.config.ts
 * (requires `npm run dev` already running on RESPONSIVE_BASE_URL, default
 * http://127.0.0.1:5175 — see docs/phase-5.1-responsive-engineering/
 * 16-responsive-regression-suite.md)
 */
export default defineConfig({
  testDir: "./tests/e2e/responsive",
  fullyParallel: true,
  // Session 2 found that workers:4 against a single local dev server caused rare,
  // genuine resource-contention flakiness on click-interaction timing (confirmed:
  // 15/15 passes at workers:1, intermittent failures at workers:4, same assertion
  // each time). workers:2 plus one retry absorbs that without going fully serial.
  workers: 2,
  retries: 1,
  reporter: "list",
  timeout: 30_000,
  use: {
    ...devices["Desktop Chrome"],
    baseURL: process.env.RESPONSIVE_BASE_URL || "http://127.0.0.1:5175",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
