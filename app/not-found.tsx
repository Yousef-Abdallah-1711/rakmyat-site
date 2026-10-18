import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container py-5">
      <h1>Page not found</h1>
      <Link href="/">Return to Iteck</Link>
    </main>
  );
}
