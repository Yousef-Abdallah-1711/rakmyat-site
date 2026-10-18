"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopPromotion } from "@/components/layout/SiteChrome";
import { homeMenu, mainNavigation, pageMenu } from "@/content/site";

type SiteHeaderProps = {
  activePage?:
    "home" | "about" | "contact" | "portfolio" | "services" | "project";
  transparent?: boolean;
};

export function SiteHeader({
  activePage,
  transparent = false,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    setMenuOpen(false);
    setDropdown(null);
  }, [pathname]);
  const isHome = activePage === "home";
  const navbarClass = `navbar navbar-expand-lg navbar-light${transparent ? " bg-transparent" : ""} style-5`;

  function toggleDropdown(name: string) {
    setDropdown((current) => (current === name ? null : name));
  }

  return (
    <>
      <TopPromotion />
      <nav className={navbarClass}>
        <div className="container-fluid">
          <Link className="navbar-brand" href="/">
            <img src="/assets/img/logo_home5.png" alt="Iteck" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarSupportedContent"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div
            className={`collapse navbar-collapse${menuOpen ? " show" : ""}`}
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav m-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <button
                  className={`nav-link dropdown-toggle${isHome ? " active" : ""}`}
                  type="button"
                  aria-expanded={dropdown === "homes"}
                  onClick={() => toggleDropdown("homes")}
                >
                  Homes
                </button>
                <ul
                  className={`dropdown-menu${dropdown === "homes" ? " show" : ""}`}
                >
                  {(isHome ? homeMenu : homeMenu.slice(1, 9)).map(
                    ({ label, href }) => (
                      <li key={label}>
                        <Link className="dropdown-item" href={href}>
                          {label}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </li>
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle"
                  type="button"
                  aria-expanded={dropdown === "pages"}
                  onClick={() => toggleDropdown("pages")}
                >
                  pages
                </button>
                <ul
                  className={`dropdown-menu${dropdown === "pages" ? " show" : ""}`}
                >
                  {pageMenu.map(({ label, href }) => (
                    <li key={label}>
                      <Link className="dropdown-item" href={href}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              {mainNavigation.map(({ label, href }) => (
                <li className="nav-item" key={label}>
                  <Link
                    className={`nav-link${label === activePage || (label === "portfolio" && activePage === "portfolio") ? " active" : ""}`}
                    href={href}
                  >
                    {label}
                    {label === "blog" && (
                      <small className="fs-10px icon-20 rounded-pill bg-blue5 text-white fw-bold px-3 ms-2 d-inline-flex justify-content-center align-items-center">
                        3
                      </small>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="nav-side">
              <div className="d-flex align-items-center">
                <span className="nav-item">
                  <Link className="nav-link" href="/contact">
                    <i className="bi bi-person fs-5 me-2" />
                    sign in
                  </Link>
                </span>
                <Link
                  href="/contact"
                  className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold"
                >
                  <span>
                    Start Free Trial <i className="bi bi-arrow-right ms-1" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
