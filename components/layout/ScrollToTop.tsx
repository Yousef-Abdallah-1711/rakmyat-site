"use client";

import { useEffect, useState } from "react";
import { localeCopy, type Locale } from "@/content/i18n";

export function ScrollToTop({ locale = "en" }: { locale?: Locale }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#"
      className={`to_top rounded-circle icon-40 d-inline-flex align-items-center justify-content-center${visible ? " show" : ""}`}
      aria-label={localeCopy[locale].backToTop}
      style={{ background: "linear-gradient(to right, #0c3df4 0%, #02b5ff 100%)", color: "#fff" }}
      onClick={(event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <i className="bi bi-chevron-up fs-6" aria-hidden="true" style={{ color: "#fff" }} />
    </a>
  );
}
