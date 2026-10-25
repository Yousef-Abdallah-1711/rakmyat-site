import { NextResponse } from "next/server";
import { revalidateBlogPaths } from "@/lib/server/blog-revalidation";
import { blogPostCreateSchema, blogPostStatuses } from "@/lib/blog-schema";
import { getAdminSession, requireSameOrigin } from "@/lib/server/security";
import { getDatabase } from "@/lib/server/db";
import { getBlogPostForAdmin, likePattern, postgresErrorCode, readJsonBody } from "@/lib/server/blog";
import { sanitizeBody } from "@/lib/sanitize-html";
import { z } from "zod";
import { createHash } from "node:crypto";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie" };
const PAGE_SIZE = 25;
const MAX_BODY_BYTES = 512 * 1024;
const uuidSchema = z.string().uuid();

export async function GET(request: Request) {
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
    const url = new URL(request.url);
    const status = url.searchParams.get("status") ?? "all";
    const category = url.searchParams.get("category") ?? "all";
    const q = url.searchParams.get("q")?.trim().slice(0, 120) ?? "";
    const requestedPage = url.searchParams.get("page") ?? "1";
    if (status !== "all" && status !== "trashed" && !blogPostStatuses.includes(status as typeof blogPostStatuses[number])) return NextResponse.json({ error: "invalid_status" }, { status: 400, headers: noStore });
    if (category !== "all" && !uuidSchema.safeParse(category).success) return NextResponse.json({ error: "invalid_category" }, { status: 400, headers: noStore });
    if (!/^\d+$/.test(requestedPage) || Number(requestedPage) < 1 || Number(requestedPage) > 100000) return NextResponse.json({ error: "invalid_page" }, { status: 400, headers: noStore });

    const statusFilter = status === "all" || status === "trashed" ? null : status;
    const deletedFilter = status === "trashed";
    const categoryFilter = category === "all" ? null : category;
    const search = q === "" ? null : likePattern(q);
    const sql = getDatabase();

    const countRows = await sql`SELECT count(*)::int AS total FROM blog_posts p
      WHERE (${deletedFilter}::boolean IS NULL OR (p.deleted_at IS NOT NULL) = ${deletedFilter}::boolean)
      AND (${statusFilter}::text IS NULL OR p.status = ${statusFilter}::text)
      AND (${categoryFilter}::uuid IS NULL OR p.category_id = ${categoryFilter}::uuid)
      AND (${search}::text IS NULL OR p.title_en ILIKE ${search}::text OR p.title_ar ILIKE ${search}::text OR p.slug ILIKE ${search}::text)`;
    const total = Number(countRows[0]?.total ?? 0);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const page = Math.min(Number(requestedPage), totalPages);
    const offset = (page - 1) * PAGE_SIZE;

    const rows = await sql`SELECT p.id, p.slug, p.title_en, p.title_ar, p.status, p.locale_primary, p.author_name,
        p.category_id, p.post_type_id, p.published_at, p.created_at, p.updated_at, p.revision, p.deleted_at,
        c.name_en AS category_name_en, c.name_ar AS category_name_ar,
        t.name_en AS post_type_name_en, t.name_ar AS post_type_name_ar
      FROM blog_posts p
      LEFT JOIN blog_categories c ON c.id = p.category_id
      LEFT JOIN blog_post_types t ON t.id = p.post_type_id
      WHERE (${deletedFilter}::boolean IS NULL OR (p.deleted_at IS NOT NULL) = ${deletedFilter}::boolean)
      AND (${statusFilter}::text IS NULL OR p.status = ${statusFilter}::text)
      AND (${categoryFilter}::uuid IS NULL OR p.category_id = ${categoryFilter}::uuid)
      AND (${search}::text IS NULL OR p.title_en ILIKE ${search}::text OR p.title_ar ILIKE ${search}::text OR p.slug ILIKE ${search}::text)
      ORDER BY p.updated_at DESC, p.id DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`;

    const metrics = await sql`SELECT count(*) FILTER (WHERE deleted_at IS NULL)::int AS total,
        count(*) FILTER (WHERE deleted_at IS NULL AND status = 'published')::int AS published,
        count(*) FILTER (WHERE deleted_at IS NULL AND status = 'draft')::int AS drafts,
        count(*) FILTER (WHERE deleted_at IS NOT NULL)::int AS trashed
      FROM blog_posts`;

    return NextResponse.json({ posts: rows, metrics: metrics[0], page, pageSize: PAGE_SIZE, total, totalPages }, { headers: noStore });
  } catch {
    console.error("admin_blog_posts_unavailable");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: noStore });
  }
}

