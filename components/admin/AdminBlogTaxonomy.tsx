"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./AdminBlog.module.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Category = {
  id: string; slug: string; name_en: string; name_ar: string; description_en: string; description_ar: string; created_at: string; updated_at: string;
};
type Tag = { id: string; slug: string; name_en: string; name_ar: string; created_at: string };
type PostType = { id: string; slug: string; name_en: string; name_ar: string; created_at: string };
type CategoryDraft = { name_en: string; name_ar: string; description_en: string; description_ar: string };
type TagDraft = { name_en: string; name_ar: string };
type NewCategory = CategoryDraft & { slug: string };
type NewTag = TagDraft & { slug: string };
type SendResult<T> = { ok: true; data: T } | { ok: false; error: string };

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const jsonHeaders = { "Content-Type": "application/json" };
const emptyCategory: NewCategory = { slug: "", name_en: "", name_ar: "", description_en: "", description_ar: "" };
const emptyTag: NewTag = { slug: "", name_en: "", name_ar: "" };
const errorMessages: Record<string, string> = {
  slug_taken: "This slug is already in use. · هذا الرابط المختصر مستخدم بالفعل.",
  invalid_fields: "Some fields are invalid. · بعض الحقول غير صالحة.",
  origin_rejected: "The request was rejected. Reload the page and try again. · أعد تحميل الصفحة وحاول مجددًا.",
  payload_too_large: "The content is too large. · المحتوى كبير جدًا.",
  not_found: "This item no longer exists. Reload the page. · هذا العنصر لم يعد موجودًا. أعد تحميل الصفحة.",
  network: "Network error. Try again. · خطأ في الشبكة. حاول مرة أخرى.",
};

function errorText(code: string | undefined) {
  return errorMessages[code ?? ""] ?? "Could not save. Check database configuration and try again. · تعذر الحفظ. تحقق من إعداد قاعدة البيانات.";
}

