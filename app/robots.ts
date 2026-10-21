import type { MetadataRoute } from "next";
import { getIndexableSiteOrigin } from "@/lib/site-url";

// Read indexing policy at runtime so the production image can be built without
// an approved domain and remain non-indexable in staging.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const siteOrigin = getIndexableSiteOrigin();
  if (!siteOrigin) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] },
    sitemap: new URL("/sitemap.xml", siteOrigin).toString(),
  };
}
