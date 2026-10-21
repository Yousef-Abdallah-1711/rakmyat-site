import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/server/security";
import { getDatabase } from "@/lib/server/db";
import { inquiryStatuses } from "@/lib/inquiry-schema";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie" };
const PAGE_SIZE = 25;
export async function GET(request: Request) {
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
    const url = new URL(request.url); const q = url.searchParams.get("q")?.trim().slice(0, 120) ?? ""; const status = url.searchParams.get("status") ?? "all";
    if (status !== "all" && !inquiryStatuses.includes(status as typeof inquiryStatuses[number])) return NextResponse.json({ error: "invalid_status" }, { status: 400, headers: noStore });
    const requestedPage = url.searchParams.get("page") ?? "1";
    if (!/^\d+$/.test(requestedPage) || Number(requestedPage) < 1 || Number(requestedPage) > 100000) return NextResponse.json({ error: "invalid_page" }, { status: 400, headers: noStore });
    const sql = getDatabase();
    const filteredCount = await sql`SELECT count(*)::int AS total FROM inquiries
      WHERE (${status}='all' OR status=${status})
      AND (${q}='' OR full_name ILIKE ${`%${q}%`} OR phone ILIKE ${`%${q}%`} OR coalesce(email,'') ILIKE ${`%${q}%`} OR coalesce(company,'') ILIKE ${`%${q}%`})`;
    const total = Number(filteredCount[0]?.total ?? 0);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const page = Math.min(Number(requestedPage), totalPages);
    const offset = (page - 1) * PAGE_SIZE;
    const rows = await sql`SELECT * FROM inquiries
      WHERE (${status}='all' OR status=${status})
      AND (${q}='' OR full_name ILIKE ${`%${q}%`} OR phone ILIKE ${`%${q}%`} OR coalesce(email,'') ILIKE ${`%${q}%`} OR coalesce(company,'') ILIKE ${`%${q}%`})
      ORDER BY created_at DESC, id DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`;
    const metrics = await sql`SELECT count(*)::int AS total, count(*) FILTER (WHERE status='new')::int AS new, count(*) FILTER (WHERE created_at >= now()-interval '30 days')::int AS last_30_days FROM inquiries`;
    return NextResponse.json({ inquiries: rows, metrics: metrics[0], page, pageSize: PAGE_SIZE, total, totalPages }, { headers: noStore });
  } catch {
    console.error("admin_inquiries_unavailable");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: noStore });
  }
}