function slugify(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

function namesProblem(slug: string | null, nameEn: string, nameAr: string) {
  if (slug !== null && (slug.trim().length < 2 || !slugPattern.test(slug.trim()))) {
    return "Slug must use lowercase letters, numbers, and hyphens. · الرابط المختصر يجب أن يحوي أحرفًا إنجليزية صغيرة وأرقامًا وشرطات فقط.";
  }
  if (!nameEn.trim() || !nameAr.trim()) return "English and Arabic names are required. · الاسمان بالإنجليزية والعربية مطلوبان.";
  return "";
}

function byName<T extends { name_en: string }>(a: T, b: T) {
  return a.name_en.localeCompare(b.name_en);
}

export function AdminBlogTaxonomy() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [postTypes, setPostTypes] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const [newCategory, setNewCategory] = useState<NewCategory>(emptyCategory);
  const [categorySlugTouched, setCategorySlugTouched] = useState(false);
  const [newTag, setNewTag] = useState<NewTag>(emptyTag);
  const [tagSlugTouched, setTagSlugTouched] = useState(false);

  const [editingCategory, setEditingCategory] = useState<{ id: string; draft: CategoryDraft } | null>(null);
  const [editingTag, setEditingTag] = useState<{ id: string; draft: TagDraft } | null>(null);

  const send = useCallback(async <T,>(url: string, init: RequestInit): Promise<SendResult<T>> => {
    try {
      const response = await fetch(url, { ...init, cache: "no-store", headers: jsonHeaders });
      if (response.status === 401) {
        router.replace("/admin/login");
        return { ok: false, error: "unauthorized" };
      }
      const payload = (await response.json().catch(() => ({}))) as T & { error?: string };
      if (!response.ok) return { ok: false, error: payload.error ?? "service_unavailable" };
      return { ok: true, data: payload };
    } catch {
      return { ok: false, error: "network" };
    }
  }, [router]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [categoryResponse, tagResponse, postTypeResponse] = await Promise.all([
        fetch("/api/admin/blog/categories", { cache: "no-store" }),
        fetch("/api/admin/blog/tags", { cache: "no-store" }),
        fetch("/api/admin/blog/post-types", { cache: "no-store" }),
      ]);
      if ([categoryResponse, tagResponse, postTypeResponse].some((response) => response.status === 401)) {
        router.replace("/admin/login");
        return;
      }
      if (![categoryResponse, tagResponse, postTypeResponse].every((response) => response.ok)) throw new Error("lookup_failed");
      const categoryPayload = (await categoryResponse.json()) as { categories: Category[] };
      const tagPayload = (await tagResponse.json()) as { tags: Tag[] };
      const postTypePayload = (await postTypeResponse.json()) as { postTypes: PostType[] };
      setCategories(categoryPayload.categories);
      setTags(tagPayload.tags);
      setPostTypes(postTypePayload.postTypes);
    } catch {
      setLoadError("Unable to load taxonomy. Check database configuration. · تعذر تحميل التصنيفات والوسوم.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  async function createCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const problem = namesProblem(newCategory.slug, newCategory.name_en, newCategory.name_ar);
    if (problem) { setError(problem); return; }
    setBusy(true);
    const result = await send<{ category: Category }>("/api/admin/blog/categories", {
      method: "POST",
      body: JSON.stringify({
        slug: newCategory.slug.trim(),
        name_en: newCategory.name_en.trim(),
        name_ar: newCategory.name_ar.trim(),
        description_en: newCategory.description_en.trim(),
        description_ar: newCategory.description_ar.trim(),
      }),
    });
    setBusy(false);
    if (!result.ok) { setError(errorText(result.error)); return; }
    setCategories((current) => [...current, result.data.category].sort(byName));
    setNewCategory(emptyCategory);
    setCategorySlugTouched(false);
    setMessage("Category created. · تم إنشاء التصنيف.");
  }

  async function createTag(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const problem = namesProblem(newTag.slug, newTag.name_en, newTag.name_ar);
    if (problem) { setError(problem); return; }
    setBusy(true);
    const result = await send<{ tag: Tag }>("/api/admin/blog/tags", {
      method: "POST",
      body: JSON.stringify({ slug: newTag.slug.trim(), name_en: newTag.name_en.trim(), name_ar: newTag.name_ar.trim() }),
    });
    setBusy(false);
    if (!result.ok) { setError(errorText(result.error)); return; }
    setTags((current) => [...current, result.data.tag].sort(byName));
    setNewTag(emptyTag);
    setTagSlugTouched(false);
    setMessage("Tag created. · تم إنشاء الوسم.");
  }

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingCategory) return;
    setError("");
    setMessage("");
    const problem = namesProblem(null, editingCategory.draft.name_en, editingCategory.draft.name_ar);
    if (problem) { setError(problem); return; }
    setBusy(true);
    const result = await send<{ category: Category }>(`/api/admin/blog/categories/${editingCategory.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name_en: editingCategory.draft.name_en.trim(),
        name_ar: editingCategory.draft.name_ar.trim(),
        description_en: editingCategory.draft.description_en.trim(),
        description_ar: editingCategory.draft.description_ar.trim(),
      }),
    });
    setBusy(false);
    if (!result.ok) { setError(errorText(result.error)); return; }
    setCategories((current) => current.map((item) => (item.id === result.data.category.id ? result.data.category : item)).sort(byName));
    setEditingCategory(null);
    setMessage("Category saved. · تم حفظ التصنيف.");
  }

  async function saveTag(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingTag) return;
    setError("");
    setMessage("");
    const problem = namesProblem(null, editingTag.draft.name_en, editingTag.draft.name_ar);
    if (problem) { setError(problem); return; }
    setBusy(true);
    const result = await send<{ tag: Tag }>(`/api/admin/blog/tags/${editingTag.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name_en: editingTag.draft.name_en.trim(), name_ar: editingTag.draft.name_ar.trim() }),
    });
    setBusy(false);
    if (!result.ok) { setError(errorText(result.error)); return; }
    setTags((current) => current.map((item) => (item.id === result.data.tag.id ? result.data.tag : item)).sort(byName));
    setEditingTag(null);
    setMessage("Tag saved. · تم حفظ الوسم.");
  }

  async function deleteCategory(category: Category) {
    if (!window.confirm(`Delete the category "${category.name_en}"? Its posts will become uncategorized. · حذف التصنيف؟ ستصبح مقالاته بدون تصنيف.`)) return;
    setError("");
    setMessage("");
    setBusy(true);
    const result = await send<{ deleted: boolean }>(`/api/admin/blog/categories/${category.id}`, { method: "DELETE" });
    setBusy(false);
    if (!result.ok) { setError(errorText(result.error)); return; }
    setCategories((current) => current.filter((item) => item.id !== category.id));
    if (editingCategory?.id === category.id) setEditingCategory(null);
    setMessage("Category deleted. · تم حذف التصنيف.");
  }

  async function deleteTag(tag: Tag) {
    if (!window.confirm(`Delete the tag "${tag.name_en}" from every post? · حذف الوسم من جميع المقالات؟`)) return;
    setError("");
    setMessage("");
    setBusy(true);
    const result = await send<{ deleted: boolean }>(`/api/admin/blog/tags/${tag.id}`, { method: "DELETE" });
    setBusy(false);
    if (!result.ok) { setError(errorText(result.error)); return; }
    setTags((current) => current.filter((item) => item.id !== tag.id));
    if (editingTag?.id === tag.id) setEditingTag(null);
    setMessage("Tag deleted. · تم حذف الوسم.");
  }

  if (loading) return <p>Loading taxonomy… · جاري تحميل التصنيفات والوسوم…</p>;
  if (loadError) return <p role="alert" className="admin-notice">{loadError}</p>;

  return <>
    {error && <p role="alert" className="admin-notice">{error}</p>}
    {message && <p role="status" className={styles.success}>{message}</p>}

    <section className={styles.taxonomySection} aria-labelledby="blog-categories-heading">
      <Card>
        <CardHeader>
          <CardTitle id="blog-categories-heading">Categories · التصنيفات</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 && <p className={styles.muted}>No categories yet. · لا توجد تصنيفات بعد.</p>}
          {categories.length > 0 && <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th scope="col">Name · الاسم</th><th scope="col">Slug · الرابط</th><th scope="col">Description · الوصف</th><th scope="col"><span className="visually-hidden">Actions</span></th></tr></thead>
              <tbody>
                {categories.map((category) => <CategoryRows
                  key={category.id}
                  category={category}
                  editing={editingCategory?.id === category.id ? editingCategory.draft : null}
                  busy={busy}
                  onEdit={() => { setError(""); setMessage(""); setEditingCategory({ id: category.id, draft: { name_en: category.name_en, name_ar: category.name_ar, description_en: category.description_en, description_ar: category.description_ar } }); }}
                  onCancel={() => setEditingCategory(null)}
                  onChange={(field, value) => setEditingCategory((current) => current ? { ...current, draft: { ...current.draft, [field]: value } } : current)}
                  onSave={saveCategory}
                  onDelete={() => void deleteCategory(category)}
                />)}
              </tbody>
            </table>
          </div>}

          <form className={`${styles.form} ${styles.newForm}`} onSubmit={createCategory} noValidate>
            <h3 className={styles.full}>New category · تصنيف جديد</h3>
            <label className={styles.field}><span>Name (English) — الاسم بالإنجليزية</span>
              <Input value={newCategory.name_en} maxLength={160} required onChange={(event) => setNewCategory((current) => ({
                ...current, name_en: event.target.value, slug: categorySlugTouched ? current.slug : slugify(event.target.value),
              }))} />
            </label>
            <label className={styles.field}><span>Name (Arabic) — الاسم بالعربية</span>
              <Input value={newCategory.name_ar} maxLength={160} required dir="rtl" lang="ar" onChange={(event) => setNewCategory((current) => ({ ...current, name_ar: event.target.value }))} />
            </label>
            <label className={`${styles.field} ${styles.full}`}><span>Slug · الرابط المختصر (permanent after creation)</span>
              <Input value={newCategory.slug} maxLength={80} dir="ltr" placeholder="web-development" required onChange={(event) => { setCategorySlugTouched(true); setNewCategory((current) => ({ ...current, slug: event.target.value })); }} />
            </label>
            <label className={styles.field}><span>Description (English) — الوصف بالإنجليزية</span>
              <textarea rows={2} maxLength={2000} value={newCategory.description_en} onChange={(event) => setNewCategory((current) => ({ ...current, description_en: event.target.value }))} />
            </label>
            <label className={styles.field}><span>Description (Arabic) — الوصف بالعربية</span>
              <textarea rows={2} maxLength={2000} dir="rtl" lang="ar" value={newCategory.description_ar} onChange={(event) => setNewCategory((current) => ({ ...current, description_ar: event.target.value }))} />
            </label>
            <div className={styles.actions}>
              <div className={styles.actionGroup}><Button type="submit" disabled={busy}>Add category · إضافة تصنيف</Button></div>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>

    <section className={styles.taxonomySection} aria-labelledby="blog-tags-heading">
      <Card>
        <CardHeader>
          <CardTitle id="blog-tags-heading">Tags · الوسوم</CardTitle>
        </CardHeader>
        <CardContent>
          {tags.length === 0 && <p className={styles.muted}>No tags yet. · لا توجد وسوم بعد.</p>}
          {tags.length > 0 && <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th scope="col">Name · الاسم</th><th scope="col">Slug · الرابط</th><th scope="col"><span className="visually-hidden">Actions</span></th></tr></thead>
              <tbody>
                {tags.map((tag) => <TagRows
                  key={tag.id}
                  tag={tag}
                  editing={editingTag?.id === tag.id ? editingTag.draft : null}
                  busy={busy}
                  onEdit={() => { setError(""); setMessage(""); setEditingTag({ id: tag.id, draft: { name_en: tag.name_en, name_ar: tag.name_ar } }); }}
                  onCancel={() => setEditingTag(null)}
                  onChange={(field, value) => setEditingTag((current) => current ? { ...current, draft: { ...current.draft, [field]: value } } : current)}
                  onSave={saveTag}
                  onDelete={() => void deleteTag(tag)}
                />)}
              </tbody>
            </table>
          </div>}

          <form className={`${styles.form} ${styles.newForm}`} onSubmit={createTag} noValidate>
            <h3 className={styles.full}>New tag · وسم جديد</h3>
            <label className={styles.field}><span>Name (English) — الاسم بالإنجليزية</span>
              <Input value={newTag.name_en} maxLength={160} required onChange={(event) => setNewTag((current) => ({
                ...current, name_en: event.target.value, slug: tagSlugTouched ? current.slug : slugify(event.target.value),
              }))} />
            </label>
            <label className={styles.field}><span>Name (Arabic) — الاسم بالعربية</span>
              <Input value={newTag.name_ar} maxLength={160} required dir="rtl" lang="ar" onChange={(event) => setNewTag((current) => ({ ...current, name_ar: event.target.value }))} />
            </label>
            <label className={`${styles.field} ${styles.full}`}><span>Slug · الرابط المختصر (permanent after creation)</span>
              <Input value={newTag.slug} maxLength={80} dir="ltr" placeholder="nextjs" required onChange={(event) => { setTagSlugTouched(true); setNewTag((current) => ({ ...current, slug: event.target.value })); }} />
            </label>
            <div className={styles.actions}>
              <div className={styles.actionGroup}><Button type="submit" disabled={busy}>Add tag · إضافة وسم</Button></div>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>

    <section className={styles.taxonomySection} aria-labelledby="blog-post-types-heading">
      <Card>
        <CardHeader>
          <CardTitle id="blog-post-types-heading">Post types · أنواع المنشورات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={styles.muted}>Fixed set of post types. · أنواع ثابتة لا يمكن إضافتها أو حذفها من هذه الشاشة.</p>
          {postTypes.length === 0 && <p className={styles.muted}>No post types found. · لا توجد أنواع.</p>}
          {postTypes.length > 0 && <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th scope="col">Name · الاسم</th><th scope="col">Arabic · العربية</th><th scope="col">Slug · الرابط</th></tr></thead>
              <tbody>
                {postTypes.map((type) => <tr key={type.id}>
                  <td>{type.name_en}</td>
                  <td dir="rtl" lang="ar">{type.name_ar}</td>
                  <td><code dir="ltr">{type.slug}</code></td>
                </tr>)}
              </tbody>
            </table>
          </div>}
        </CardContent>
      </Card>
    </section>
  </>;
}

