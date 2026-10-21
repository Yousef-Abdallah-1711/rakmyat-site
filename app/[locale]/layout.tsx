import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "رقميات | حلول برمجية للأعمال", template: "%s" },
  description: "نطوّر مواقع وتطبيقات وأنظمة أعمال مخصصة تساعد الشركات على تحسين عملياتها وتجارب عملائها.",
  icons: {
    icon: [{ url: "/assets/rakmyat/brand/rakmyat-favicon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/assets/rakmyat/brand/rakmyat-apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

const stylesheets = [
  "/assets/css/lib/bootstrap-icons.css",
  "/assets/css/lib/bootstrap.min.css",
  "/assets/css/lib/inter.css",
  "/assets/css/lib/all.min.css",
  "/assets/css/lib/animate.css",
  "/assets/css/lib/jquery.fancybox.css",
  "/assets/css/lib/lity.css",
  "/assets/css/lib/swiper.min.css",
  "/assets/css/style.css",
];

export default async function LocaleRootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const language = locale === "ar" ? "ar" : "en";

  return (
    <html lang={language} dir={language === "ar" ? "rtl" : "ltr"}>
      <head>
        {stylesheets.map((href) => <link rel="stylesheet" href={href} key={href} />)}
      </head>
      <body>{children}</body>
    </html>
  );
}
