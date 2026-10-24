import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog-schema";
import { blogLocaleCopy } from "@/content/blog-copy";
import type { Locale } from "@/content/i18n";
import styles from "./Blog.module.css";

// Kept in a server-safe module: the archive (a client component) and the single-post page both import these helpers.
const placeholderImage = "/assets/rakmyat/brand/rakmyat-mark.webp";

export type BlogView = "grid" | "list";

export function blogTitle(post: Pick<BlogPostSummary, "title_en" | "title_ar">, locale: Locale) {
  return locale === "ar" ? post.title_ar : post.title_en;
}

export function blogExcerpt(post: Pick<BlogPostSummary, "excerpt_en" | "excerpt_ar">, locale: Locale) {
  return locale === "ar" ? post.excerpt_ar : post.excerpt_en;
}

export function formatBlogDate(value: string | null, locale: Locale) {
  if (!value) return "";
  return new Intl.DateTimeFormat(blogLocaleCopy(locale).dateLocale, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(value));
}

export function BlogPostCard({ post, locale, variant = "grid" }: { post: BlogPostSummary; locale: Locale; variant?: BlogView }) {
  const copy = blogLocaleCopy(locale);
  const title = blogTitle(post, locale);
  const excerpt = blogExcerpt(post, locale);
  const categoryName = locale === "ar" ? post.category_name_ar : post.category_name_en;
  const postTypeName = locale === "ar" ? post.post_type_name_ar : post.post_type_name_en;
  const href = `/${locale}/blog/${post.slug}`;
  const published = formatBlogDate(post.published_at, locale);
  const minutes = locale === "ar" ? post.reading_minutes_ar : post.reading_minutes_en;
  const cardClass = variant === "list" ? `${styles.card} ${styles.cardList}` : styles.card;

  return <article className={cardClass} lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
    <div className={styles.media}>
      {post.cover_image_url
        ? <img className={styles.cover} src={post.cover_image_url} alt="" loading="lazy" decoding="async" />
        : <div className={`${styles.cover} ${styles.coverPlaceholder}`} aria-hidden="true"><img src={placeholderImage} alt="" /></div>}
    </div>
    <div className={styles.cardBody}>
      {(categoryName || postTypeName) && <ul className={styles.badges} aria-label={copy.category}>
        {categoryName && <li className={styles.badgePrimary}>{categoryName}</li>}
        {postTypeName && <li className={styles.badge}>{postTypeName}</li>}
      </ul>}
      <h2 className={styles.cardTitle}><Link href={href}>{title}</Link></h2>
      {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
      <ul className={styles.meta}>
        <li>{copy.by} {post.author_name}</li>
        {published && <li><time dateTime={post.published_at ?? undefined}>{published}</time></li>}
        <li><span aria-hidden="true">⏱ </span>{copy.minRead(minutes)}</li>
      </ul>
      <Link href={href} className={styles.readMore}>{copy.readMore} <span aria-hidden="true">{locale === "ar" ? "←" : "→"}</span><span className="visually-hidden"> · {title}</span></Link>
    </div>
  </article>;
}

/** Placeholder cards shown while results load. They share the card's structure so the layout does not jump. */
export function BlogGridSkeleton({ count = 6, view = "grid" }: { count?: number; view?: BlogView }) {
  const cardClass = view === "list" ? `${styles.skeletonCard} ${styles.cardList}` : styles.skeletonCard;
  return <ul className={view === "list" ? styles.listGrid : styles.grid} aria-hidden="true" data-testid="blog-skeleton">
    {Array.from({ length: count }, (_, index) => <li key={index}>
      <div className={cardClass}>
        <div className={`${styles.skeletonMedia} ${styles.shimmer}`} />
        <div className={styles.skeletonBody}>
          <div className={`${styles.skeletonLine} ${styles.skeletonShort} ${styles.shimmer}`} />
          <div className={`${styles.skeletonLine} ${styles.shimmer}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonWide} ${styles.shimmer}`} />
          <div className={`${styles.skeletonLine} ${styles.shimmer}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonShort} ${styles.shimmer}`} />
        </div>
      </div>
    </li>)}
  </ul>;
}
