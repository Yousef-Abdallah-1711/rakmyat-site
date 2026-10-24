"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import styles from "./AdminBlog.module.css";
import { MediaLibrary } from "./MediaLibrary";
import { RichTextEditor } from "./RichTextEditor";

type Status = "draft" | "published" | "archived";
type Option = { id: string; slug: string; name_en: string; name_ar: string };
type Post = {
  id: string; slug: string; title_en: string; title_ar: string; excerpt_en: string; excerpt_ar: string;
  body_en: string; body_ar: string; cover_image_url: string | null; category_id: string | null; post_type_id: string | null;
  author_name: string; status: Status; locale_primary: "en" | "ar";
  seo_title_en: string | null; seo_title_ar: string | null; seo_description_en: string | null; seo_description_ar: string | null;
  published_at: string | null; created_at: string; updated_at: string;
  category_name_en?: string; category_name_ar?: string; post_type_name_en?: string; post_type_name_ar?: string;
  tags?: Option[];
};
type Form = {
  slug: string; title_en: string; title_ar: string; excerpt_en: string; excerpt_ar: string; body_en: string; body_ar: string;
  cover_image_url: string; category_id: string; post_type_id: string; author_name: string; status: Status; locale_primary: "en" | "ar";
  seo_title_en: string; seo_title_ar: string; seo_description_en: string; seo_description_ar: string; published_at: string; tag_ids: string[];
};
type LoadState = "loading" | "ready" | "missing" | "failed";

export type AdminBlogPostEditorProps = {
  // When provided, we are editing. When null/undefined, we are creating.
  postId?: string | null;
  // Called after successful save (with the saved post's id)
  onSaved?: (id: string) => void;
  // Called when user clicks Back/Cancel
  onBack?: () => void;
};

const statuses: [Status, string][] = [["draft", "Draft · مسودة"], ["published", "Published · منشور"], ["archived", "Archived · مؤرشف"]];
const emptyForm: Form = {
  slug: "", title_en: "", title_ar: "", excerpt_en: "", excerpt_ar: "", body_en: "", body_ar: "", cover_image_url: "",
  category_id: "", post_type_id: "", author_name: "Rakmyat", status: "draft", locale_primary: "en",
  seo_title_en: "", seo_title_ar: "", seo_description_en: "", seo_description_ar: "", published_at: "", tag_ids: [],
};
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Matches the server-side limit on body_en / body_ar (lib/blog-schema.ts).
const maxBodyLength = 60000;
const jsonHeaders = { "Content-Type": "application/json" };
const errorMessages: Record<string, string> = {
  slug_taken: "This slug is already used by another post. · هذا الرابط المختصر مستخدم بالفعل.",
  invalid_reference: "A selected category, post type, or tag no longer exists. · أحد الخيارات المختارة لم يعد موجودًا.",
  payload_too_large: "The post content is too large. · محتوى المنشور كبير جدًا.",
  invalid_fields: "Some fields are invalid. · بعض الحقول غير صالحة.",
  origin_rejected: "The request was rejected. Reload the page and try again. · أعد تحميل الصفحة وحاول مجددًا.",
  network: "Network error. Try again. · خطأ في الشبكة. حاول مرة أخرى.",
};

function slugify(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 200);
}

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formFromPost(post: Post): Form {
  return {
    slug: post.slug, title_en: post.title_en, title_ar: post.title_ar, excerpt_en: post.excerpt_en, excerpt_ar: post.excerpt_ar,
    body_en: post.body_en, body_ar: post.body_ar, cover_image_url: post.cover_image_url ?? "", category_id: post.category_id ?? "",
    post_type_id: post.post_type_id ?? "", author_name: post.author_name, status: post.status, locale_primary: post.locale_primary,
    seo_title_en: post.seo_title_en ?? "", seo_title_ar: post.seo_title_ar ?? "", seo_description_en: post.seo_description_en ?? "",
    seo_description_ar: post.seo_description_ar ?? "", published_at: toLocalInput(post.published_at), tag_ids: (post.tags ?? []).map((tag) => tag.id),
  };
}

