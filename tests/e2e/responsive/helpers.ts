import type { Page } from "@playwright/test";

export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

/** Static, template-backed content routes served by app/[locale]/[[...path]]/page.tsx. */
export const contentRoutes = [
  { path: "", name: "home" },
  { path: "about", name: "about" },
  { path: "services", name: "services" },
  { path: "services/details", name: "services-details" },
  { path: "how-we-work", name: "how-we-work" },
  { path: "portfolio", name: "portfolio" },
] as const;

export const portfolioSlugs = [
  "schooly", "nora-store", "edtech-platform", "live-workshop", "eduflow",
  "legal-translation", "gc-hardware", "concord-crm", "product-scraper",
] as const;

/** The 15-viewport brief matrix. Applied in full only to the highest-traffic route (home). */
export const fullViewportMatrix = [
  { width: 320, height: 720, label: "320x720-narrow-mobile" },
  { width: 360, height: 800, label: "360x800-small-mobile" },
  { width: 375, height: 812, label: "375x812-typical-mobile" },
  { width: 390, height: 844, label: "390x844-large-mobile" },
  { width: 414, height: 896, label: "414x896-large-mobile" },
  { width: 430, height: 932, label: "430x932-wide-mobile" },
  { width: 540, height: 900, label: "540x900-small-tablet" },
  { width: 640, height: 960, label: "640x960-tablet" },
  { width: 768, height: 1024, label: "768x1024-tablet-portrait" },
  { width: 820, height: 1180, label: "820x1180-tablet-portrait" },
  { width: 1024, height: 768, label: "1024x768-tablet-landscape" },
  { width: 1180, height: 820, label: "1180x820-tablet-landscape" },
  { width: 1280, height: 800, label: "1280x800-small-laptop" },
  { width: 1440, height: 900, label: "1440x900-desktop" },
  { width: 1920, height: 1080, label: "1920x1080-wide-desktop" },
] as const;

/**
 * Representative subset of the full matrix, used for routes that aren't worth the
 * full 15-point sweep every run: narrowest mobile, a common mobile size, tablet
 * portrait, tablet landscape, and desktop. Documented here rather than implied —
 * see docs/phase-5.1-responsive-engineering/16-responsive-regression-suite.md.
 */
export const coreViewports = [
  fullViewportMatrix[0],  // 320x720
  fullViewportMatrix[3],  // 390x844
  fullViewportMatrix[8],  // 768x1024
  fullViewportMatrix[10], // 1024x768
  fullViewportMatrix[13], // 1440x900
] as const;

export function localizedUrl(locale: Locale, path: string): string {
  return path ? `/${locale}/${path}` : `/${locale}`;
}

/**
 * Scrolls a page through its full height in increments and back to top before any
 * full-page or layout assertion. next/image lazy-loads below-the-fold media via
 * native `loading="lazy"`; without this, overflow/image checks race the loader
 * and produce false positives (see docs/phase-5.1-responsive-engineering/
 * 11-test-coverage-and-verification.md for the session-1 incident this guards
 * against).
 *
 * Uses page.mouse.wheel() rather than a raw `window.scrollTo()` evaluate call —
 * this session discovered that programmatic scrollTo does not reliably trigger
 * native lazy-loading in headless Chromium automation (the image element's `src`
 * reflects an unresolved placeholder candidate and `currentSrc` stays empty
 * indefinitely), while a real wheel-scroll input event does. See
 * docs/phase-5.1-responsive-engineering/17-session-2-coverage-matrix.md for the
 * before/after evidence. Not an arbitrary sleep: each step waits only long
 * enough for the browser's lazy-load heuristic to react, and total wait scales
 * with page height, not a fixed budget.
 */
export async function scrollThroughPage(page: Page): Promise<void> {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = 600;
  for (let scrolled = 0; scrolled < total; scrolled += step) {
     
    await page.mouse.wheel(0, step);
     
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
}

/**
 * Document-level horizontal overflow, in px, after a scroll-through. A small
 * tolerance absorbs fractional-pixel layout rounding (observed up to ~1px in
 * session 1), without masking real overflow, which in practice is never that
 * small — genuine defects found in session 1 were 18-24px.
 */
export async function horizontalOverflowPx(page: Page): Promise<number> {
  return page.evaluate(() => {
    const el = document.documentElement;
    return el.scrollWidth - el.clientWidth;
  });
}

export const OVERFLOW_TOLERANCE_PX = 2;

/**
 * Waits until every currently-visible <img> on the page reports `complete` with
 * a non-zero naturalWidth, or the timeout elapses. next/image's dev-mode
 * on-demand transform endpoint can take noticeably longer than a fixed
 * scroll-step delay for large requested widths, so this polls instead of
 * assuming a flat wait is enough — avoids a false "broken image" report for an
 * image that is simply still in flight.
 */
export async function waitForImagesToSettle(page: Page, timeoutMs = 15_000): Promise<void> {
  await page.waitForFunction(
    () => {
      const images = [...document.querySelectorAll("img")].filter((img) => {
        const rect = img.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      return images.every((img) => img.complete && img.naturalWidth > 0);
    },
    undefined,
    { timeout: timeoutMs },
  );
}

/** Collects window.onerror / unhandled rejections for a page, for pageerror assertions. */
export function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

/**
 * Console messages at error level, excluding known-benign dev-only noise.
 *
 * next.config.ts sends `Content-Security-Policy-Report-Only` (not an enforcing
 * `Content-Security-Policy`) — see its "Observe policy violations... before
 * considering enforcement" comment. Nothing is ever actually blocked by it, so
 * every console message it produces is advisory, not a real failure: the
 * dev-mode "missing unsafe-eval" warning (HMR/eval, Chromium- and
 * Firefox-worded differently) and, under enough dev-server traffic, Firefox's
 * own "Prevented too many CSP reports" throttling notice about that same
 * stream. Filtering the whole Content-Security-Policy family is accurate for
 * THIS app's current report-only-only configuration; if the project ever
 * switches to an enforcing CSP header, this filter should be narrowed again.
 */
const BENIGN_CONSOLE_PATTERNS = [
  /Download the React DevTools/i,
  /Content[\s-]Security[\s-]Policy/i,
];

export function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (BENIGN_CONSOLE_PATTERNS.some((pattern) => pattern.test(text))) return;
    errors.push(text);
  });
  return errors;
}