function CategoryRows({ category, editing, busy, onEdit, onCancel, onChange, onSave, onDelete }: {
  category: Category;
  editing: CategoryDraft | null;
  busy: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onChange: (field: keyof CategoryDraft, value: string) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
}) {
  return <>
    <tr>
      <td>
        {category.name_en}<br /><small dir="rtl" lang="ar" className={styles.muted}>{category.name_ar}</small>
      </td>
      <td><code dir="ltr">{category.slug}</code></td>
      <td className={styles.muted}>{category.description_en || "—"}</td>
      <td>
        <div className={styles.rowActions}>
          <Button type="button" variant="outline" size="sm" onClick={onEdit} disabled={busy || editing !== null} aria-label={`Edit ${category.name_en} · تعديل`} title="Edit · تعديل">✎</Button>
          <Button type="button" variant="destructive" size="sm" onClick={onDelete} disabled={busy} aria-label={`Delete ${category.name_en} · حذف`}>Delete · حذف</Button>
        </div>
      </td>
    </tr>
    {editing && <tr>
      <td colSpan={4}>
        <form className={styles.form} onSubmit={onSave} noValidate>
          <label className={styles.field}><span>Name (English) — الاسم بالإنجليزية</span>
            <Input value={editing.name_en} maxLength={160} required onChange={(event) => onChange("name_en", event.target.value)} />
          </label>
          <label className={styles.field}><span>Name (Arabic) — الاسم بالعربية</span>
            <Input value={editing.name_ar} maxLength={160} required dir="rtl" lang="ar" onChange={(event) => onChange("name_ar", event.target.value)} />
          </label>
          <label className={styles.field}><span>Description (English) — الوصف بالإنجليزية</span>
            <textarea rows={2} maxLength={2000} value={editing.description_en} onChange={(event) => onChange("description_en", event.target.value)} />
          </label>
          <label className={styles.field}><span>Description (Arabic) — الوصف بالعربية</span>
            <textarea rows={2} maxLength={2000} dir="rtl" lang="ar" value={editing.description_ar} onChange={(event) => onChange("description_ar", event.target.value)} />
          </label>
          <div className={styles.actions}>
            <div className={styles.actionGroup}>
              <Button type="submit" disabled={busy}>Save · حفظ</Button>
              <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>Cancel · إلغاء</Button>
            </div>
          </div>
        </form>
      </td>
    </tr>}
  </>;
}

