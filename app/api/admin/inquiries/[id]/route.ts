import { NextResponse } from "next/server";
import { z } from "zod";
import { inquiryStatuses } from "@/lib/inquiry-schema";
import { getAdminSession, requireSameOrigin } from "@/lib/server/security";
import { getDatabase as database } from "@/lib/server/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const patchSchema = z.object({ status: z.enum(inquiryStatuses).optional(), privateNotes: z.string().max(5000).optional() }).refine((value) => Object.keys(value).length > 0);
const noStore = { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie" };
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireSameOrigin(request)) return NextResponse.json({ error: "origin_rejected" }, { status: 403, headers: noStore });
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
    const { id } = await params; if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "not_found" }, { status: 404, headers: noStore });
    if (Number(request.headers.get("content-length") || 0) > 8192) return NextResponse.json({ error: "payload_too_large" }, { status: 413, headers: noStore });
    let raw: unknown; try { const text = await request.text(); if (new TextEncoder().encode(text).byteLength > 8192) return NextResponse.json({ error: "payload_too_large" }, { status: 413, headers: noStore }); raw = JSON.parse(text); } catch { return NextResponse.json({ error: "invalid_request" }, { status: 400, headers: noStore }); }
    const body = patchSchema.safeParse(raw); if (!body.success) return NextResponse.json({ error: "invalid_fields" }, { status: 422, headers: noStore });
    const sql = database();
    const rows = body.data.status !== undefined && body.data.privateNotes !== undefined
      ? await sql`UPDATE inquiries SET status=${body.data.status}, private_notes=${body.data.privateNotes}, updated_at=now() WHERE id=${id} RETURNING id,status,private_notes,updated_at`
      : body.data.status !== undefined
        ? await sql`UPDATE inquiries SET status=${body.data.status}, updated_at=now() WHERE id=${id} RETURNING id,status,private_notes,updated_at`
        : await sql`UPDATE inquiries SET private_notes=${body.data.privateNotes!}, updated_at=now() WHERE id=${id} RETURNING id,status,private_notes,updated_at`;
    if (!rows.length) return NextResponse.json({ error: "not_found" }, { status: 404, headers: noStore });
    return NextResponse.json({ inquiry: rows[0] }, { headers: noStore });
  } catch {
    console.error("admin_inquiry_update_failed");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: noStore });
  }
}
