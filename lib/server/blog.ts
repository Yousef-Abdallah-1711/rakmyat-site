import "server-only";
import { cache } from "react";
import { getDatabase } from "@/lib/server/db";
import type { BlogCategory, BlogPost, BlogPostSummary, BlogTag } from "@/lib/blog-schema";

type Sql = ReturnType<typeof getDatabase>;
type Row = Record<string, unknown>;

export const PUBLIC_LIST_LIMIT = 100;

function str(value: unknown): string {
  return value == null ? "" : String(value);
}

function nullableStr(value: unknown): string | null {
  return value == null ? null : String(value);
}

function iso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function nullableIso(value: unknown): string | null {
  return value == null ? null : iso(value);
}

function mapTag(row: Row): BlogTag {
  return {
    id: str(row.id),
    slug: str(row.slug),
    name_en: str(row.name_en),
    name_ar: str(row.name_ar),
    created_at: iso(row.created_at),
  };
}

function mapCategory(row: Row): BlogCategory {
  return {
    id: str(row.id),
    slug: str(row.slug),
    name_en: str(row.name_en),
    name_ar: str(row.name_ar),
    description_en: str(row.description_en),
    description_ar: str(row.description_ar),
    created_at: iso(row.created_at),
    updated_at: iso(row.updated_at),
  };
}

function mapSummary(row: Row): BlogPostSummary {
  return {
    id: str(row.id),
    slug: str(row.slug),
    title_en: str(row.title_en),
    title_ar: str(row.title_ar),
    excerpt_en: str(row.excerpt_en),
    excerpt_ar: str(row.excerpt_ar),
    cover_image_url: nullableStr(row.cover_image_url),
    category_id: nullableStr(row.category_id),
    post_type_id: nullableStr(row.post_type_id),
    author_name: str(row.author_name),
    status: str(row.status) as BlogPostSummary["status"],
    locale_primary: str(row.locale_primary),
    seo_title_en: nullableStr(row.seo_title_en),
    seo_title_ar: nullableStr(row.seo_title_ar),
    seo_description_en: nullableStr(row.seo_description_en),
    seo_description_ar: nullableStr(row.seo_description_ar),
    published_at: nullableIso(row.published_at),
    created_at: iso(row.created_at),
    updated_at: iso(row.updated_at),
    reading_minutes_en: Math.max(1, Number(row.reading_minutes_en ?? 1)),
    reading_minutes_ar: Math.max(1, Number(row.reading_minutes_ar ?? 1)),
    category_name_en: nullableStr(row.category_name_en) ?? undefined,
    category_name_ar: nullableStr(row.category_name_ar) ?? undefined,
    post_type_name_en: nullableStr(row.post_type_name_en) ?? undefined,
    post_type_name_ar: nullableStr(row.post_type_name_ar) ?? undefined,
  };
}

function mapPost(row: Row, tags: BlogTag[]): BlogPost {
  return {
    ...mapSummary(row),
    body_en: str(row.body_en),
    body_ar: str(row.body_ar),
    tags,
  };
}

/** Columns and joins shared by every post read; callers append their own WHERE clause. */
function summarySelect(sql: Sql) {
  return sql`p.id, p.slug, p.title_en, p.title_ar, p.excerpt_en, p.excerpt_ar, p.cover_image_url,
    p.category_id, p.post_type_id, p.author_name, p.status, p.locale_primary,
    p.seo_title_en, p.seo_title_ar, p.seo_description_en, p.seo_description_ar,
    p.published_at, p.created_at, p.updated_at,
    c.name_en AS category_name_en, c.name_ar AS category_name_ar,
    t.name_en AS post_type_name_en, t.name_ar AS post_type_name_ar,
    GREATEST(1, ROUND(cardinality(regexp_split_to_array(trim(p.body_en), '[[:space:]]+'))::numeric / 200))::int AS reading_minutes_en,
    GREATEST(1, ROUND(cardinality(regexp_split_to_array(trim(p.body_ar), '[[:space:]]+'))::numeric / 200))::int AS reading_minutes_ar`;
}

