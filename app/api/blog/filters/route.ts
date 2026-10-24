import { NextResponse } from "next/server";
import { listBlogFilters } from "@/lib/server/blog";
export const runtime = "nodejs";
// Rendered per request so a build or a cold start never freezes a database failure into the static output.
// Successful responses carry a one-hour shared-cache lifetime instead.
export const dynamic = "force-dynamic";

const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

export async function GET() {
  try {
    const filters = await listBlogFilters();
    return NextResponse.json(filters, { headers: { "Cache-Control": CACHE_CONTROL } });
  } catch {
    console.error("public_blog_filters_unavailable");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
