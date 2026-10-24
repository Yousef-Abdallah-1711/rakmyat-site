import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/security";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminBlogPostEditor } from "@/components/admin/AdminBlogPostEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Post | Rakmyat Blog Admin", robots: { index: false, follow: false } };

// Next.js 16 App Router: params is a Promise
export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  if (!process.env.DATABASE_URL) return <main className="admin-shell"><section className="admin-login"><h1>Admin setup required</h1></section></main>;
  if (!await getAdminSession()) redirect("/admin/login");
  const { id } = await params;
  // Validate UUID format before passing to client component
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) redirect("/admin/blog");
  return (
    <AdminShell>
      <AdminBlogPostEditor postId={id} />
    </AdminShell>
  );
}
