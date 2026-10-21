import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "رقميات | حلول برمجية للأعمال",
  description: "نطوّر مواقع وتطبيقات وأنظمة أعمال مخصصة تساعد الشركات على تحسين عملياتها وتجارب عملائها.",
  icons: {
    icon: [{ url: "/assets/rakmyat/brand/rakmyat-favicon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/assets/rakmyat/brand/rakmyat-apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function AliasRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="stylesheet" href="/assets/css/lib/bootstrap-icons.css" />
        <link rel="stylesheet" href="/assets/css/lib/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/lib/inter.css" />
        <link rel="stylesheet" href="/assets/css/lib/all.min.css" />
        <link rel="stylesheet" href="/assets/css/lib/animate.css" />
        <link rel="stylesheet" href="/assets/css/lib/jquery.fancybox.css" />
        <link rel="stylesheet" href="/assets/css/lib/lity.css" />
        <link rel="stylesheet" href="/assets/css/lib/swiper.min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
