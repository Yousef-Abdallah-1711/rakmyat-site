import test from "node:test";
import assert from "node:assert/strict";
import { createPublicSitemap, localizedAlternates, publicRouteMetadata } from "@/lib/seo";
import { resolveIndexableSiteOrigin } from "@/lib/site-url";

test("public site origin requires explicit production indexing and HTTPS", () => {
  assert.equal(resolveIndexableSiteOrigin("https://www.example.test/site", "true", "production"), "https://www.example.test");
  assert.equal(resolveIndexableSiteOrigin("https://www.example.test", "false", "production"), null);
  assert.equal(resolveIndexableSiteOrigin("https://www.example.test", "true", "development"), null);
  assert.equal(resolveIndexableSiteOrigin("http://localhost:5210", "true", "production"), null);
  assert.equal(resolveIndexableSiteOrigin("https://user:pass@example.test", "true", "production"), null);
});

test("localized metadata uses locale-specific canonicals and reciprocal absolute alternates", () => {
  const ar = publicRouteMetadata("ar", "/projects/schooly", "https://www.example.test");
  assert.equal(ar.alternates.canonical, "https://www.example.test/ar/projects/schooly");
  assert.deepEqual(ar.alternates.languages, {
    en: "https://www.example.test/en/projects/schooly",
    ar: "https://www.example.test/ar/projects/schooly",
    "x-default": "https://www.example.test/en/projects/schooly",
  });
  assert.deepEqual(ar.robots, { index: true, follow: true });
});

test("without approved production origin pages stay noindex and do not emit canonicals", () => {
  const result = publicRouteMetadata("en", "/contact", null);
  assert.equal(result.alternates.canonical, undefined);
  assert.deepEqual(result.robots, { index: false, follow: false });
  assert.deepEqual(localizedAlternates("/contact", null), {
    en: "/en/contact", ar: "/ar/contact", "x-default": "/en/contact",
  });
});

test("sitemap lists localized public pages and published projects only", () => {
  const sitemap = createPublicSitemap("https://www.example.test", [
    { slug: "approved", publicationState: "published" },
    { slug: "draft", publicationState: "draft" },
  ]);
  assert.equal(sitemap.length, 16);
  assert.ok(sitemap.some((entry) => entry.url === "https://www.example.test/ar/projects/approved"));
  assert.ok(!sitemap.some((entry) => entry.url.includes("draft")));
  assert.ok(!sitemap.some((entry) => entry.url.includes("admin") || entry.url.includes("api")));
  assert.deepEqual(sitemap[0].alternates?.languages, {
    en: "https://www.example.test/en", ar: "https://www.example.test/ar", "x-default": "https://www.example.test/en",
  });
  assert.deepEqual(createPublicSitemap(null, []), []);
});
