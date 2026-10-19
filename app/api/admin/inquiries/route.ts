import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/server/security";
import { getDatabase } from "@/lib/server/db";
import { inquiryStatuses } from "@/lib/inquiry-schema";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie" };
export async function GET(request: Request) {
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
    const url = new URL(request.url); const q = url.searchParams.get("q")?.trim().slice(0, 120) ?? ""; const status = url.searchParams.get("status") ?? "all";
    if (status !== "all" && !inquiryStatuses.includes(status as typeof inquiryStatuses[number])) return NextResponse.json({ error: "invalid_status" }, { status: 400, headers: noStore });
    const sql = getDatabase();
    const rows = status === "all"
      ? await sql`SELECT * FROM inquiries WHERE (${q}='' OR full_name ILIKE ${`%${q}%`} OR phone ILIKE ${`%${q}%`} OR coalesce(email,'') ILIKE ${`%${q}%`} OR coalesce(company,'') ILIKE ${`%${q}%`}) ORDER BY created_at DESC LIMIT 100`
      : await sql`SELECT * FROM inquiries WHERE status=${status} AND (${q}='' OR full_name ILIKE ${`%${q}%`} OR phone ILIKE ${`%${q}%`} OR coalesce(email,'') ILIKE ${`%${q}%`} OR coalesce(company,'') ILIKE ${`%${q}%`}) ORDER BY created_at DESC LIMIT 100`;
    const metrics = await sql`SELECT count(*)::int AS total, count(*) FILTER (WHERE status='new')::int AS new, count(*) FILTER (WHERE created_at >= now()-interval '30 days')::int AS last_30_days FROM inquiries`;
    return NextResponse.json({ inquiries: rows, metrics: metrics[0] }, { headers: noStore });
  } catch {
    console.error("admin_inquiries_unavailable");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: noStore });
  }
}
