import { NextResponse } from "next/server";
import { revalidateBlogPaths } from "@/lib/server/blog-revalidation";
import { blogIdSchema, blogPostUpdateSchema } from "@/lib/blog-schema";
import { getAdminSession, requireSameOrigin } from "@/lib/server/security";
import { getDatabase } from "@/lib/server/db";
import { getBlogPostForAdmin, postgresErrorCode, readJsonBody } from "@/lib/server/blog";
import { sanitizeBody } from "@/lib/sanitize-html";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie" };
const MAX_BODY_BYTES = 512 * 1024;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
    const { id } = await params;
    if (!blogIdSchema.safeParse(id).success) return NextResponse.json({ error: "not_found" }, { status: 404, headers: noStore });
    const post = await getBlogPostForAdmin(id);
    if (!post) return NextResponse.json({ error: "not_found" }, { status: 404, headers: noStore });
    return NextResponse.json({ post }, { headers: { ...noStore, ETag: `"${post.revision}"` } });
  } catch {
    console.error("admin_blog_post_read_failed");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: noStore });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireSameOrigin(request)) return NextResponse.json({ error: "origin_rejected" }, { status: 403, headers: noStore });
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
    const { id } = await params;
    if (!blogIdSchema.safeParse(id).success) return NextResponse.json({ error: "not_found" }, { status: 404, headers: noStore });
    const ifMatch = request.headers.get("if-match")?.trim().replace(/^"|"$/g, "");
    if (!ifMatch || !/^\d+$/.test(ifMatch) || !Number.isSafeInteger(Number(ifMatch))) return NextResponse.json({ error: "precondition_required" }, { status: 428, headers: noStore });
    const expectedRevision = Number(ifMatch);
    const parsedBody = await readJsonBody(request, MAX_BODY_BYTES);
    if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.status === 413 ? "payload_too_large" : "invalid_request" }, { status: parsedBody.status, headers: noStore });
    const body = blogPostUpdateSchema.safeParse(parsedBody.value);
    if (!body.success) return NextResponse.json({ error: "invalid_fields", fields: [...new Set(body.error.issues.map((issue) => String(issue.path[0] ?? "body")))] }, { status: 422, headers: noStore });

    // Mutable copy so rich-text bodies can be sanitized before they reach the UPDATE.
    const data = { ...body.data };
    if (data.body_en !== undefined) data.body_en = sanitizeBody(data.body_en);
    if (data.body_ar !== undefined) data.body_ar = sanitizeBody(data.body_ar);
    const sql = getDatabase();
    const result = await sql.begin(async (tx) => {
      const current = await tx`SELECT slug, status, published_at, revision, deleted_at FROM blog_posts WHERE id = ${id}::uuid FOR UPDATE`;
      if (!current.length) return { kind: "missing" as const };
      if (current[0].deleted_at) return { kind: "trashed" as const };
      const previousSlug = String(current[0].slug);
      if (Number(current[0].revision) !== expectedRevision) return { kind: "stale" as const };

      const updates: Record<string, string | Date | null | number> = { updated_at: new Date() };
      const copyFields = [
        "slug", "title_en", "title_ar", "excerpt_en", "excerpt_ar", "body_en", "body_ar",
        "cover_image_url", "category_id", "post_type_id", "author_name", "locale_primary",
        "seo_title_en", "seo_title_ar", "seo_description_en", "seo_description_ar", "status",
      ] as const;
      for (const field of copyFields) {
        if (data[field] !== undefined) updates[field] = data[field] as string | null;
      }

      // Publish time: an explicit value wins; otherwise the first move to "published" stamps now().
      const nextStatus = data.status ?? String(current[0].status);
      let publishedAt: Date | null = current[0].published_at ? new Date(current[0].published_at as string | Date) : null;
      if (data.published_at !== undefined) publishedAt = data.published_at ? new Date(data.published_at) : null;
      if (nextStatus === "published" && !publishedAt) publishedAt = new Date();
      if (data.published_at !== undefined || nextStatus === "published") updates.published_at = publishedAt;

      updates.revision = Number(current[0].revision) + 1;
      await tx`UPDATE blog_posts SET ${tx(updates)} WHERE id = ${id}::uuid`;

      if (data.tag_ids !== undefined) {
        await tx`DELETE FROM blog_post_tags WHERE post_id = ${id}::uuid`;
        for (const tagId of [...new Set(data.tag_ids)]) {
          await tx`INSERT INTO blog_post_tags (post_id, tag_id) VALUES (${id}::uuid, ${tagId}::uuid)`;
        }
      }
      const post = await getBlogPostForAdmin(id, tx);
      if (!post) throw new Error("updated_post_readback_missing");
      return { kind: "updated" as const, previousSlug, post };
    });
    if (result.kind === "missing") return NextResponse.json({ error: "not_found" }, { status: 404, headers: noStore });
    if (result.kind === "trashed") return NextResponse.json({ error: "post_trashed" }, { status: 409, headers: noStore });
    if (result.kind === "stale") return NextResponse.json({ error: "stale_revision" }, { status: 409, headers: { ...noStore, "ETag": `"${expectedRevision}"` } });
    revalidateBlogPaths([result.previousSlug, result.post.slug]);
    return NextResponse.json({ post: result.post }, { headers: { ...noStore, ETag: `"${result.post.revision}"` } });
  } catch (error) {
    const code = postgresErrorCode(error);
    if (code === "23505") return NextResponse.json({ error: "slug_taken" }, { status: 409, headers: noStore });
    if (code === "23503") return NextResponse.json({ error: "invalid_reference" }, { status: 422, headers: noStore });
    console.error("admin_blog_post_update_failed");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: noStore });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireSameOrigin(request)) return NextResponse.json({ error: "origin_rejected" }, { status: 403, headers: noStore });
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
    const { id } = await params;
    if (!blogIdSchema.safeParse(id).success) return NextResponse.json({ error: "not_found" }, { status: 404, headers: noStore });
    const sql = getDatabase();
    const rows = await sql`UPDATE blog_posts SET deleted_at = now(), updated_at = now(), revision = revision + 1
      WHERE id = ${id}::uuid AND deleted_at IS NULL RETURNING id, slug, deleted_at`;
    if (!rows.length) return NextResponse.json({ error: "not_found" }, { status: 404, headers: noStore });
    revalidateBlogPaths([String(rows[0].slug ?? "")]);
    return NextResponse.json({ deleted: true, deleted_at: rows[0].deleted_at }, { headers: noStore });
  } catch {
    console.error("admin_blog_post_delete_failed");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: noStore });
  }
}
