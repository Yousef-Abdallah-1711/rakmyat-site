import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/security";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminMediaLibraryPage } from "@/components/admin/AdminMediaLibraryPage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Media Library | Rakmyat Admin", robots: { index: false, follow: false } };

export default async function MediaLibraryAdminPage() {
  if (!process.env.DATABASE_URL) return <main className="admin-shell"><section className="admin-login"><h1>Admin setup required</h1><p>Configure the database first.</p></section></main>;
  if (!await getAdminSession()) redirect("/admin/login");
  return (
    <AdminShell>
      <AdminMediaLibraryPage />
    </AdminShell>
  );
}
