import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container py-5">
      <h1>Page not found <span lang="ar" dir="rtl">/ الصفحة غير موجودة</span></h1>
      <p>
        The page you requested is unavailable. <span lang="ar" dir="rtl">الصفحة التي طلبتها غير متاحة.</span>
      </p>
      <nav aria-label="Home pages">
        <Link href="/en">English home</Link>{" · "}
        <Link href="/ar" lang="ar" dir="rtl">الصفحة الرئيسية</Link>
      </nav>
    </main>
  );
}
