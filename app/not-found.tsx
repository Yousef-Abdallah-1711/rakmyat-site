import Link from "next/link";
import { headers } from "next/headers";
import { localeCopy } from "@/content/i18n";

export default async function NotFound() {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-rakmyat-locale") === "ar" ? "ar" : "en";
  const copy = localeCopy[locale];
  return (
    <main className="container py-5">
      <h1>{copy.notFoundTitle}</h1>
      <p>{copy.notFoundText}</p>
      <Link href={`/${locale}`}>{copy.home}</Link>
    </main>
  );
}
