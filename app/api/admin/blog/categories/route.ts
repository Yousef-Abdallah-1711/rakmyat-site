import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession, requireSameOrigin } from "@/lib/server/security";
import { getDatabase } from "@/lib/server/db";
import { postgresErrorCode, readJsonBody } from "@/lib/server/blog";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie" };
const MAX_BODY_BYTES = 32 * 1024;

const createSchema = z.object({
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name_en: z.string().trim().min(1).max(160),
  name_ar: z.string().trim().min(1).max(160),
  description_en: z.string().trim().max(2000).optional(),
  description_ar: z.string().trim().max(2000).optional(),
});

export async function GET() {
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
    const sql = getDatabase();
    const categories = await sql`SELECT id, slug, name_en, name_ar, description_en, description_ar, created_at, updated_at
      FROM blog_categories ORDER BY name_en ASC`;
    return NextResponse.json({ categories }, { headers: noStore });
  } catch {
    console.error("admin_blog_categories_unavailable");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: noStore });
  }
}

export async function POST(request: Request) {
  if (!await requireSameOrigin(request)) return NextResponse.json({ error: "origin_rejected" }, { status: 403, headers: noStore });
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
    const parsedBody = await readJsonBody(request, MAX_BODY_BYTES);
    if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.status === 413 ? "payload_too_large" : "invalid_request" }, { status: parsedBody.status, headers: noStore });
    const body = createSchema.safeParse(parsedBody.value);
    if (!body.success) return NextResponse.json({ error: "invalid_fields" }, { status: 422, headers: noStore });
    const sql = getDatabase();
    const rows = await sql`INSERT INTO blog_categories (slug, name_en, name_ar, description_en, description_ar)
      VALUES (${body.data.slug}, ${body.data.name_en}, ${body.data.name_ar}, ${body.data.description_en ?? ""}, ${body.data.description_ar ?? ""})
      RETURNING id, slug, name_en, name_ar, description_en, description_ar, created_at, updated_at`;
    return NextResponse.json({ category: rows[0] }, { status: 201, headers: noStore });
  } catch (error) {
    if (postgresErrorCode(error) === "23505") return NextResponse.json({ error: "slug_taken" }, { status: 409, headers: noStore });
    console.error("admin_blog_category_create_failed");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: noStore });
  }
}
