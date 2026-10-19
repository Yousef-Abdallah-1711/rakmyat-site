"use client";

import { localeCopy, type Locale } from "@/content/i18n";

export function ScrollToTop({ locale = "en" }: { locale?: Locale }) {
  return (
    <a
      href="#"
      className="to_top bg-gray rounded-circle icon-40 d-inline-flex align-items-center justify-content-center"
      aria-label={localeCopy[locale].backToTop}
      onClick={(event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <i className="bi bi-chevron-up fs-6 text-dark" aria-hidden="true" />
    </a>
  );
}
