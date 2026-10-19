import { NextResponse } from "next/server";
import { destroyAdminSession, getAdminSession, requireSameOrigin } from "@/lib/server/security";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  if (!await requireSameOrigin(request)) return NextResponse.json({ error: "origin_rejected" }, { status: 403 });
  if (await getAdminSession()) await destroyAdminSession();
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
