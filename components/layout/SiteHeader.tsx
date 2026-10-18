"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopPromotion } from "@/components/layout/SiteChrome";
import {
  homeMenu,
  mainNavigation,
  pageMenu,
  siteSettings,
} from "@/content/site";

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
  const navRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    setMenuOpen(false);
    setDropdown(null);
  }, [pathname]);
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
        setDropdown(null);
        setMenuOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const wasOpen = menuOpen || dropdown !== null;
        setMenuOpen(false);
        setDropdown(null);
        if (wasOpen) {
          (dropdown !== null ? dropdownTriggerRef.current : menuToggleRef.current)?.focus();
        }
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [dropdown, menuOpen]);
  const isHome = activePage === "home";
  const navbarClass = `navbar navbar-expand-lg navbar-light${transparent ? " bg-transparent" : ""} style-5`;

  function toggleDropdown(name: string, trigger: HTMLButtonElement) {
    dropdownTriggerRef.current = trigger;
    setDropdown((current) => (current === name ? null : name));
  }

  return (
    <>
      <TopPromotion />
      <nav ref={navRef} className={navbarClass} aria-label="Main navigation">
        <div className="container-fluid">
          <Link className="navbar-brand" href="/">
            <img src={siteSettings.headerLogo} alt={siteSettings.name} />
          </Link>
          <button
            ref={menuToggleRef}
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
                  onClick={(event) => toggleDropdown("homes", event.currentTarget)}
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
                  onClick={(event) => toggleDropdown("pages", event.currentTarget)}
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
