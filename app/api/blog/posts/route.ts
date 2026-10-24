import { NextResponse } from "next/server";
import { listBlogFilters, listPublishedBlogPostsPage, type BlogPostSort } from "@/lib/server/blog";
export const runtime = "nodejs";
// The handler reads the request URL, so Next renders it per request; the one-hour cache lives in the
// Cache-Control header, which shared caches and browsers honor for every distinct query string.
export const dynamic = "force-dynamic";

const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";
const MAX_PAGE = 100000;
const MAX_LIMIT = 10;
const sortKeys: readonly BlogPostSort[] = ["newest", "oldest", "az", "za"];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function optionalText(value: string | null, max: number) {
  const trimmed = value?.trim().slice(0, max) ?? "";
  return trimmed === "" ? null : trimmed;
}

function optionalSlug(value: string | null) {
  const trimmed = value?.trim() ?? "";
  if (trimmed === "") return { ok: true as const, value: null };
  return trimmed.length <= 80 && slugPattern.test(trimmed) ? { ok: true as const, value: trimmed } : { ok: false as const };
}

function positiveInteger(value: string | null, fallback: number) {
  if (value === null || value.trim() === "") return fallback;
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 1 ? parsed : null;
}

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;

  const page = positiveInteger(params.get("page"), 1);
  if (page === null) return badRequest("invalid_page");
  const requestedLimit = positiveInteger(params.get("limit"), MAX_LIMIT);
  if (requestedLimit === null) return badRequest("invalid_limit");
  const limit = Math.min(requestedLimit, MAX_LIMIT);

  const sort = params.get("sort") ?? "newest";
  if (!sortKeys.includes(sort as BlogPostSort)) return badRequest("invalid_sort");

  const localeParam = params.get("locale") ?? "en";
  if (localeParam !== "en" && localeParam !== "ar") return badRequest("invalid_locale");

  const category = optionalSlug(params.get("category"));
  if (!category.ok) return badRequest("invalid_category");
  const tag = optionalSlug(params.get("tag"));
  if (!tag.ok) return badRequest("invalid_tag");

  try {
    const [result, filters] = await Promise.all([
      listPublishedBlogPostsPage({
        page: Math.min(page, MAX_PAGE),
        limit,
        category: category.value,
        tag: tag.value,
        author: optionalText(params.get("author"), 160),
        q: optionalText(params.get("q"), 120),
        sort: sort as BlogPostSort,
        locale: localeParam,
      }),
      listBlogFilters(),
    ]);
    return NextResponse.json(
      { ...result, categories: filters.categories, tags: filters.tags },
      { headers: { "Cache-Control": CACHE_CONTROL } },
    );
  } catch {
    console.error("public_blog_posts_unavailable");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