export async function POST(request: Request) {
  if (!await requireSameOrigin(request)) return NextResponse.json({ error: "origin_rejected" }, { status: 403, headers: noStore });
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
    const parsedBody = await readJsonBody(request, MAX_BODY_BYTES);
    if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.status === 413 ? "payload_too_large" : "invalid_request" }, { status: parsedBody.status, headers: noStore });
    const body = blogPostCreateSchema.safeParse(parsedBody.value);
    if (!body.success) return NextResponse.json({ error: "invalid_fields", fields: [...new Set(body.error.issues.map((issue) => String(issue.path[0] ?? "body")))] }, { status: 422, headers: noStore });

    const data = body.data;
    const idempotencyKey = request.headers.get("idempotency-key")?.trim() ?? "";
    if (idempotencyKey.length > 200 || [...idempotencyKey].some((character) => character.charCodeAt(0) <= 31 || character.charCodeAt(0) === 127)) return NextResponse.json({ error: "invalid_idempotency_key" }, { status: 400, headers: noStore });
    // Rich-text bodies are sanitized before storage; legacy plain-text bodies pass through unchanged.
    const cleanBodyEn = sanitizeBody(data.body_en ?? "");
    const cleanBodyAr = sanitizeBody(data.body_ar ?? "");
    const tagIds = [...new Set(data.tag_ids ?? [])];
    const sql = getDatabase();
    const keyHash = idempotencyKey ? createHash("sha256").update(idempotencyKey).digest("hex") : null;
    const requestHash = createHash("sha256").update(JSON.stringify({ ...data, body_en: cleanBodyEn, body_ar: cleanBodyAr, tag_ids: tagIds })).digest("hex");
    const created = await sql.begin(async (tx) => {
      if (keyHash) {
        const claimed = await tx`INSERT INTO blog_post_idempotency (key_hash, request_hash)
          VALUES (${keyHash}, ${requestHash}) ON CONFLICT (key_hash) DO NOTHING RETURNING key_hash`;
        if (!claimed.length) {
          const existing = await tx`SELECT request_hash, post_id FROM blog_post_idempotency WHERE key_hash = ${keyHash} FOR UPDATE`;
          if (!existing.length) throw new Error("idempotency_record_missing");
          if (String(existing[0].request_hash) !== requestHash) return { kind: "conflict" as const };
          if (!existing[0].post_id) throw new Error("idempotency_record_incomplete");
          const post = await getBlogPostForAdmin(String(existing[0].post_id), tx);
          if (!post) throw new Error("idempotency_post_missing");
          return { kind: "replay" as const, post };
        }
      }
      // New posts always start as drafts; status and publish time are only set through PATCH.
      const inserted = await tx`INSERT INTO blog_posts ${tx({
        slug: data.slug,
        title_en: data.title_en,
        title_ar: data.title_ar,
        excerpt_en: data.excerpt_en,
        excerpt_ar: data.excerpt_ar,
        body_en: cleanBodyEn,
        body_ar: cleanBodyAr,
        cover_image_url: data.cover_image_url,
        category_id: data.category_id,
        post_type_id: data.post_type_id,
        author_name: data.author_name,
        locale_primary: data.locale_primary,
        seo_title_en: data.seo_title_en,
        seo_title_ar: data.seo_title_ar,
        seo_description_en: data.seo_description_en,
        seo_description_ar: data.seo_description_ar,
        status: "draft",
        published_at: null,
      })} RETURNING id`;
      const postId = String(inserted[0].id);
      for (const tagId of tagIds) {
        await tx`INSERT INTO blog_post_tags (post_id, tag_id) VALUES (${postId}::uuid, ${tagId}::uuid)`;
      }
      if (keyHash) await tx`UPDATE blog_post_idempotency SET post_id = ${postId}::uuid WHERE key_hash = ${keyHash}`;
      const post = await getBlogPostForAdmin(postId, tx);
      if (!post) throw new Error("created_post_readback_missing");
      return { kind: "created" as const, post };
    });
    if (created.kind === "conflict") return NextResponse.json({ error: "idempotency_conflict" }, { status: 409, headers: noStore });
    // Write is committed; refresh the cached blog index for both locales.
    revalidateBlogPaths([created.post.slug]);
    return NextResponse.json({ post: created.post }, { status: created.kind === "created" ? 201 : 200, headers: noStore });
  } catch (error) {
    const code = postgresErrorCode(error);
    if (code === "23505") return NextResponse.json({ error: "slug_taken" }, { status: 409, headers: noStore });
    if (code === "23503") return NextResponse.json({ error: "invalid_reference" }, { status: 422, headers: noStore });
    console.error("admin_blog_post_create_failed");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: noStore });
  }
}
