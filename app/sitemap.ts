import type { MetadataRoute } from "next";
import { portfolioProjects } from "@/content/portfolio";

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
  const mainRoutes = routes.flatMap((route) =>
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
  const projectRoutes = portfolioProjects
    .filter((project) => project.publicationState === "published")
    .flatMap((project) =>
      (["en", "ar"] as const).map((locale) => ({
        url: new URL(`/${locale}/projects/${project.slug}`, base).toString(),
        alternates: {
          languages: {
            en: new URL(`/en/projects/${project.slug}`, base).toString(),
            ar: new URL(`/ar/projects/${project.slug}`, base).toString(),
          },
        },
      })),
    );
  return [...mainRoutes, ...projectRoutes];
}