function validateForm(form: Form) {
  if (form.slug.trim().length < 2 || !slugPattern.test(form.slug.trim())) return "Slug must use lowercase letters, numbers, and hyphens. · الرابط المختصر يجب أن يحوي أحرفًا إنجليزية صغيرة وأرقامًا وشرطات فقط.";
  if (!form.title_en.trim() || !form.title_ar.trim()) return "English and Arabic titles are required. · العنوانان بالإنجليزية والعربية مطلوبان.";
  if (!form.author_name.trim()) return "Author name is required. · اسم الكاتب مطلوب.";
  if (form.body_en.length > maxBodyLength || form.body_ar.length > maxBodyLength) return `Each post body can be at most ${maxBodyLength.toLocaleString("en")} characters of HTML. · أقصى طول لمحتوى المنشور ${maxBodyLength.toLocaleString("ar")} حرفًا.`;
  return "";
}

function nullIfEmpty(value: string) {
  return value.trim() ? value.trim() : null;
}

function commonPayload(form: Form) {
  return {
    slug: form.slug.trim(), title_en: form.title_en.trim(), title_ar: form.title_ar.trim(),
    excerpt_en: form.excerpt_en, excerpt_ar: form.excerpt_ar, body_en: form.body_en, body_ar: form.body_ar,
    cover_image_url: nullIfEmpty(form.cover_image_url), category_id: form.category_id || null, post_type_id: form.post_type_id || null,
    author_name: form.author_name.trim(), locale_primary: form.locale_primary,
    seo_title_en: nullIfEmpty(form.seo_title_en), seo_title_ar: nullIfEmpty(form.seo_title_ar),
    seo_description_en: nullIfEmpty(form.seo_description_en), seo_description_ar: nullIfEmpty(form.seo_description_ar),
    tag_ids: form.tag_ids,
  };
}

function statusPayload(form: Form) {
  // A missing published_at keeps the stored publish time; an empty value on a published post stamps now() on the server.
  return form.status === "published"
    ? { status: form.status, published_at: form.published_at ? new Date(form.published_at).toISOString() : null }
    : { status: form.status };
}

type AutosaveStatus = "idle" | "pending" | "saving" | "saved" | "error";
const AUTOSAVE_DELAY_MS = 3000;

// Autosave only touches drafts: a new post, or a stored draft whose form status is still draft.
// Publishing and edits to live posts always go through the explicit Save button.
function canAutosave(form: Form, isNew: boolean, persistedStatus: Status | null) {
  return form.status === "draft" && (isNew || persistedStatus === "draft");
}

function errorText(code: string | undefined, fields?: string[]) {
  const base = errorMessages[code ?? ""] ?? "Could not save. Check database configuration and try again. · تعذر الحفظ. تحقق من إعداد قاعدة البيانات.";
  return fields?.length ? `${base} (${fields.join(", ")})` : base;
}

