import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/security";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminBlogPostEditor } from "@/components/admin/AdminBlogPostEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "New Post | Rakmyat Blog Admin", robots: { index: false, follow: false } };

export default async function NewBlogPostPage() {
  if (!process.env.DATABASE_URL) return <main className="admin-shell"><section className="admin-login"><h1>Admin setup required</h1><p>Configure the database first.</p></section></main>;
  if (!await getAdminSession()) redirect("/admin/login");
  return (
    <AdminShell>
      <AdminBlogPostEditor />
    </AdminShell>
  );
}
