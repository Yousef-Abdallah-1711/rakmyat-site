"use client";

export function ScrollToTop() {
  return (
    <a
      href="#"
      className="to_top bg-gray rounded-circle icon-40 d-inline-flex align-items-center justify-content-center"
      aria-label="Back to top"
      onClick={(event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <i className="bi bi-chevron-up fs-6 text-dark" />
    </a>
  );
}
