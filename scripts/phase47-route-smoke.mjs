const base = (process.env.BASE_URL || "http://127.0.0.1:5214").replace(/\/$/, "");
const routes = [
  "/en", "/en/about", "/en/services", "/en/services/details", "/en/how-we-work", "/en/portfolio", "/en/contact",
  "/en/projects/schooly", "/en/projects/nora-store", "/en/projects/edtech-platform", "/en/projects/live-workshop", "/en/projects/eduflow", "/en/projects/legal-translation", "/en/projects/gc-hardware", "/en/projects/concord-crm", "/en/projects/product-scraper",
  "/ar", "/ar/about", "/ar/services", "/ar/services/details", "/ar/how-we-work", "/ar/portfolio", "/ar/contact",
  "/ar/projects/schooly", "/ar/projects/nora-store", "/ar/projects/edtech-platform", "/ar/projects/live-workshop", "/ar/projects/eduflow", "/ar/projects/legal-translation", "/ar/projects/gc-hardware", "/ar/projects/concord-crm", "/ar/projects/product-scraper",
];
const failures = [];
for (const route of routes) {
  const response = await fetch(`${base}${route}`);
  const html = await response.text();
  const locale = route.startsWith("/ar") ? "ar" : "en";
  if (response.status !== 200 || !html.includes(`lang="${locale}"`) || !html.includes("<h1")) {
    failures.push({ route, status: response.status, locale, hasH1: html.includes("<h1") });
  }
}
const result = { base, total: routes.length, passed: routes.length - failures.length, failures };
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
