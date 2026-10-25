import { NextResponse } from "next/server";
import { blogIdSchema } from "@/lib/blog-schema";
import { getAdminSession, requireSameOrigin } from "@/lib/server/security";
import { getDatabase } from "@/lib/server/db";
import { getBlogPostForAdmin } from "@/lib/server/blog";
import { revalidateBlogPaths } from "@/lib/server/blog-revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie" };

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireSameOrigin(request)) return NextResponse.json({ error: "origin_rejected" }, { status: 403, headers: noStore });
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
    const { id } = await params;
    if (!blogIdSchema.safeParse(id).success) return NextResponse.json({ error: "not_found" }, { status: 404, headers: noStore });
    const sql = getDatabase();
    const post = await sql.begin(async (tx) => {
      const rows = await tx`UPDATE blog_posts SET deleted_at = NULL, updated_at = now(), revision = revision + 1
        WHERE id = ${id}::uuid AND deleted_at IS NOT NULL RETURNING id`;
      if (!rows.length) return null;
      const restored = await getBlogPostForAdmin(id, tx);
      if (!restored) throw new Error("restored_post_readback_missing");
      return restored;
    });
    if (!post) return NextResponse.json({ error: "not_found" }, { status: 404, headers: noStore });
    revalidateBlogPaths([post.slug]);
    return NextResponse.json({ post }, { headers: { ...noStore, ETag: `"${post.revision}"` } });
  } catch {
    console.error("admin_blog_post_restore_failed");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: noStore });
  }
}
