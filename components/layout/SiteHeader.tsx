"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopPromotion } from "@/components/layout/SiteChrome";
import { getLocalizedPath, localeCopy, type Locale } from "@/content/i18n";

type SiteHeaderProps = {
  activePage?: "home" | "about" | "contact" | "portfolio" | "services" | "howWeWork" | "project" | "blog";
  transparent?: boolean;
  locale?: Locale;
};

const navigation = [
  { key: "home", path: "" },
  { key: "about", path: "about" },
  { key: "services", path: "services" },
  { key: "howWeWork", path: "how-we-work" },
  { key: "portfolio", path: "portfolio" },
  { key: "blog", path: "blog" },
  { key: "contact", path: "contact" },
] as const;

function LanguageFlag({ locale }: { locale: Locale }) {
  if (locale === "en") {
    return (
      <svg className="language-flag" viewBox="0 0 24 16" aria-hidden="true" focusable="false">
        <rect width="24" height="16" fill="#012169" />
        <path d="M0 0 24 16M24 0 0 16" stroke="#fff" strokeWidth="4" />
        <path d="M0 0 24 16M24 0 0 16" stroke="#c8102e" strokeWidth="1.5" />
        <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="6" />
        <path d="M12 0v16M0 8h24" stroke="#c8102e" strokeWidth="3" />
        <rect x=".5" y=".5" width="23" height="15" fill="none" stroke="#d8d8d8" />
      </svg>
    );
  }

  return (
    <svg className="language-flag" viewBox="0 0 24 16" aria-hidden="true" focusable="false">
      <rect width="24" height="5.34" fill="#ce1126" />
      <rect y="5.33" width="24" height="5.34" fill="#fff" />
      <rect y="10.66" width="24" height="5.34" fill="#000" />
      <path d="M6 7.1 9.2 6.2 11.1 7 12 5.8 12.9 7l1.9-.8 3.2.9-2.5 1.1.5 1.1-3.1-.5L12 10l-.9-1.2-3.1.5.5-1.1z" fill="#c09300" />
      <rect x=".5" y=".5" width="23" height="15" fill="none" stroke="#d8d8d8" />
    </svg>
  );
}

export function SiteHeader({ activePage, transparent = false, locale = "en" }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchSuffix, setSearchSuffix] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const languageSwitcherRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const copy = localeCopy[locale];

  useEffect(() => {
    setMenuOpen(false);
    if (languageSwitcherRef.current) languageSwitcherRef.current.open = false;
    setSearchSuffix(window.location.search);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [pathname, locale]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && languageSwitcherRef.current?.open) {
        languageSwitcherRef.current.open = false;
        languageSwitcherRef.current.querySelector("summary")?.focus();
        return;
      }
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const navbarClass = `navbar navbar-expand-xl navbar-light${transparent ? " bg-transparent" : ""} style-5`;
  const languageTarget = locale === "en" ? "ar" : "en";
  const languagePath = (["/en", "/ar", "/en/about", "/ar/about", "/en/services", "/ar/services", "/en/services/details", "/ar/services/details", "/en/how-we-work", "/ar/how-we-work", "/en/portfolio", "/ar/portfolio", "/en/blog", "/ar/blog", "/en/contact", "/ar/contact"].includes(pathname) || /^\/(en|ar)\/projects\/[a-z0-9-]+$/.test(pathname) || /^\/(en|ar)\/blog\/[a-z0-9-]+$/.test(pathname))
    ? getLocalizedPath(languageTarget, pathname)
    : getLocalizedPath(languageTarget, "/contact");
  const currentLanguagePath = (["/en", "/ar", "/en/about", "/ar/about", "/en/services", "/ar/services", "/en/services/details", "/ar/services/details", "/en/how-we-work", "/ar/how-we-work", "/en/portfolio", "/ar/portfolio", "/en/blog", "/ar/blog", "/en/contact", "/ar/contact"].includes(pathname) || /^\/(en|ar)\/projects\/[a-z0-9-]+$/.test(pathname) || /^\/(en|ar)\/blog\/[a-z0-9-]+$/.test(pathname))
    ? getLocalizedPath(locale, pathname)
    : getLocalizedPath(locale, "/contact");
  const localizedHref = `${languagePath}${searchSuffix}`;

  return (
    <>
      <TopPromotion locale={locale} />
      <nav ref={navRef} className={navbarClass} aria-label={copy.navLabel}>
        <div className="container-fluid">
          <Link className="navbar-brand rakmyat-wordmark" href={getLocalizedPath(locale, "/")} aria-label={`${copy.brand} — ${copy.category}`}>
            <img src="/assets/rakmyat/brand/rakmyat-mark.webp" alt="" width="34" height="34" />
            <span>{copy.brand}</span>
          </Link>
          <button
            ref={menuToggleRef}
            className="navbar-toggler"
            type="button"
            aria-controls="navbarSupportedContent"
            aria-expanded={menuOpen}
            aria-label={copy.menuLabel}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse${menuOpen ? " show" : ""}`} id="navbarSupportedContent">
            <ul className="navbar-nav m-auto mb-2 mb-lg-0">
              {navigation.map(({ key, path }) => (
                <li className="nav-item" key={key}>
                  <Link
                    className={`nav-link${activePage === key ? " active" : ""}`}
                    href={getLocalizedPath(locale, `/${path}`)}
                    aria-current={activePage === key ? "page" : undefined}
                  >
                    {copy[key]}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="nav-side">
              <div className="d-flex align-items-center">
                <details ref={languageSwitcherRef} className="language-switcher">
                  <summary>
                    <LanguageFlag locale={locale} />
                    <span className="language-code" dir="ltr">{locale.toUpperCase()}</span>{" "}
                    <span className="language-current-label" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>{locale === "en" ? "English" : "العربية"}</span>
                    <i className="bi bi-chevron-down" aria-hidden="true" />
                  </summary>
                  <div className="language-switcher-menu" aria-label={locale === "en" ? "Choose language" : "اختر اللغة"}>
                    <Link href={locale === "en" ? `${currentLanguagePath}${searchSuffix}` : localizedHref} lang="en" aria-current={locale === "en" ? "page" : undefined}>
                      <LanguageFlag locale="en" /><span className="language-code" dir="ltr">EN</span><span className="language-option-label" lang="en" dir="ltr">English</span>{locale === "en" && <small>Current</small>}
                    </Link>
                    <Link href={locale === "ar" ? `${currentLanguagePath}${searchSuffix}` : localizedHref} lang="ar" aria-current={locale === "ar" ? "page" : undefined}>
                      <LanguageFlag locale="ar" /><span className="language-code" dir="ltr">AR</span><span className="language-option-label" lang="ar" dir="rtl">العربية</span>{locale === "ar" && <small>الحالية</small>}
                    </Link>
                  </div>
                </details>
                <Link href={getLocalizedPath(locale, "/contact")} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold">
                  <span>{copy.discuss} <i className="bi bi-arrow-right ms-1" aria-hidden="true" /></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
