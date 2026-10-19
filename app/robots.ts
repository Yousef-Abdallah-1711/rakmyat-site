import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  let sitemap: string | undefined;
  if (configuredUrl) {
    try {
      sitemap = new URL("/sitemap.xml", configuredUrl).toString();
    } catch {
      sitemap = undefined;
    }
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(sitemap ? { sitemap } : {}),
  };
}