function TagRows({ tag, editing, busy, onEdit, onCancel, onChange, onSave, onDelete }: {
  tag: Tag;
  editing: TagDraft | null;
  busy: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onChange: (field: keyof TagDraft, value: string) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
}) {
  return <>
    <tr>
      <td>
        {tag.name_en}<br /><small dir="rtl" lang="ar" className={styles.muted}>{tag.name_ar}</small>
      </td>
      <td><code dir="ltr">{tag.slug}</code></td>
      <td>
        <div className={styles.rowActions}>
          <Button type="button" variant="outline" size="sm" onClick={onEdit} disabled={busy || editing !== null} aria-label={`Edit ${tag.name_en} · تعديل`} title="Edit · تعديل">✎</Button>
          <Button type="button" variant="destructive" size="sm" onClick={onDelete} disabled={busy} aria-label={`Delete ${tag.name_en} · حذف`}>Delete · حذف</Button>
        </div>
      </td>
    </tr>
    {editing && <tr>
      <td colSpan={3}>
        <form className={styles.form} onSubmit={onSave} noValidate>
          <label className={styles.field}><span>Name (English) — الاسم بالإنجليزية</span>
            <Input value={editing.name_en} maxLength={160} required onChange={(event) => onChange("name_en", event.target.value)} />
          </label>
          <label className={styles.field}><span>Name (Arabic) — الاسم بالعربية</span>
            <Input value={editing.name_ar} maxLength={160} required dir="rtl" lang="ar" onChange={(event) => onChange("name_ar", event.target.value)} />
          </label>
          <div className={styles.actions}>
            <div className={styles.actionGroup}>
              <Button type="submit" disabled={busy}>Save · حفظ</Button>
              <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>Cancel · إلغاء</Button>
            </div>
          </div>
        </form>
      </td>
    </tr>}
  </>;
}
