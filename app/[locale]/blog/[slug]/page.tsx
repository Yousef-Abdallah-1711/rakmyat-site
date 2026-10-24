import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostSection } from "@/components/sections/BlogPostSection";
import { BlogPostProgressBar } from "@/components/sections/BlogProgressBar";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { blogLocaleCopy } from "@/content/blog-copy";
import { localeCopy, type Locale } from "@/content/i18n";
import { blogExcerpt, blogTitle } from "@/components/sections/BlogPostCard";
import { getPublishedBlogPost, listRelatedBlogPosts } from "@/lib/server/blog";
import { publicRouteMetadata } from "@/lib/seo";
import { getIndexableSiteOrigin } from "@/lib/site-url";
import { escapeJsonLd } from "@/lib/structured-data";

// Post content is cached for an hour and regenerated in the background afterwards.
export const revalidate = 3600;

type RouteParams = { locale: string; slug: string };
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function resolveLocale(value: string): Locale | null {
  return value === "en" || value === "ar" ? value : null;
}

function resolveSlug(value: string): string | null {
  return value.length <= 200 && slugPattern.test(value) ? value : null;
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { locale: localeParam, slug: slugParam } = await params;
  const locale = resolveLocale(localeParam);
  if (!locale) return {};
  const notFoundMetadata: Metadata = {
    title: localeCopy[locale].notFoundTitle,
    description: localeCopy[locale].notFoundText,
    robots: { index: false, follow: false },
  };
  const slug = resolveSlug(slugParam);
  if (!slug || !process.env.DATABASE_URL) return notFoundMetadata;
  const post = await getPublishedBlogPost(slug);
  if (!post) return notFoundMetadata;

  const siteUrl = getIndexableSiteOrigin();
  const title = (locale === "ar" ? post.seo_title_ar : post.seo_title_en)?.trim() || blogTitle(post, locale);
  const description = (locale === "ar" ? post.seo_description_ar : post.seo_description_en)?.trim() || blogExcerpt(post, locale) || undefined;
  const image = post.cover_image_url
    ? (siteUrl && post.cover_image_url.startsWith("/") ? new URL(post.cover_image_url, siteUrl).toString() : post.cover_image_url)
    : undefined;
  return {
    title,
    description,
    ...publicRouteMetadata(locale, `/blog/${slug}`, siteUrl),
    openGraph: {
      title,
      description,
      siteName: locale === "ar" ? "رقميات" : "Rakmyat",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "article",
      url: siteUrl ? new URL(`/${locale}/blog/${slug}`, siteUrl).toString() : undefined,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
      ...(image ? { images: [{ url: image, alt: title }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function LocalizedBlogPostPage({ params }: { params: Promise<RouteParams> }) {
  const { locale: localeParam, slug: slugParam } = await params;
  const locale = resolveLocale(localeParam);
  if (!locale) notFound();
  const slug = resolveSlug(slugParam);
  if (!slug || !process.env.DATABASE_URL) notFound();
  const post = await getPublishedBlogPost(slug);
  if (!post) notFound();

  const related = await listRelatedBlogPosts(post.id, post.category_id);
  const siteUrl = getIndexableSiteOrigin();
  const copy = blogLocaleCopy(locale);
  const title = blogTitle(post, locale);
  const description = (locale === "ar" ? post.seo_description_ar : post.seo_description_en)?.trim() || blogExcerpt(post, locale) || undefined;
  const postUrl = siteUrl ? new URL(`/${locale}/blog/${slug}`, siteUrl).toString() : undefined;
  const image = post.cover_image_url && siteUrl && post.cover_image_url.startsWith("/")
    ? new URL(post.cover_image_url, siteUrl).toString()
    : post.cover_image_url ?? undefined;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: locale,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: post.author_name },
    publisher: { "@type": "Organization", name: "Rakmyat", alternateName: "رقميات" },
    ...(image ? { image: [image] } : {}),
    ...(postUrl ? { url: postUrl, mainEntityOfPage: { "@type": "WebPage", "@id": postUrl } } : {}),
  };
  const breadcrumbJsonLd = siteUrl ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: copy.home, item: new URL(`/${locale}`, siteUrl).toString() },
      { "@type": "ListItem", position: 2, name: copy.blog, item: new URL(`/${locale}/blog`, siteUrl).toString() },
      { "@type": "ListItem", position: 3, name: title, item: postUrl },
    ],
  } : null;

  return (
    <SiteLayout activePage="blog" locale={locale} borderedFooter>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(articleJsonLd) }} />
      {breadcrumbJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(breadcrumbJsonLd) }} />}
      <BlogPostProgressBar locale={locale} />
      <BlogPostSection locale={locale} post={post} related={related} postUrl={postUrl} />
    </SiteLayout>
  );
}
