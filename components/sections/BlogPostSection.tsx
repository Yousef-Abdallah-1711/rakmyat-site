import Link from "next/link";
import type { BlogPost, BlogPostSummary } from "@/lib/blog-schema";
import { blogLocaleCopy } from "@/content/blog-copy";
import type { Locale } from "@/content/i18n";
import { BlogPostCard, blogExcerpt, blogTitle, formatBlogDate } from "@/components/sections/BlogPostCard";
import { BlogShareBar } from "@/components/sections/BlogShareBar";
import styles from "./Blog.module.css";

export function splitBlogParagraphs(body: string) {
  return body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

// Bodies written by the rich editor are HTML; seed/legacy bodies are plain text split into paragraphs.
export function isRichHtml(body: string) {
  return /<\/?[a-z][\s\S]*>/i.test(body);
}

export function BlogPostSection({ locale, post, related, postUrl }: { locale: Locale; post: BlogPost; related: BlogPostSummary[]; postUrl?: string }) {
  const copy = blogLocaleCopy(locale);
  const title = blogTitle(post, locale);
  const excerpt = blogExcerpt(post, locale);
  const body = locale === "ar" ? post.body_ar : post.body_en;
  const richBody = isRichHtml(body);
  const paragraphs = richBody ? [] : splitBlogParagraphs(body);
  const categoryName = locale === "ar" ? post.category_name_ar : post.category_name_en;
  const postTypeName = locale === "ar" ? post.post_type_name_ar : post.post_type_name_en;
  const published = formatBlogDate(post.published_at, locale);
  const minutes = locale === "ar" ? post.reading_minutes_ar : post.reading_minutes_en;
  const dir = locale === "ar" ? "rtl" : "ltr";
  const authorHref = `/${locale}/blog?author=${encodeURIComponent(post.author_name)}`;

  return <main className={`blog-post ${styles.section}`} lang={locale} dir={dir}>
    <div className="container">
      <nav className={styles.breadcrumb} aria-label={copy.breadcrumb}>
        <ol>
          <li><Link href={`/${locale}`}>{copy.home}</Link></li>
          <li><Link href={`/${locale}/blog`}>{copy.blog}</Link></li>
          <li aria-current="page">{title}</li>
        </ol>
      </nav>

      <article id="blog-article" className={styles.article}>
        <header className={styles.articleHeader}>
          {(categoryName || postTypeName) && <ul className={styles.badges} aria-label={copy.category}>
            {categoryName && <li className={styles.badgePrimary}>{categoryName}</li>}
            {postTypeName && <li className={styles.badge}>{postTypeName}</li>}
          </ul>}
          <h1>{title}</h1>
          <ul className={styles.articleMeta}>
            <li>{copy.by} <Link href={authorHref} className={styles.authorLink}>{post.author_name}<span aria-hidden="true">↗</span></Link></li>
            {published && <li><time dateTime={post.published_at ?? undefined}>{published}</time></li>}
            <li className={styles.readingTime}><span aria-hidden="true">⏱</span>{copy.minRead(minutes)}</li>
          </ul>
        </header>

        {post.cover_image_url && <img className={styles.articleCover} src={post.cover_image_url} alt="" decoding="async" fetchPriority="high" />}

        {excerpt && <p className={styles.postLead}>{excerpt}</p>}

        {richBody
          ? <div className={`${styles.body} ${locale === "ar" ? styles.bodyAr : ""}`} dangerouslySetInnerHTML={{ __html: body }} />
          : <div className={`${styles.body} ${locale === "ar" ? styles.bodyAr : ""}`}>
            {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>}

        {post.tags && post.tags.length > 0 && <section aria-label={copy.tags}>
          <ul className={styles.tagList}>
            {post.tags.map((tag) => <li key={tag.id}>
              <Link href={`/${locale}/blog?tag=${encodeURIComponent(tag.slug)}`}>
                {locale === "ar" ? tag.name_ar : tag.name_en}
              </Link>
            </li>)}
          </ul>
        </section>}
      </article>

      <BlogShareBar title={title} url={postUrl} locale={locale} />

      {related.length > 0 && <section className={styles.related} aria-labelledby="blog-related-heading">
        <h2 id="blog-related-heading">{copy.related}</h2>
        <ul className={styles.grid}>
          {related.map((item) => <li key={item.id}><BlogPostCard post={item} locale={locale} /></li>)}
        </ul>
      </section>}
    </div>
  </main>;
}
