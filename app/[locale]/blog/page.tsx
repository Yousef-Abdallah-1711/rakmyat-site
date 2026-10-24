import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndexSection, type BlogPostsPageData } from "@/components/sections/BlogIndexSection";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { blogLocaleCopy } from "@/content/blog-copy";
import type { Locale } from "@/content/i18n";
import { listBlogFilters, listPublishedBlogPostsPage } from "@/lib/server/blog";
import { publicRouteMetadata } from "@/lib/seo";
import { getIndexableSiteOrigin } from "@/lib/site-url";
import type { BlogCategory, BlogTag } from "@/lib/blog-schema";

// The archive is cached for an hour and regenerated in the background afterwards.
export const revalidate = 3600;

const PAGE_SIZE = 10;

type RouteParams = { locale: string };

function resolveLocale(value: string): Locale | null {
  return value === "en" || value === "ar" ? value : null;
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  if (!locale) return {};
  const copy = blogLocaleCopy(locale);
  const siteUrl = getIndexableSiteOrigin();
  const socialImageUrl = siteUrl ? new URL("/assets/rakmyat/brand/rakmyat-social.png", siteUrl).toString() : undefined;
  return {
    title: copy.indexTitle,
    description: copy.indexDescription,
    ...publicRouteMetadata(locale, "/blog", siteUrl),
    openGraph: {
      title: copy.indexTitle,
      description: copy.indexDescription,
      siteName: locale === "ar" ? "رقميات" : "Rakmyat",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
      url: siteUrl ? new URL(`/${locale}/blog`, siteUrl).toString() : undefined,
      ...(socialImageUrl ? { images: [{ url: socialImageUrl, width: 1200, height: 630, alt: locale === "ar" ? "رقميات — رؤى في البرمجيات" : "Rakmyat — Software Insights" }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: copy.indexTitle,
      description: copy.indexDescription,
      ...(socialImageUrl ? { images: [socialImageUrl] } : {}),
    },
  };
}

export default async function LocalizedBlogIndexPage({ params }: { params: Promise<RouteParams> }) {
  const locale = resolveLocale((await params).locale);
  if (!locale) notFound();

  // The first page is the unfiltered, newest-first view. Filtered URLs load their results on the client.
  const emptyPage: BlogPostsPageData = { posts: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 1 };
  let initialData: BlogPostsPageData = emptyPage;
  let categories: BlogCategory[] = [];
  let tags: BlogTag[] = [];
  if (process.env.DATABASE_URL) {
    try {
      const [firstPage, filters] = await Promise.all([
        listPublishedBlogPostsPage({ page: 1, limit: PAGE_SIZE, category: null, tag: null, author: null, q: null, sort: "newest", locale }),
        listBlogFilters(),
      ]);
      initialData = firstPage;
      categories = filters.categories;
      tags = filters.tags;
    } catch {
      // Keep the public site up; the empty state is shown instead of a server error.
      console.error("blog_index_unavailable");
    }
  }

  return (
    <SiteLayout activePage="blog" locale={locale} borderedFooter>
      <BlogIndexSection locale={locale} initialData={initialData} categories={categories} tags={tags} />
    </SiteLayout>
  );
}
