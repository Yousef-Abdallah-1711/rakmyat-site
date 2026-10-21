/* global process, URL, document, window, console */
import { chromium, firefox, webkit } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";

const base = process.env.PHASE45_BASE_URL || "http://127.0.0.1:5212";
if (!new Set(["127.0.0.1", "localhost", "[::1]"]).has(new URL(base).hostname)) throw new Error("Loopback staging only");
const root = new URL("../../", import.meta.url);
const portfolio = readFileSync(new URL("content/portfolio.ts", root), "utf8");
const slugs = [...portfolio.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
const paths = ["", "/about", "/services", "/services/details", "/how-we-work", "/portfolio", "/contact"];
const routes = ["/admin/login", ...["en", "ar"].flatMap((locale) => [
  ...paths.map((path) => `/${locale}${path}`),
  ...slugs.map((slug) => `/${locale}/projects/${slug}`),
])];
const widths = [320, 360, 375, 390, 414, 430, 576, 768, 820, 900, 1024, 1280, 1366, 1440, 1600, 1920, 2560];
const issues = [];
const results = [];
const cspWarningCounts = new Map();
const engines = [["chromium", chromium], ["firefox", firefox], ["webkit", webkit]];
const browserVersions = [];
for (const [engine, launcher] of engines) {
  let browser;
  try {
    browser = await launcher.launch({ headless: true });
  } catch (error) {
    issues.push({ type: "engine-launch", engine, message: String(error) });
    continue;
  }
  browserVersions.push({ name: engine, version: browser.version() });
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  let active = { engine, route: "", width: 0 };
  page.on("pageerror", (error) => issues.push({ type: "pageerror", ...active, message: error.message }));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const messageText = message.text();
    if (messageText.includes("Content-Security-Policy") || messageText.includes("Content Security Policy")) {
      const key = JSON.stringify({ engine, route: active.route, message: messageText });
      cspWarningCounts.set(key, (cspWarningCounts.get(key) ?? 0) + 1);
      return;
    }
    issues.push({ type: "console-error", ...active, message: messageText });
  });
  for (const route of routes) {
    for (const width of widths) {
      active = { engine, route, width };
      await page.setViewportSize({ width, height: 900 });
      try {
        const response = await page.goto(new URL(route, base).toString(), { waitUntil: "domcontentloaded" });
        const facts = await page.evaluate(() => ({
          title: document.title,
          lang: document.documentElement.lang,
          dir: document.documentElement.dir,
          h1: document.querySelectorAll("h1").length,
          overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
          brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
        }));
        const item = { engine, route, width, status: response?.status() ?? 0, ...facts };
        results.push(item);
        if (item.status !== 200 || item.overflow || item.brokenImages.length) issues.push({ type: "route", ...item });
      } catch (error) {
        const item = { engine, route, width, status: 0, error: String(error) };
        results.push(item);
        issues.push({ type: "navigation", ...item });
      }
    }
  }
  await browser.close();
}
const cspWarnings = [...cspWarningCounts.entries()].map(([key, count]) => ({ ...JSON.parse(key), count }));
const report = { generatedAt: new Date().toISOString(), base, browsers: browserVersions, widths, routes, observations: results.length, issueCount: issues.length, cspReportOnlyWarningCount: [...cspWarningCounts.values()].reduce((sum, count) => sum + count, 0), cspWarnings, results, issues };
writeFileSync(new URL("responsive-route-results.json", import.meta.url), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ observations: report.observations, issueCount: report.issueCount, cspReportOnlyWarningCount: report.cspReportOnlyWarningCount, routes: routes.length, widths: widths.length, browserVersions, issueSample: issues.slice(0, 20) }));
process.exitCode = issues.length ? 1 : 0;
