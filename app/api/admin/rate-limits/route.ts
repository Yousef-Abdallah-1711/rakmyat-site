import { NextResponse } from "next/server";
import { getAdminSession, requireSameOrigin } from "@/lib/server/security";
import { getDatabase } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie" };

// GET: current rate-limit bucket stats.
// adminLoginBuckets is a heuristic: bucket keys are keyed digests, so buckets with more than 3 hits
// are counted as likely admin login buckets rather than identified exactly.
export async function GET() {
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
    const sql = getDatabase();
    const rows = await sql`SELECT
        count(*)::int AS buckets,
        count(*) FILTER (WHERE hits > 3)::int AS admin_login_buckets,
        min(window_started_at) AS oldest_window
      FROM rate_limit_buckets`;
    const row = rows[0];
    const oldest = row?.oldest_window ? new Date(row.oldest_window as string | Date).toISOString().replace(/\.\d{3}Z$/, "Z") : null;
    return NextResponse.json(
      { buckets: Number(row?.buckets ?? 0), adminLoginBuckets: Number(row?.admin_login_buckets ?? 0), oldestWindow: oldest },
      { headers: noStore }
    );
  } catch {
    console.error("admin_rate_limits_unavailable");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: noStore });
  }
}

// DELETE: admin reset. Clears every rate_limit_buckets row and reports how many were removed.
export async function DELETE(request: Request) {
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
    if (!await requireSameOrigin(request)) return NextResponse.json({ error: "origin_rejected" }, { status: 403, headers: noStore });
    const sql = getDatabase();
    const rows = await sql`WITH deleted AS (DELETE FROM rate_limit_buckets RETURNING 1) SELECT count(*)::int AS cleared FROM deleted`;
    return NextResponse.json({ cleared: Number(rows[0]?.cleared ?? 0) }, { headers: noStore });
  } catch {
    console.error("admin_rate_limits_reset_unavailable");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: noStore });
  }
}
