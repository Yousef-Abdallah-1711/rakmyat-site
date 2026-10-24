"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const router = useRouter(); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false); const [retryIn, setRetryIn] = useState(0);
  // Counts down the Retry-After value returned with a 429, one second at a time.
  useEffect(() => {
    if (retryIn <= 0) return;
    const timer = window.setTimeout(() => setRetryIn((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [retryIn]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const result = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      if (result.status === 429) {
        const seconds = Number.parseInt(result.headers.get("Retry-After") ?? "", 10);
        if (Number.isFinite(seconds) && seconds > 0) setRetryIn(seconds);
        else setMessage("Too many attempts. Wait and try again.");
        return;
      }
      if (!result.ok) throw new Error(result.status === 503 ? "Admin sign-in is unavailable until the database is configured." : "Email or password is incorrect.");
      setPassword(""); router.replace("/admin/inquiries"); router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to sign in."); }
    finally { setBusy(false); }
  }
  const shownMessage = retryIn > 0 ? `Too many attempts. Try again in ${retryIn} ${retryIn === 1 ? "second" : "seconds"}.` : message;
  return <section className="admin-login"><img src="/assets/rakmyat/brand/rakmyat-mark.webp" alt="" width="42" height="42"/><h1>Inquiry administration</h1><p>Sign in with an account provisioned by the server operator.</p><form onSubmit={submit}>
    <label htmlFor="admin-email">Email</label><input id="admin-email" type="email" autoComplete="username" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)}/>
    <label htmlFor="admin-password">Password</label><input id="admin-password" type="password" autoComplete="current-password" required maxLength={200} value={password} onChange={(event) => setPassword(event.target.value)}/>
    <button type="submit" disabled={busy || retryIn > 0}>{busy ? "Signing in…" : "Sign in"}</button><p role="alert">{shownMessage}</p>
  </form><small>There is no public registration or default account.</small></section>;
}
