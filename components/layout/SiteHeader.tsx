"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopPromotion } from "@/components/layout/SiteChrome";
import { getLocalizedPath, localeCopy, type Locale } from "@/content/i18n";

type SiteHeaderProps = {
  activePage?: "home" | "about" | "contact" | "portfolio" | "services" | "project";
  transparent?: boolean;
  locale?: Locale;
};

const navigation = [
  { key: "about", path: "about" },
  { key: "services", path: "services" },
  { key: "portfolio", path: "portfolio" },
  { key: "contact", path: "contact" },
] as const;

export function SiteHeader({ activePage, transparent = false, locale = "en" }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const copy = localeCopy[locale];

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
        setMenuOpen(false);
        setDropdownOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && (menuOpen || dropdownOpen)) {
        setMenuOpen(false);
        setDropdownOpen(false);
        (dropdownOpen ? dropdownTriggerRef.current : menuToggleRef.current)?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [dropdownOpen, menuOpen]);

  const navbarClass = `navbar navbar-expand-lg navbar-light${transparent ? " bg-transparent" : ""} style-5`;
  const languageTarget = locale === "en" ? "ar" : "en";

  return (
    <>
      <TopPromotion locale={locale} />
      <nav ref={navRef} className={navbarClass} aria-label={copy.navLabel}>
        <div className="container-fluid">
          <Link className="navbar-brand rakmyat-wordmark" href={getLocalizedPath(locale, "/")} aria-label={`${copy.brand} — ${copy.category}`}>
            <span>{copy.brand}</span>
            {locale === "en" && <span lang="ar" dir="rtl">رقميات</span>}
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
              <li className="nav-item dropdown">
                <button
                  ref={dropdownTriggerRef}
                  className="nav-link dropdown-toggle"
                  type="button"
                  aria-expanded={dropdownOpen}
                  onClick={() => setDropdownOpen((open) => !open)}
                >
                  {copy.morePages}
                </button>
                <ul className={`dropdown-menu${dropdownOpen ? " show" : ""}`}>
                  <li><Link className="dropdown-item" href={getLocalizedPath(locale, "/services/details")}>{copy.serviceDetails}</Link></li>
                  <li><Link className="dropdown-item" href={getLocalizedPath(locale, "/portfolio")}>{copy.portfolio}</Link></li>
                </ul>
              </li>
            </ul>
            <div className="nav-side">
              <div className="d-flex align-items-center">
                <Link className="nav-link me-2" href={getLocalizedPath(languageTarget, pathname)} lang={languageTarget}>
                  {copy.language}
                </Link>
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
