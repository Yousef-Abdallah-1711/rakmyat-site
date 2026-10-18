import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iteck - SaaS Technology",
  description: "Iteck eCommerce dashboard and technology solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/img/fav.png" />
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
