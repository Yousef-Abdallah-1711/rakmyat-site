import type { Metadata } from "next";
import "../globals.css";
import "./admin.css";

export const metadata: Metadata = {
  title: "Rakmyat administration",
  robots: { index: false, follow: false },
  icons: { icon: "/assets/rakmyat/brand/rakmyat-favicon.png" },
};

export default function AdminRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
