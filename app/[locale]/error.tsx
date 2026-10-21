"use client";

import { usePathname } from "next/navigation";

export default function LocalizedError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const isArabic = usePathname().startsWith("/ar");

  return (
    <main className="container py-5 text-center" role="alert" dir={isArabic ? "rtl" : "ltr"}>
      <h1>{isArabic ? "حدث خطأ غير متوقع" : "Something went wrong"}</h1>
      <p>{isArabic ? "تعذر تحميل هذه الصفحة. يمكنك المحاولة مرة أخرى." : "This page could not be loaded. Please try again."}</p>
      <button className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold text-light" onClick={reset}>
        {isArabic ? "إعادة المحاولة" : "Try again"}
      </button>
    </main>
  );
}
