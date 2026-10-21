/* global process, URL, document, window, getComputedStyle, console */
import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";

const base = process.env.PHASE45_BASE_URL || "http://127.0.0.1:5214";
if (!new Set(["127.0.0.1", "localhost", "[::1]"]).has(new URL(base).hostname)) throw new Error("Loopback candidate only");
if (!process.env.AXE_CORE_JS) throw new Error("Set AXE_CORE_JS to the locally unpacked pinned axe-core file");
const routes = ["/en", "/ar", "/en/contact", "/ar/contact", "/admin/login"];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const output = [];
for (const route of routes) {
  const response = await page.goto(new URL(route, base).toString(), { waitUntil: "domcontentloaded" });
  await page.addScriptTag({ path: process.env.AXE_CORE_JS });
  const axe = await page.evaluate(async () => window.axe.run(document, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
  }));
  await page.keyboard.press("Home");
  const tabStops = [];
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    tabStops.push(await page.evaluate(() => {
      const element = document.activeElement;
      const rect = element?.getBoundingClientRect();
      const style = element ? getComputedStyle(element) : null;
      return {
        tag: element?.tagName ?? "",
        role: element?.getAttribute("role") ?? "",
        name: element?.getAttribute("aria-label") || element?.textContent?.trim().slice(0, 80) || "",
        visible: Boolean(rect && rect.width && rect.height && style?.visibility !== "hidden" && style?.display !== "none"),
      };
    }));
  }
  output.push({
    route,
    status: response?.status() ?? 0,
    violations: axe.violations.map(({ id, impact, help, helpUrl, tags, nodes }) => ({
      id, impact, help, helpUrl, tags,
      nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
    })),
    incompleteRuleIds: axe.incomplete.map(({ id }) => id),
    keyboard: { tabStops, invisibleTabStops: tabStops.filter((item) => !item.visible).length },
  });
}
await browser.close();
const report = { generatedAt: new Date().toISOString(), base, axeCore: "4.10.3", browser: "Chromium", routes: output };
writeFileSync(new URL("accessibility-scan-results.json", import.meta.url), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ routes: output.length, violationCounts: output.map(({ route, violations }) => ({ route, count: violations.reduce((n, item) => n + item.nodes.length, 0) })), invisibleTabStops: output.map(({ route, keyboard }) => ({ route, count: keyboard.invisibleTabStops })) }));
process.exitCode = output.some(({ status, violations }) => status !== 200 || violations.length > 0) ? 1 : 0;
