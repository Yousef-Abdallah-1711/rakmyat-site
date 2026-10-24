import Link from "next/link";
import type { ReactNode } from "react";
import { getLocalizedPath, localeCopy, type Locale } from "@/content/i18n";

export function TopPromotion({ locale = "en" }: { locale?: Locale }) {
  const copy = localeCopy[locale];
  return (
    <div className="top-navbar style-5" role="region" aria-label={locale === "ar" ? "إعلان الموقع" : "Site announcement"}>
      <div className="container">
        <div className="content text-white">
          <span className="btn sm-butn bg-white py-0 px-2 me-2 fs-10px"><small className="fs-10px">{copy.category}</small></span>
          <img src="/assets/img/icons/nav_icon/imoj_heart.png" alt="" className="icon-15" />{" "}
          <span className="fs-10px op-6">{copy.brand}</span>{" "}
          <Link href={getLocalizedPath(locale, "/contact")} className="fs-10px text-decoration-underline ms-2">{copy.discuss}</Link>
        </div>
      </div>
    </div>
  );
}

export function SiteFooter({ children, bordered = false }: { children: ReactNode; bordered?: boolean }) {
  return <footer className={`style-5${bordered ? " border-top brd-gray" : ""}`}>{children}</footer>;
}

export function FooterContent({ locale = "en" }: { locale?: Locale }) {
  const copy = localeCopy[locale];
  const isAr = locale === "ar";
  const textDir = isAr ? "rtl" : "ltr";
  const textLang = isAr ? "ar" : "en";

  // "Useful links" column — all primary nav pages, real Next.js links
  const usefulLinks: [string, string][] = [
    [copy.home,      "/"],
    [copy.about,     "/about"],
    [copy.services,  "/services"],
    [copy.howWeWork, "/how-we-work"],
    [copy.portfolio, "/portfolio"],
    [copy.contact,   "/contact"],
  ];

  // "Resources" column — same nav set, same real links
  const resourceLinks: [string, string][] = [
    [copy.home,      "/"],
    [copy.about,     "/about"],
    [copy.services,  "/services"],
    [copy.resources, "/how-we-work"],
    [copy.portfolio, "/portfolio"],
    [copy.contact,   "/contact"],
  ];

  return (
    <div className="container">
      <div className="row gx-0 justify-content-between">

        {/* Column 1 — Brand tagline */}
        <div className="col-lg-3 col-sm-6">
          <div className="items">
            <div
              className="title"
              dir={textDir}
              lang={textLang}
              style={{ fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.4 }}
            >
              {copy.footerTitle}
            </div>
            <small
              className="text"
              dir={textDir}
              lang={textLang}
              style={{ color: "var(--rakmyat-muted)" }}
            >
              {copy.footerDescription}
            </small>
            <div className="socail-icons" aria-hidden="true" />
          </div>
        </div>

        {/* Column 2 — Information */}
        <div className="col-lg-3 col-sm-6">
          <div className="items">
            <div className="title" dir={textDir} lang={textLang}>{copy.information}</div>
            <small
              className="text d-block mb-1 rakmyat-info-category"
              dir={textDir}
              lang={textLang}
              style={{ color: "var(--rakmyat-blue)", fontWeight: 600 }}
            >
              {copy.category}
            </small>
            <Link
              href={getLocalizedPath(locale, "/")}
              className="d-block rakmyat-info-brand"
              dir={textDir}
              lang={textLang}
              style={{
                color: "var(--rakmyat-ink)",
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
              }}
            >
              {copy.brand}
            </Link>
          </div>
        </div>

        {/* Column 3 — Useful links */}
        <div className="col-lg-2 col-sm-6">
          <div className="items">
            <div className="title" dir={textDir} lang={textLang}>{copy.usefulLinks}</div>
            <ul>
              {usefulLinks.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={getLocalizedPath(locale, href)}
                    dir={textDir}
                    lang={textLang}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 4 — Resources */}
        <div className="col-lg-2 col-sm-6">
          <div className="items">
            <div className="title" dir={textDir} lang={textLang}>{copy.resources}</div>
            <ul>
              {resourceLinks.map(([label, href]) => (
                <li key={`res-${href}`}>
                  <Link
                    href={getLocalizedPath(locale, href)}
                    dir={textDir}
                    lang={textLang}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Footer bottom bar */}
      <div className="foot">
        <div className="row align-items-center">
          <div className="col-lg-3 col-sm-6">
            <Link
              href={getLocalizedPath(locale, "/")}
              className="logo rakmyat-wordmark rakmyat-wordmark--footer"
              aria-label={`${copy.brand} — ${copy.category}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img src="/assets/rakmyat/brand/rakmyat-mark.webp" alt="" width="36" height="36" />
              <span dir={textDir} lang={textLang}>{copy.brand}</span>
            </Link>
          </div>
          <div className="col-lg-6">
            <small
              className="small"
              dir={textDir}
              lang={textLang}
              style={{ color: "var(--rakmyat-muted)" }}
            >
              {copy.copyright}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
