"use client";
import { useRouter } from "next/navigation";

export function AdminSignOutButton() {
  const router = useRouter();

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return <button type="button" className="admin-signout-btn" onClick={() => void signOut()}>Sign out</button>;
}
