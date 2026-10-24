import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { blogIdSchema } from "@/lib/blog-schema";
import { getAdminSession, requireSameOrigin } from "@/lib/server/security";
import { getDatabase } from "@/lib/server/db";
import { readJsonBody } from "@/lib/server/blog";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie" };
const MAX_BODY_BYTES = 16 * 1024;

// Refreshes the blog index and every post page: the pattern matches all [locale]/blog/[slug] pages.
function revalidateBlogPages() {
  revalidatePath("/en/blog");
  revalidatePath("/ar/blog");
  revalidatePath("/[locale]/blog/[slug]", "page");
}

// Slugs are immutable once created, so the strict schema rejects a `slug` key outright.
const updateSchema = z.strictObject({
  name_en: z.string().trim().min(1).max(160),
  name_ar: z.string().trim().min(1).max(160),
}).partial().refine((value) => Object.keys(value).length > 0);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireSameOrigin(request)) return NextResponse.json({ error: "origin_rejected" }, { status: 403, headers: noStore });
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
    const { id } = await params;
    if (!blogIdSchema.safeParse(id).success) return NextResponse.json({ error: "not_found" }, { status: 404, headers: noStore });
    const parsedBody = await readJsonBody(request, MAX_BODY_BYTES);
    if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.status === 413 ? "payload_too_large" : "invalid_request" }, { status: parsedBody.status, headers: noStore });
    const body = updateSchema.safeParse(parsedBody.value);
    if (!body.success) return NextResponse.json({ error: "invalid_fields", fields: [...new Set(body.error.issues.map((issue) => String(issue.path[0] ?? "body")))] }, { status: 422, headers: noStore });

    const sql = getDatabase();
    const rows = await sql`UPDATE blog_tags SET ${sql(body.data)} WHERE id = ${id}::uuid
      RETURNING id, slug, name_en, name_ar, created_at`;
    if (!rows.length) return NextResponse.json({ error: "not_found" }, { status: 404, headers: noStore });
    // Write is committed; post pages and the index both render the tag name.
    revalidateBlogPages();
    return NextResponse.json({ tag: rows[0] }, { headers: noStore });
  } catch {
    console.error("admin_blog_tag_update_failed");
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
    const deleted = await sql.begin(async (tx) => {
      const existing = await tx`SELECT id FROM blog_tags WHERE id = ${id}::uuid FOR UPDATE`;
      if (!existing.length) return false;
      // Detach the tag from every post first, then remove it.
      await tx`DELETE FROM blog_post_tags WHERE tag_id = ${id}::uuid`;
      await tx`DELETE FROM blog_tags WHERE id = ${id}::uuid`;
      return true;
    });
    if (!deleted) return NextResponse.json({ error: "not_found" }, { status: 404, headers: noStore });
    // Write is committed; the tag was removed from posts, so index and post pages are refreshed.
    revalidateBlogPages();
    return NextResponse.json({ deleted: true }, { headers: noStore });
  } catch {
    console.error("admin_blog_tag_delete_failed");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: noStore });
  }
}