export function AdminBlogPostEditor({ postId = null, onSaved, onBack }: AdminBlogPostEditorProps) {
  const router = useRouter();
  const [editId, setEditId] = useState<string | null>(postId);
  const [loadState, setLoadState] = useState<LoadState>(postId ? "loading" : "ready");
  const [form, setForm] = useState<Form>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const [categories, setCategories] = useState<Option[]>([]);
  const [postTypes, setPostTypes] = useState<Option[]>([]);
  const [tags, setTags] = useState<Option[]>([]);
  const [lookupError, setLookupError] = useState("");
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>("idle");
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autosaveResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autosaveAbortRef = useRef<AbortController | null>(null);
  // True while an autosave POST is in flight; a create is never aborted, so this blocks a second create.
  const autosaveCreatingRef = useRef(false);
  // JSON of the form as last stored; autosave runs only when the form differs from it.
  const lastSavedFormRef = useRef<string>("");
  // Status as stored on the server, used to decide whether autosave may touch the post.
  const persistedStatusRef = useRef<Status | null>(null);
  const mountedRef = useRef(false);

  // Category, post type, and tag options for the dropdowns and tag checkboxes.
  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/admin/blog/categories", { cache: "no-store" }),
      fetch("/api/admin/blog/post-types", { cache: "no-store" }),
      fetch("/api/admin/blog/tags", { cache: "no-store" }),
    ])
      .then(async ([categoryResponse, postTypeResponse, tagResponse]) => {
        if ([categoryResponse, postTypeResponse, tagResponse].some((response) => response.status === 401)) {
          router.replace("/admin/login");
          return;
        }
        if (![categoryResponse, postTypeResponse, tagResponse].every((response) => response.ok)) throw new Error("lookup_failed");
        const categoryPayload = (await categoryResponse.json()) as { categories: Option[] };
        const postTypePayload = (await postTypeResponse.json()) as { postTypes: Option[] };
        const tagPayload = (await tagResponse.json()) as { tags: Option[] };
        if (!active) return;
        setCategories(categoryPayload.categories);
        setPostTypes(postTypePayload.postTypes);
        setTags(tagPayload.tags);
      })
      .catch(() => {
        if (active) setLookupError("Unable to load blog options. Check database configuration. · تعذر تحميل خيارات المدونة.");
      });
    return () => { active = false; };
  }, [router]);

  // Loads the post into the form when editing. Creating starts from emptyForm.
  useEffect(() => {
    if (!postId) return;
    let active = true;
    setEditId(postId);
    setLoadState("loading");
    setFormError("");
    setSavedMessage("");
    fetch(`/api/admin/blog/posts/${postId}`, { cache: "no-store" })
      .then(async (response) => {
        if (!active) return;
        if (response.status === 401) { router.replace("/admin/login"); return; }
        if (response.status === 404) { setLoadState("missing"); return; }
        if (!response.ok) throw new Error("load_failed");
        const payload = (await response.json()) as { post: Post };
        if (!active) return;
        // The loaded values are the saved baseline, so loading alone does not trigger an autosave.
        lastSavedFormRef.current = JSON.stringify(formFromPost(payload.post));
        persistedStatusRef.current = payload.post.status;
        setForm(formFromPost(payload.post));
        setSlugTouched(true);
        setLoadState("ready");
      })
      .catch(() => {
        if (active) setLoadState("failed");
      });
    return () => { active = false; };
  }, [postId, router]);

  // Draft autosave: AUTOSAVE_DELAY_MS after the last change, when the form is valid, changed, and a draft.
  // A new post is created once; later autosaves PATCH the id that the create returned.
  useEffect(() => {
    if (loadState !== "ready" || saving) return;
    const formJson = JSON.stringify(form);
    const isNew = editId === null;
    if (formJson === lastSavedFormRef.current || !canAutosave(form, isNew, persistedStatusRef.current) || validateForm(form)) {
      setAutosaveStatus((status) => (status === "pending" ? "idle" : status));
      return;
    }

    setAutosaveStatus("pending");
    autosaveTimerRef.current = setTimeout(async () => {
      autosaveTimerRef.current = null;
      // A create is still in flight; when it finishes it updates editId, which re-runs this effect.
      if (autosaveCreatingRef.current) return;

      const controller = new AbortController();
      if (isNew) {
        // Creates are not aborted: the server may already have inserted the row.
        autosaveCreatingRef.current = true;
      } else {
        // A newer PATCH supersedes an older one that is still in flight.
        autosaveAbortRef.current?.abort();
        autosaveAbortRef.current = controller;
      }
      setAutosaveStatus("saving");
      try {
        const response = await fetch(isNew ? "/api/admin/blog/posts" : `/api/admin/blog/posts/${editId}`, {
          method: isNew ? "POST" : "PATCH",
          headers: jsonHeaders,
          body: JSON.stringify(commonPayload(form)),
          signal: isNew ? undefined : controller.signal,
        });
        if (response.status === 401) { window.location.replace("/admin/login"); return; }
        const result = (await response.json().catch(() => ({}))) as { post?: Post };
        if (!response.ok || !result.post) { setAutosaveStatus("error"); return; }

        if (isNew && mountedRef.current) {
          // Switch to edit mode and move the URL to the new post without remounting the form.
          window.history.replaceState(null, "", `/admin/blog/posts/${result.post.id}/edit`);
          setEditId(result.post.id);
        }
        persistedStatusRef.current = "draft";
        lastSavedFormRef.current = formJson;
        setAutosaveStatus("saved");
        if (autosaveResetRef.current) clearTimeout(autosaveResetRef.current);
        autosaveResetRef.current = setTimeout(() => {
          setAutosaveStatus((status) => (status === "saved" ? "idle" : status));
        }, AUTOSAVE_DELAY_MS);
      } catch {
        // An aborted PATCH was superseded by a newer autosave or a manual save; that run owns the status.
        if (controller.signal.aborted) return;
        setAutosaveStatus("error");
      } finally {
        if (isNew) autosaveCreatingRef.current = false;
      }
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    };
  }, [form, saving, loadState, editId]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
      if (autosaveResetRef.current) clearTimeout(autosaveResetRef.current);
      autosaveAbortRef.current?.abort();
    };
  }, []);

  function goBack() {
    if (onBack) onBack();
    else router.push("/admin/blog");
  }

  function updateField<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function changeTitleEn(value: string) {
    setForm((current) => ({
      ...current,
      title_en: value,
      slug: editId === null && !slugTouched ? slugify(value) : current.slug,
    }));
  }

  function toggleTag(id: string) {
    setForm((current) => ({
      ...current,
      tag_ids: current.tag_ids.includes(id) ? current.tag_ids.filter((item) => item !== id) : [...current.tag_ids, id],
    }));
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setSavedMessage("");
    const problem = validateForm(form);
    if (problem) { setFormError(problem); return; }
    if (autosaveCreatingRef.current) {
      setFormError("Autosave is still creating this draft. Try again in a moment. · الحفظ التلقائي ما زال ينشئ المسودة. حاول بعد لحظات.");
      return;
    }
    // The manual save covers whatever an in-flight autosave PATCH would have written.
    autosaveAbortRef.current?.abort();
    setAutosaveStatus("idle");
    setSaving(true);
    try {
      const isNew = editId === null;
      const response = await fetch(isNew ? "/api/admin/blog/posts" : `/api/admin/blog/posts/${editId}`, {
        method: isNew ? "POST" : "PATCH",
        headers: jsonHeaders,
        body: JSON.stringify(isNew ? commonPayload(form) : { ...commonPayload(form), ...statusPayload(form) }),
      });
      if (response.status === 401) { router.replace("/admin/login"); return; }
      const result = (await response.json().catch(() => ({}))) as { post?: Post; error?: string; fields?: string[] };
      if (!response.ok || !result.post) { setFormError(errorText(result.error, result.fields)); return; }

      let post = result.post;
      if (isNew) {
        // The post now exists: switch to edit mode and move the URL to its edit route without remounting the form.
        setEditId(post.id);
        window.history.replaceState(null, "", `/admin/blog/posts/${post.id}/edit`);
        if (form.status !== "draft") {
          // The create endpoint always stores drafts; apply the chosen status in a follow-up update.
          const followUp = await fetch(`/api/admin/blog/posts/${post.id}`, { method: "PATCH", headers: jsonHeaders, body: JSON.stringify(statusPayload(form)) });
          const followUpResult = (await followUp.json().catch(() => ({}))) as { post?: Post; error?: string };
          if (!followUp.ok || !followUpResult.post) {
            lastSavedFormRef.current = JSON.stringify(formFromPost(post));
            persistedStatusRef.current = post.status;
            setForm(formFromPost(post));
            setSlugTouched(true);
            setFormError(`${"The post was saved as a draft, but its status could not be changed. · تم حفظ المنشور كمسودة لكن تعذر تغيير حالته."} ${errorText(followUpResult.error)}`);
            return;
          }
          post = followUpResult.post;
        }
      }
      setEditId(post.id);
      lastSavedFormRef.current = JSON.stringify(formFromPost(post));
      persistedStatusRef.current = post.status;
      setForm(formFromPost(post));
      setSlugTouched(true);
      setSavedMessage("Saved. · تم الحفظ.");
      onSaved?.(post.id);
    } catch {
      setFormError(errorText("network"));
    } finally {
      setSaving(false);
    }
  }

  async function deletePost() {
    if (!editId) return;
    if (!window.confirm("Delete this post permanently? This cannot be undone. · هل تريد حذف هذا المنشور نهائيًا؟ لا يمكن التراجع.")) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/blog/posts/${editId}`, { method: "DELETE" });
      if (response.status === 401) { router.replace("/admin/login"); return; }
      if (!response.ok) { setFormError(errorText(((await response.json().catch(() => ({}))) as { error?: string }).error)); return; }
      if (onBack) onBack();
      else router.push("/admin/blog?notice=post-deleted");
    } catch {
      setFormError(errorText("network"));
    } finally {
      setSaving(false);
    }
  }

  const isNew = editId === null;

  if (loadState === "loading") {
    return <section className="admin-dashboard"><div className="admin-main">
      <p>Loading post… · جاري التحميل…</p>
    </div></section>;
  }

  if (loadState === "missing" || loadState === "failed") {
    return <section className="admin-dashboard"><div className="admin-main">
      <div className="admin-heading">
        <div><p>Edit post · تعديل المنشور</p><h1>{loadState === "missing" ? "Post not found · المنشور غير موجود" : "Blog post · المنشور"}</h1></div>
      </div>
      <p role="alert" className="admin-notice">{loadState === "missing" ? "Post not found. · المنشور غير موجود." : "Unable to open this post. · تعذر فتح المنشور."}</p>
      <p><Link href="/admin/blog">Back to posts · العودة إلى المنشورات</Link></p>
    </div></section>;
  }

  return <section className="admin-dashboard"><div className="admin-main">
    <div className="admin-heading">
      <div><p>{isNew ? "New post · منشور جديد" : "Edit post · تعديل المنشور"}</p><h1>{isNew ? "Create blog post" : form.title_en || "Blog post"}</h1></div>
      <button type="button" onClick={goBack} disabled={saving}>Back · رجوع</button>
    </div>

    {lookupError && <p role="alert" className="admin-notice">{lookupError}</p>}

    <form className={styles.form} onSubmit={savePost} noValidate>
      <label className={`${styles.field} ${styles.full}`}><span>Slug · الرابط المختصر</span>
        <input value={form.slug} maxLength={200} onChange={(event) => { setSlugTouched(true); updateField("slug", event.target.value); }} placeholder="my-first-post" dir="ltr" required />
      </label>

      <label className={styles.field}><span>Title (English) — العنوان بالإنجليزية</span>
        <input value={form.title_en} maxLength={300} onChange={(event) => changeTitleEn(event.target.value)} required />
      </label>
      <label className={styles.field}><span>Title (Arabic) — العنوان بالعربية</span>
        <input value={form.title_ar} maxLength={300} dir="rtl" lang="ar" onChange={(event) => updateField("title_ar", event.target.value)} required />
      </label>

      <label className={styles.field}><span>Excerpt (English) — المقتطف بالإنجليزية</span>
        <textarea value={form.excerpt_en} maxLength={1000} rows={3} onChange={(event) => updateField("excerpt_en", event.target.value)} />
      </label>
      <label className={styles.field}><span>Excerpt (Arabic) — المقتطف بالعربية</span>
        <textarea value={form.excerpt_ar} maxLength={1000} rows={3} dir="rtl" lang="ar" onChange={(event) => updateField("excerpt_ar", event.target.value)} />
      </label>

      <div className={`${styles.field} ${styles.full}`}><span>Body (English) — المحتوى بالإنجليزية</span>
        <RichTextEditor value={form.body_en} placeholder="Write the English post body…" onChange={(html) => updateField("body_en", html)} />
      </div>
      <div className={`${styles.field} ${styles.full}`}><span>Body (Arabic) — المحتوى بالعربية</span>
        <RichTextEditor value={form.body_ar} dir="rtl" placeholder="اكتب محتوى المنشور بالعربية…" onChange={(html) => updateField("body_ar", html)} />
      </div>

      <div className={`${styles.field} ${styles.full}`}>
        <label htmlFor="blog-cover-image-url" className={styles.fieldLabel}>Cover image URL — رابط صورة الغلاف</label>
        <div className={styles.inlineRow}>
          <input id="blog-cover-image-url" value={form.cover_image_url} maxLength={2048} type="url" dir="ltr" placeholder="/uploads/images/… or https://…" onChange={(event) => updateField("cover_image_url", event.target.value)} />
          <button type="button" className={styles.pickButton} onClick={() => setCoverPickerOpen(true)}>Choose from media library · اختر من المكتبة</button>
        </div>
      </div>

      <label className={styles.field}><span>Category — التصنيف</span>
        <select value={form.category_id} onChange={(event) => updateField("category_id", event.target.value)}>
          <option value="">No category · بدون تصنيف</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name_en} · {category.name_ar}</option>)}
        </select>
      </label>
      <label className={styles.field}><span>Post type — نوع المنشور</span>
        <select value={form.post_type_id} onChange={(event) => updateField("post_type_id", event.target.value)}>
          <option value="">No type · بدون نوع</option>
          {postTypes.map((type) => <option key={type.id} value={type.id}>{type.name_en} · {type.name_ar}</option>)}
        </select>
      </label>

      <label className={styles.field}><span>Author name — اسم الكاتب</span>
        <input value={form.author_name} maxLength={160} onChange={(event) => updateField("author_name", event.target.value)} required />
      </label>
      <label className={styles.field}><span>Primary locale — اللغة الأساسية</span>
        <select value={form.locale_primary} onChange={(event) => updateField("locale_primary", event.target.value as "en" | "ar")}>
          <option value="en">English (en)</option>
          <option value="ar">العربية (ar)</option>
        </select>
      </label>

      <label className={styles.field}><span>Status — الحالة</span>
        <select value={form.status} onChange={(event) => updateField("status", event.target.value as Status)}>
          {statuses.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </label>
      {form.status === "published" && <label className={styles.field}><span>Published at — تاريخ النشر</span>
        <input type="datetime-local" value={form.published_at} onChange={(event) => updateField("published_at", event.target.value)} />
      </label>}

      <label className={styles.field}><span>SEO title (English) — عنوان SEO بالإنجليزية</span>
        <input value={form.seo_title_en} maxLength={300} onChange={(event) => updateField("seo_title_en", event.target.value)} />
      </label>
      <label className={styles.field}><span>SEO title (Arabic) — عنوان SEO بالعربية</span>
        <input value={form.seo_title_ar} maxLength={300} dir="rtl" lang="ar" onChange={(event) => updateField("seo_title_ar", event.target.value)} />
      </label>
      <label className={styles.field}><span>SEO description (English) — وصف SEO بالإنجليزية</span>
        <textarea value={form.seo_description_en} maxLength={500} rows={2} onChange={(event) => updateField("seo_description_en", event.target.value)} />
      </label>
      <label className={styles.field}><span>SEO description (Arabic) — وصف SEO بالعربية</span>
        <textarea value={form.seo_description_ar} maxLength={500} rows={2} dir="rtl" lang="ar" onChange={(event) => updateField("seo_description_ar", event.target.value)} />
      </label>

      <fieldset className={styles.fieldset}>
        <legend>Tags — الوسوم</legend>
        {tags.length === 0 && <p className={styles.muted}>No tags yet. · لا توجد وسوم بعد.</p>}
        {tags.map((tag) => <label key={tag.id} className={styles.checkbox}>
          <input type="checkbox" checked={form.tag_ids.includes(tag.id)} onChange={() => toggleTag(tag.id)} />
          <span>{tag.name_en} · <span dir="rtl" lang="ar">{tag.name_ar}</span></span>
        </label>)}
      </fieldset>

      {formError && <p role="alert" className={`admin-notice ${styles.full}`}>{formError}</p>}
      {savedMessage && <p role="status" className={`${styles.success} ${styles.full}`}>{savedMessage}</p>}

      <div className={styles.actions}>
        <div className={styles.actionGroup}>
          <button type="submit" disabled={saving}>{saving ? "Saving… · جاري الحفظ…" : "Save · حفظ"}</button>
          {/* aria-live rather than role="status": the Saved. message already owns that role. */}
          {autosaveStatus === "pending" && <span className={styles.autosaveStatus} aria-live="polite">Unsaved changes… · تغييرات غير محفوظة…</span>}
          {autosaveStatus === "saving" && <span className={styles.autosaveStatus} aria-live="polite">Autosaving… · جاري الحفظ التلقائي…</span>}
          {autosaveStatus === "saved" && <span className={`${styles.autosaveStatus} ${styles.autosaveSaved}`} aria-live="polite">Draft autosaved ✓ · تم حفظ المسودة تلقائيًا</span>}
          {autosaveStatus === "error" && <span className={`${styles.autosaveStatus} ${styles.autosaveError}`} aria-live="polite">Autosave failed · فشل الحفظ التلقائي</span>}
          <button type="button" onClick={goBack} disabled={saving}>Back · رجوع</button>
        </div>
        {!isNew && <button type="button" className={styles.danger} onClick={() => void deletePost()} disabled={saving}>Delete · حذف</button>}
      </div>
    </form>
    <MediaLibrary
      isOpen={coverPickerOpen}
      onClose={() => setCoverPickerOpen(false)}
      onSelect={(url) => { updateField("cover_image_url", url); setCoverPickerOpen(false); }}
      kind="image"
    />
  </div></section>;
}
