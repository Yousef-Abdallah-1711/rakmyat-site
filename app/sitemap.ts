import type { MetadataRoute } from "next";
import { portfolioProjects } from "@/content/portfolio";
import { createPublicSitemap } from "@/lib/seo";
import { getIndexableSiteOrigin } from "@/lib/site-url";

// Keep the site origin and indexing gate runtime-configurable.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  return createPublicSitemap(getIndexableSiteOrigin(), portfolioProjects);
}
