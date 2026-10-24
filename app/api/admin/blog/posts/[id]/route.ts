import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
    return NextResponse.json({ post }, { headers: noStore });
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
    const parsedBody = await readJsonBody(request, MAX_BODY_BYTES);
    if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.status === 413 ? "payload_too_large" : "invalid_request" }, { status: parsedBody.status, headers: noStore });
    const body = blogPostUpdateSchema.safeParse(parsedBody.value);
    if (!body.success) return NextResponse.json({ error: "invalid_fields", fields: [...new Set(body.error.issues.map((issue) => String(issue.path[0] ?? "body")))] }, { status: 422, headers: noStore });

    // Mutable copy so rich-text bodies can be sanitized before they reach the UPDATE.
    const data = { ...body.data };
    if (data.body_en !== undefined) data.body_en = sanitizeBody(data.body_en);
    if (data.body_ar !== undefined) data.body_ar = sanitizeBody(data.body_ar);
    const sql = getDatabase();
    let previousSlug = "";
    const found = await sql.begin(async (tx) => {
      const current = await tx`SELECT slug, status, published_at FROM blog_posts WHERE id = ${id}::uuid FOR UPDATE`;
      if (!current.length) return false;
      previousSlug = String(current[0].slug);

      const updates: Record<string, string | Date | null> = { updated_at: new Date() };
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

      await tx`UPDATE blog_posts SET ${tx(updates)} WHERE id = ${id}::uuid`;

      if (data.tag_ids !== undefined) {
        await tx`DELETE FROM blog_post_tags WHERE post_id = ${id}::uuid`;
        for (const tagId of [...new Set(data.tag_ids)]) {
          await tx`INSERT INTO blog_post_tags (post_id, tag_id) VALUES (${id}::uuid, ${tagId}::uuid)`;
        }
      }
      return true;
    });
    if (!found) return NextResponse.json({ error: "not_found" }, { status: 404, headers: noStore });
    // Write is committed; refresh the blog index and both the old and new post URLs (slug may have changed).
    const currentSlug = data.slug ?? previousSlug;
    revalidatePath("/en/blog");
    revalidatePath("/ar/blog");
    for (const slug of new Set([previousSlug, currentSlug])) {
      if (!slug) continue;
      revalidatePath(`/en/blog/${slug}`);
      revalidatePath(`/ar/blog/${slug}`);
    }
    const post = await getBlogPostForAdmin(id);
    return NextResponse.json({ post }, { headers: noStore });
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
    const rows = await sql`DELETE FROM blog_posts WHERE id = ${id}::uuid RETURNING id, slug`;
    if (!rows.length) return NextResponse.json({ error: "not_found" }, { status: 404, headers: noStore });
    // Delete is committed; refresh the blog index and the deleted post's URLs.
    const deletedSlug = String(rows[0].slug ?? "");
    revalidatePath("/en/blog");
    revalidatePath("/ar/blog");
    if (deletedSlug) {
      revalidatePath(`/en/blog/${deletedSlug}`);
      revalidatePath(`/ar/blog/${deletedSlug}`);
    }
    return NextResponse.json({ deleted: true }, { headers: noStore });
  } catch {
    console.error("admin_blog_post_delete_failed");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: noStore });
  }
}
