import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rakmyat | Software house",
  description: "Rakmyat is a software house.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-rakmyat-locale") === "ar" ? "ar" : "en";
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <link rel="icon" href="data:," />
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
