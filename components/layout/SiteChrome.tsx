import Link from "next/link";
import type { ReactNode } from "react";
import { getLocalizedPath, localeCopy, type Locale } from "@/content/i18n";

export function TopPromotion({ locale = "en" }: { locale?: Locale }) {
  const copy = localeCopy[locale];
  return (
    <div className="top-navbar style-5">
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
  const links = [
    [copy.home, "/"],
    [copy.about, "/about"],
    [copy.services, "/services"],
    [copy.portfolio, "/portfolio"],
    [copy.contact, "/contact"],
  ] as const;

  return (
    <div className="container">
      <div className="row gx-0 justify-content-between">
        <div className="col-lg-3 col-sm-6">
          <div className="items">
            <div className="title">{copy.footerTitle}</div>
            <small className="text">{copy.footerDescription}</small>
            <div className="socail-icons" aria-hidden="true" />
          </div>
        </div>
        <div className="col-lg-3 col-sm-6">
          <div className="items">
            <div className="title">{copy.information}</div>
            <small className="text mb-10 d-block">{copy.category}</small>
            <small className="text d-block">{copy.brand} / {copy.brandArabic}</small>
          </div>
        </div>
        <div className="col-lg-2 col-sm-6">
          <div className="items">
            <div className="title">{copy.usefulLinks}</div>
            <ul>{links.slice(0, 3).map(([label, href]) => <li key={href}><Link href={getLocalizedPath(locale, href)}>{label}</Link></li>)}</ul>
          </div>
        </div>
        <div className="col-lg-2 col-sm-6">
          <div className="items">
            <div className="title">{copy.resources}</div>
            <ul>{links.slice(3).map(([label, href]) => <li key={href}><Link href={getLocalizedPath(locale, href)}>{label}</Link></li>)}</ul>
          </div>
        </div>
      </div>
      <div className="foot">
        <div className="row">
          <div className="col-lg-3 col-sm-6">
            <div className="logo rakmyat-wordmark rakmyat-wordmark--footer" aria-label={`${copy.brand} — ${copy.category}`}>
              <img src="/assets/rakmyat/brand/rakmyat-mark.webp" alt="" width="36" height="36" />
              <span>{copy.brand}</span>{locale === "en" && <span lang="ar" dir="rtl">رقميات</span>}
            </div>
          </div>
          <div className="col-lg-6"><small className="small">{copy.copyright}</small></div>
        </div>
      </div>
    </div>
  );
}
