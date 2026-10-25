"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./AdminBlog.module.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Status = "draft" | "published" | "archived";
type Option = { id: string; slug: string; name_en: string; name_ar: string };
type ListPost = {
  id: string; slug: string; title_en: string; title_ar: string; status: Status; locale_primary: "en" | "ar"; author_name: string;
  category_id: string | null; post_type_id: string | null; published_at: string | null; created_at: string; updated_at: string; revision: number; deleted_at: string | null;
  category_name_en?: string; category_name_ar?: string; post_type_name_en?: string; post_type_name_ar?: string;
};
type ListPayload = { posts: ListPost[]; metrics: { total: number; published: number; drafts: number; trashed: number }; page: number; pageSize: number; total: number; totalPages: number };

const statuses: [Status, string][] = [["draft", "Draft · مسودة"], ["published", "Published · منشور"], ["archived", "Archived · مؤرشف"]];
const statusLabel: Record<Status, string> = { draft: "Draft · مسودة", published: "Published · منشور", archived: "Archived · مؤرشف" };

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString() : "—";
}

export function AdminBlog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<ListPayload | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<Option[]>([]);
  const [busy, setBusy] = useState(false);
  const [listError, setListError] = useState("");
  const [listMessage, setListMessage] = useState("");

  // The editor sends the user back here with ?notice=post-deleted after a delete; show it once and clear the URL.
  const notice = searchParams.get("notice");
  useEffect(() => {
    if (notice !== "post-deleted") return;
    setListMessage("Post deleted. · تم حذف المنشور.");
    router.replace("/admin/blog");
  }, [notice, router]);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/blog/categories", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) { router.replace("/admin/login"); return; }
        if (!response.ok) throw new Error("lookup_failed");
        const payload = (await response.json()) as { categories: Option[] };
        if (active) setCategories(payload.categories);
      })
      .catch(() => {
        if (active) setListError("Unable to load blog options. Check database configuration. · تعذر تحميل خيارات المدونة.");
      });
    return () => { active = false; };
  }, [router]);

  const loadPosts = useCallback(async () => {
    setBusy(true);
    try {
      const params = new URLSearchParams({ status: statusFilter, category: categoryFilter, q: query, page: String(page) });
      const response = await fetch(`/api/admin/blog/posts?${params}`, { cache: "no-store" });
      if (response.status === 401) { router.replace("/admin/login"); return; }
      if (!response.ok) throw new Error("Unable to load posts. Check database configuration. · تعذر تحميل المنشورات.");
      const payload = (await response.json()) as ListPayload;
      setData(payload);
      setPage(payload.page);
      setListError("");
    } catch (error) {
      setListError(error instanceof Error ? error.message : "Unable to load posts.");
    } finally {
      setBusy(false);
    }
  }, [query, statusFilter, categoryFilter, page, router]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  // Navigation and sign-out live in the AdminShell sidebar, so this component renders only its content.
  return <section className="admin-dashboard">
    <div className="admin-main">
      <div className="admin-heading">
        <div><p>Private workspace</p><h1>Blog posts · المدونة</h1></div>
        <div className={styles.headingActions}>
          <Button variant="outline" onClick={() => void loadPosts()} disabled={busy}>Refresh</Button>
          <Button onClick={() => router.push("/admin/blog/posts/new")}>New Post · منشور جديد</Button>
        </div>
      </div>

      <div className="admin-metrics">
        <article><span>All posts</span><strong>{data?.metrics.total ?? "—"}</strong></article>
        <article><span>Published</span><strong>{data?.metrics.published ?? "—"}</strong></article>
        <article><span>Drafts</span><strong>{data?.metrics.drafts ?? "—"}</strong></article>
        <article><span>Trash</span><strong>{data?.metrics.trashed ?? "—"}</strong></article>
      </div>

      <div className="admin-filters">
        <label>Search · بحث<Input value={query} onChange={(event) => { setPage(1); setQuery(event.target.value); }} placeholder="Title or slug" /></label>
        <label>Status · الحالة<select value={statusFilter} onChange={(event) => { setPage(1); setStatusFilter(event.target.value); }}>
          <option value="all">All statuses · الكل</option>
          {statuses.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          <option value="trashed">Trash · المهملات</option>
        </select></label>
        <label>Category · التصنيف<select value={categoryFilter} onChange={(event) => { setPage(1); setCategoryFilter(event.target.value); }}>
          <option value="all">All categories · الكل</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name_en} · {category.name_ar}</option>)}
        </select></label>
      </div>

      {listError && <p role="alert" className="admin-notice">{listError}</p>}
      {listMessage && <p role="status" className={styles.success}>{listMessage}</p>}
      {busy && !data && <p>Loading posts… · جاري التحميل…</p>}
      {data?.posts.length === 0 && <p className="admin-empty">No posts match these filters. · لا توجد منشورات مطابقة.</p>}

      {data && data.posts.length > 0 && <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr><th scope="col">Title · العنوان</th><th scope="col">Category · التصنيف</th><th scope="col">Post type · النوع</th><th scope="col">Status · الحالة</th><th scope="col">Published · النشر</th></tr></thead>
          <tbody>
            {data.posts.map((post) => <tr key={post.id}>
              <td><button type="button" className={styles.rowButton} onClick={() => router.push(`/admin/blog/posts/${post.id}/edit`)}>
                <strong>{post.title_en}</strong>
                <span dir="rtl" lang="ar">{post.title_ar}</span>
                <small>{post.slug}</small>
              </button></td>
              <td>{post.category_name_en ? <>{post.category_name_en}<br /><small dir="rtl" lang="ar" className={styles.muted}>{post.category_name_ar}</small></> : "—"}</td>
              <td>{post.post_type_name_en ?? "—"}</td>
              <td><Badge variant={post.status}>{statusLabel[post.status]}</Badge></td>
              <td>{formatDate(post.published_at)}</td>
            </tr>)}
          </tbody>
        </table>
      </div>}

      {data && <nav className="admin-pagination" aria-label="Blog post pages">
        <p aria-live="polite">Page {data.page} of {data.totalPages} · {data.total} posts</p>
        <div>
          <Button type="button" variant="outline" size="sm" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={busy || page <= 1} aria-label="Previous blog page">Previous · السابق</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setPage((current) => Math.min(data.totalPages, current + 1))} disabled={busy || page >= data.totalPages} aria-label="Next blog page">Next · التالي</Button>
        </div>
      </nav>}
    </div>
  </section>;
}
