"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="admin-shell" role="alert">
      <section className="admin-login">
        <h1>Admin page unavailable</h1>
        <p>The request could not be completed. Your session and inquiry data were not included in this message.</p>
        <button type="button" onClick={reset}>Try again</button>
      </section>
    </main>
  );
}
