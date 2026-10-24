import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/security";
import { AdminBlog } from "@/components/admin/AdminBlog";
import { AdminShell } from "@/components/admin/AdminShell";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata = { title: "Blog | Rakmyat", robots: { index: false, follow: false } };
export default async function AdminBlogPage() {
  if (!process.env.DATABASE_URL) return <main className="admin-shell"><section className="admin-login"><h1>Admin setup required</h1><p>Configure the PostgreSQL database and apply the documented migrations (including 0003_blog.sql) before signing in. No blog data is available in this environment.</p><a href="/admin/login">Go to sign in</a></section></main>;
  if (!await getAdminSession()) redirect("/admin/login");
  return <AdminShell><AdminBlog /></AdminShell>;
}
