import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
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
