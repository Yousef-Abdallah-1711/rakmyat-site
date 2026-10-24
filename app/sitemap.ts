import type { MetadataRoute } from "next";
import { portfolioProjects } from "@/content/portfolio";
import { createPublicSitemap, localizedAlternates } from "@/lib/seo";
import { listPublishedBlogSlugs } from "@/lib/server/blog";
import { getIndexableSiteOrigin } from "@/lib/site-url";

// Keep the site origin and indexing gate runtime-configurable.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getIndexableSiteOrigin();
  const entries = createPublicSitemap(origin, portfolioProjects);
  if (!origin || !process.env.DATABASE_URL) return entries;

  try {
    const posts = await listPublishedBlogSlugs();
    const blogPaths = [
      { path: "/blog", lastModified: undefined as string | undefined },
      ...posts.map((post) => ({ path: `/blog/${post.slug}`, lastModified: post.updated_at })),
    ];
    for (const { path, lastModified } of blogPaths) {
      for (const locale of ["en", "ar"] as const) {
        entries.push({
          url: new URL(`/${locale}${path}`, origin).toString(),
          ...(lastModified ? { lastModified } : {}),
          alternates: { languages: localizedAlternates(path, origin) },
        });
      }
    }
  } catch {
    // Keep the static sitemap entries when the blog database is unreachable.
    console.error("sitemap_blog_unavailable");
  }
  return entries;
}
