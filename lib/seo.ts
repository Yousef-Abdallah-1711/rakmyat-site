import type { MetadataRoute } from "next";

export function localizedAlternates(path: string, origin: string | null) {
  const suffix = path === "/" ? "" : path;
  const en = `/en${suffix}`;
  const ar = `/ar${suffix}`;
  const absolute = (pathname: string) => origin ? new URL(pathname, origin).toString() : pathname;
  return {
    en: absolute(en),
    ar: absolute(ar),
    "x-default": absolute(en),
  };
}

export function publicRouteMetadata(locale: "en" | "ar", path: string, origin: string | null) {
  const suffix = path === "/" ? "" : path;
  const canonicalPath = `/${locale}${suffix}`;
  return {
    alternates: {
      canonical: origin ? new URL(canonicalPath, origin).toString() : undefined,
      languages: localizedAlternates(path, origin),
    },
    robots: origin ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export function createPublicSitemap(
  origin: string | null,
  projects: ReadonlyArray<{ slug: string; publicationState: string }>,
): MetadataRoute.Sitemap {
  if (!origin) return [];
  const paths = ["", "/about", "/services", "/services/details", "/how-we-work", "/portfolio", "/contact"];
  const entries: MetadataRoute.Sitemap = [];
  for (const path of paths) {
    for (const locale of ["en", "ar"] as const) {
      entries.push({
        url: new URL(`/${locale}${path}`, origin).toString(),
        alternates: { languages: { en: new URL(`/en${path}`, origin).toString(), ar: new URL(`/ar${path}`, origin).toString(), "x-default": new URL(`/en${path}`, origin).toString() } },
      });
    }
  }
  for (const project of projects.filter((item) => item.publicationState === "published")) {
    for (const locale of ["en", "ar"] as const) {
      const path = `/projects/${project.slug}`;
      entries.push({
        url: new URL(`/${locale}${path}`, origin).toString(),
        alternates: { languages: { en: new URL(`/en${path}`, origin).toString(), ar: new URL(`/ar${path}`, origin).toString(), "x-default": new URL(`/en${path}`, origin).toString() } },
      });
    }
  }
  return entries;
}
