import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/server/security";
import { getDatabase } from "@/lib/server/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie" };

export async function GET() {
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
    const sql = getDatabase();
    const postTypes = await sql`SELECT id, slug, name_en, name_ar, created_at FROM blog_post_types ORDER BY name_en ASC`;
    return NextResponse.json({ postTypes }, { headers: noStore });
  } catch {
    console.error("admin_blog_post_types_unavailable");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: noStore });
  }
}
