import { NextResponse } from "next/server";
import { getAdminIpAllowlist, getAdminSession, isAdminIpAllowlisted } from "@/lib/server/security";
import { getDatabase } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie" };

// Shows only the first 3 characters of each allowlisted IP, e.g. 192.168.1.100 -> "192***".
function maskIp(ip: string) {
  return `${ip.slice(0, 3)}***`;
}

// GET: security summary for the admin dashboard. Never returns full allowlisted IPs.
export async function GET(request: Request) {
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
    const sql = getDatabase();
    const rows = await sql`SELECT count(*)::int AS buckets FROM rate_limit_buckets`;
    const allowlistedIps = [...getAdminIpAllowlist()].map(maskIp);
    return NextResponse.json(
      {
        rateLimitBuckets: Number(rows[0]?.buckets ?? 0),
        ipAllowlisted: isAdminIpAllowlisted(request.headers),
        allowlistedIps,
      },
      { headers: noStore }
    );
  } catch {
    console.error("admin_security_unavailable");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: noStore });
  }
}