async function loadPostTags(sql: Sql, postId: string): Promise<BlogTag[]> {
  const rows = await sql`SELECT tg.id, tg.slug, tg.name_en, tg.name_ar, tg.created_at
    FROM blog_tags tg JOIN blog_post_tags pt ON pt.tag_id = tg.id
    WHERE pt.post_id = ${postId}::uuid ORDER BY tg.name_en`;
  return rows.map((row) => mapTag(row as Row));
}

/** Public listing: only published posts whose publish time has arrived. Deduplicated per render. */
export const listPublishedBlogPosts = cache(async (): Promise<BlogPostSummary[]> => {
  const sql = getDatabase();
  const rows = await sql`SELECT ${summarySelect(sql)}
    FROM blog_posts p
    LEFT JOIN blog_categories c ON c.id = p.category_id
    LEFT JOIN blog_post_types t ON t.id = p.post_type_id
    WHERE p.status = 'published' AND p.published_at <= now()
    ORDER BY p.published_at DESC, p.id DESC
    LIMIT ${PUBLIC_LIST_LIMIT}`;
  return rows.map((row) => mapSummary(row as Row));
});

export type BlogPostSort = "newest" | "oldest" | "az" | "za";

export type PublicBlogPostsQuery = {
  page: number;
  limit: number;
  category: string | null;
  tag: string | null;
  author: string | null;
  q: string | null;
  sort: BlogPostSort;
  locale: "en" | "ar";
};

export type PublicBlogPostsPage = {
  posts: BlogPostSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/** Public filter rules. Every user value is bound as a parameter; nothing is interpolated into SQL text. */
function publicFilters(sql: Sql, query: PublicBlogPostsQuery) {
  const search = query.q ? likePattern(query.q) : null;
  return sql`p.status = 'published' AND p.published_at <= now()
    AND (${query.category}::text IS NULL OR c.slug = ${query.category}::text)
    AND (${query.tag}::text IS NULL OR EXISTS (
      SELECT 1 FROM blog_post_tags pt JOIN blog_tags tg ON tg.id = pt.tag_id
      WHERE pt.post_id = p.id AND tg.slug = ${query.tag}::text))
    AND (${query.author}::text IS NULL OR p.author_name = ${query.author}::text)
    AND (${search}::text IS NULL OR p.title_en ILIKE ${search}::text OR p.title_ar ILIKE ${search}::text
      OR p.excerpt_en ILIKE ${search}::text OR p.excerpt_ar ILIKE ${search}::text)`;
}

/** Sort keys are fixed server-side. Title sorts follow the requested locale's title column. */
function publicOrder(sql: Sql, sort: BlogPostSort, locale: "en" | "ar") {
  const title = locale === "ar" ? sql`p.title_ar` : sql`p.title_en`;
  switch (sort) {
    case "oldest": return sql`p.published_at ASC, p.id ASC`;
    case "az": return sql`${title} ASC, p.id ASC`;
    case "za": return sql`${title} DESC, p.id DESC`;
    default: return sql`p.published_at DESC, p.id DESC`;
  }
}

/** Paginated public listing with filters. The requested page is clamped to the last page. */
export async function listPublishedBlogPostsPage(query: PublicBlogPostsQuery): Promise<PublicBlogPostsPage> {
  const sql = getDatabase();
  const countRows = await sql`SELECT count(*)::int AS total FROM blog_posts p
    LEFT JOIN blog_categories c ON c.id = p.category_id
    WHERE ${publicFilters(sql, query)}`;
  const total = Number(countRows[0]?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / query.limit));
  const page = Math.min(query.page, totalPages);
  const rows = await sql`SELECT ${summarySelect(sql)}
    FROM blog_posts p
    LEFT JOIN blog_categories c ON c.id = p.category_id
    LEFT JOIN blog_post_types t ON t.id = p.post_type_id
    WHERE ${publicFilters(sql, query)}
    ORDER BY ${publicOrder(sql, query.sort, query.locale)}
    LIMIT ${query.limit} OFFSET ${(page - 1) * query.limit}`;
  return { posts: rows.map((row) => mapSummary(row as Row)), total, page, pageSize: query.limit, totalPages };
}

