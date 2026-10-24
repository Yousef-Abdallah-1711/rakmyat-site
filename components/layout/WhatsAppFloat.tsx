/**
 * WhatsAppFloat — production-ready floating contact button.
 *
 * Intentionally a Server Component (no "use client"):
 * - Renders on the server → no hydration, zero JS bundle cost
 * - All animation/hover CSS lives in app/globals.css → cached by the browser
 *   after the first visit and never re-downloaded on navigation
 * - No useState / useEffect / re-renders ever
 * - SSR-safe: the element is in the HTML on first paint, no layout shift
 */

const WHATSAPP_NUMBER = "201023516495"; // Egypt: 010 23516495 → +20 10 23516495

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float"
      aria-label="تواصل معنا عبر واتساب"
    >
      {/* WhatsApp brand icon — inline SVG, no external request */}
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.613 4.64 1.773 6.653L2.667 29.333l6.88-1.747A13.267 13.267 0 0 0 16.004 29.333C23.36 29.333 29.333 23.36 29.333 16S23.36 2.667 16.004 2.667zm0 24a10.587 10.587 0 0 1-5.413-1.48l-.387-.24-4.08 1.04 1.067-3.907-.267-.413A10.587 10.587 0 0 1 5.333 16c0-5.893 4.787-10.667 10.667-10.667S26.667 10.107 26.667 16 21.893 26.667 16.004 26.667zm5.84-7.973c-.32-.16-1.893-.92-2.187-1.027-.293-.107-.507-.16-.72.16-.213.32-.827 1.027-1.013 1.24-.187.213-.373.24-.693.08-.32-.16-1.347-.493-2.56-1.573-.947-.84-1.587-1.88-1.773-2.2-.187-.32-.02-.493.14-.653.147-.147.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.26-.627-.52-.547-.72-.56-.187-.013-.4-.013-.613-.013-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.253 3.44 5.453 4.827.76.333 1.36.533 1.827.68.76.24 1.453.213 2 .133.613-.093 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z" />
      </svg>
      <span className="wa-float-tooltip" aria-hidden="true">واتساب</span>
    </a>
  );
}
