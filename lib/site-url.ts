/** Resolve the canonical origin only for an explicitly enabled production deployment. */
export function resolveIndexableSiteOrigin(
  siteUrl: string | undefined,
  indexingEnabled: string | undefined,
  nodeEnv: string | undefined,
): string | null {
  if (indexingEnabled !== "true" || nodeEnv !== "production" || !siteUrl) return null;
  try {
    const url = new URL(siteUrl);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    if (url.hostname === "localhost" || url.hostname.endsWith(".localhost") || url.hostname.endsWith(".local")) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function getIndexableSiteOrigin(): string | null {
  return resolveIndexableSiteOrigin(
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.ROBOTS_INDEXING_ENABLED,
    process.env.NODE_ENV,
  );
}