/** All categories and tags, for the archive filter controls and the public filters API. */
export async function listBlogFilters(): Promise<{ categories: BlogCategory[]; tags: BlogTag[] }> {
  const sql = getDatabase();
  const [categoryRows, tagRows] = await Promise.all([
    sql`SELECT id, slug, name_en, name_ar, description_en, description_ar, created_at, updated_at
      FROM blog_categories ORDER BY name_en ASC`,
    sql`SELECT id, slug, name_en, name_ar, created_at FROM blog_tags ORDER BY name_en ASC`,
  ]);
  return {
    categories: categoryRows.map((row) => mapCategory(row as Row)),
    tags: tagRows.map((row) => mapTag(row as Row)),
  };
}

/** Public detail: returns null unless the post is published and due. Deduplicated per request. */
export const getPublishedBlogPost = cache(async (slug: string): Promise<BlogPost | null> => {
  const sql = getDatabase();
  const rows = await sql`SELECT ${summarySelect(sql)}, p.body_en, p.body_ar
    FROM blog_posts p
    LEFT JOIN blog_categories c ON c.id = p.category_id
    LEFT JOIN blog_post_types t ON t.id = p.post_type_id
    WHERE p.slug = ${slug} AND p.status = 'published' AND p.published_at <= now()
    LIMIT 1`;
  if (!rows.length) return null;
  const row = rows[0] as Row;
  const tags = await loadPostTags(sql, str(row.id));
  return mapPost(row, tags);
});

/** Same-category posts first, then the most recent others, excluding the current post. */
export async function listRelatedBlogPosts(postId: string, categoryId: string | null, limit = 3): Promise<BlogPostSummary[]> {
  const sql = getDatabase();
  const rows = await sql`SELECT ${summarySelect(sql)}
    FROM blog_posts p
    LEFT JOIN blog_categories c ON c.id = p.category_id
    LEFT JOIN blog_post_types t ON t.id = p.post_type_id
    WHERE p.status = 'published' AND p.published_at <= now() AND p.id <> ${postId}::uuid
    ORDER BY COALESCE(p.category_id = ${categoryId}::uuid, false) DESC, p.published_at DESC
    LIMIT ${limit}`;
  return rows.map((row) => mapSummary(row as Row));
}

/** Slugs and last-modified times for the sitemap. */
export async function listPublishedBlogSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  const sql = getDatabase();
  const rows = await sql`SELECT slug, updated_at FROM blog_posts
    WHERE status = 'published' AND published_at <= now()
    ORDER BY published_at DESC, id DESC LIMIT 5000`;
  return rows.map((row) => ({ slug: str(row.slug), updated_at: iso(row.updated_at) }));
}

/** Admin detail: any status, including drafts and archived posts. */
export async function getBlogPostForAdmin(id: string): Promise<BlogPost | null> {
  const sql = getDatabase();
  const rows = await sql`SELECT ${summarySelect(sql)}, p.body_en, p.body_ar
    FROM blog_posts p
    LEFT JOIN blog_categories c ON c.id = p.category_id
    LEFT JOIN blog_post_types t ON t.id = p.post_type_id
    WHERE p.id = ${id}::uuid
    LIMIT 1`;
  if (!rows.length) return null;
  const row = rows[0] as Row;
  const tags = await loadPostTags(sql, id);
  return mapPost(row, tags);
}

export function postgresErrorCode(error: unknown): string | null {
  if (typeof error === "object" && error !== null && "code" in error) return String((error as { code: unknown }).code);
  return null;
}

export type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413 };

/** Reads a JSON body with a hard byte cap, checking both declared and actual size. */
export async function readJsonBody(request: Request, maxBytes: number): Promise<JsonBodyResult> {
  if (Number(request.headers.get("content-length") || 0) > maxBytes) return { ok: false, status: 413 };
  let text: string;
  try {
    text = await request.text();
  } catch {
    return { ok: false, status: 400 };
  }
  if (new TextEncoder().encode(text).byteLength > maxBytes) return { ok: false, status: 413 };
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, status: 400 };
  }
}

/** Escapes LIKE wildcards so user search text is matched literally. */
export function likePattern(value: string) {
  return `%${value.replace(/[\\%_]/g, "\\$&")}%`;
}
