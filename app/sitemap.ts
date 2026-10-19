import type { MetadataRoute } from "next";

const routes = ["", "/about", "/services", "/services/details", "/portfolio", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configuredUrl) return [];
  let siteUrl: URL;
  try {
    siteUrl = new URL(configuredUrl);
  } catch {
    return [];
  }
  const base = siteUrl.origin;
  return routes.flatMap((route) =>
    (["en", "ar"] as const).map((locale) => ({
      url: new URL(`/${locale}${route}`, base).toString(),
      alternates: {
        languages: {
          en: new URL(`/en${route}`, base).toString(),
          ar: new URL(`/ar${route}`, base).toString(),
        },
      },
    })),
  );
}
