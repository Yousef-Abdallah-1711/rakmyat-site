import { spawnSync } from "node:child_process";

const base = process.env.PHASE43_BASE_URL || "http://127.0.0.1:5212";
const hostname = new URL(base).hostname;
if (!new Set(["127.0.0.1", "localhost", "[::1]"]).has(hostname)) {
  throw new Error("Phase 4.3 E2E tests may target loopback staging only.");
}

// Isolated synthetic staging only: clear request counters so the repeatable E2E
// suite starts clean. This preserves inquiries, admin data, and all other tables.
const reset = spawnSync("docker", [
  "exec", "rakmyat-phase43-staging-postgres-1", "psql", "-U", "rakmyat_staging",
  "-d", "rakmyat_phase43", "-v", "ON_ERROR_STOP=1", "-c", "TRUNCATE rate_limit_buckets",
], { stdio: "inherit" });
if (reset.status !== 0) throw new Error("Could not reset the isolated staging rate-limit fixture.");

const command = process.platform === "win32" ? (process.env.ComSpec || "cmd.exe") : "npx";
const args = process.platform === "win32"
  ? ["/d", "/s", "/c", "npx.cmd playwright test -c playwright.phase43.config.ts"]
  : ["playwright", "test", "-c", "playwright.phase43.config.ts"];
const result = spawnSync(command, args, {
  stdio: "inherit",
  env: { ...process.env, PHASE43_BASE_URL: base },
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
