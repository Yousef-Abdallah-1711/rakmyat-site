import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  deploymentId: process.env.NEXT_DEPLOYMENT_ID || undefined,
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  images: { minimumCacheTTL: 86400, qualities: [75, 84] },
  async headers() {
    const securityHeaders = [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        // Observe policy violations in local/staging browsers before considering enforcement.
        { key: "Content-Security-Policy-Report-Only", value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'" },
    ];
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/home-saas-technology.html", destination: "/" },
      { source: "/page-about-5.html", destination: "/about" },
      { source: "/page-contact-5.html", destination: "/contact" },
      { source: "/page-portfolio-5.html", destination: "/portfolio" },
      { source: "/page-services-5.html", destination: "/services" },
      {
        source: "/page-services-details-5.html",
        destination: "/services/details",
      },
      {
        source: "/page-single-project-5.html",
        destination: "/projects/notero",
      },
    ];
  },
};

export default nextConfig;
