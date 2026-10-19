import { AdminLogin } from "@/components/admin/AdminLogin";
export const dynamic = "force-dynamic";
export const metadata = { title: "Admin sign in | Rakmyat", robots: { index: false, follow: false } };
export default function AdminLoginPage() { return <main className="admin-shell"><AdminLogin /></main>; }
