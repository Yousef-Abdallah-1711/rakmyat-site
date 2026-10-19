import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/security";
import { AdminInquiries } from "@/components/admin/AdminInquiries";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata = { title: "Inquiries | Rakmyat", robots: { index: false, follow: false } };
export default async function AdminInquiriesPage() {
  if (!process.env.DATABASE_URL) return <main className="admin-shell"><section className="admin-login"><h1>Admin setup required</h1><p>Configure the PostgreSQL database and apply the documented migration before signing in. No inquiry data is available in this environment.</p><a href="/admin/login">Go to sign in</a></section></main>;
  if (!await getAdminSession()) redirect("/admin/login");
  return <main className="admin-shell"><AdminInquiries /></main>;
}
