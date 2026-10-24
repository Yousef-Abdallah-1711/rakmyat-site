import Link from "next/link";
import { listPublishedBlogPostsPage } from "@/lib/server/blog";
import { BlogPostCard } from "@/components/sections/BlogPostCard";
import type { Locale } from "@/content/i18n";
import type { BlogPostSummary } from "@/lib/blog-schema";

const HOME_BLOG_LIMIT = 3;

const copy = {
  en: {
    eyebrow: "From the blog",
    heading: <>Latest <span>articles</span></>,
    description: "Practical notes on software development, business systems, and AI automation.",
    all: "Read all articles",
  },
  ar: {
    eyebrow: "من المدونة",
    heading: <>آخر <span>المقالات</span></>,
    description: "ملاحظات عملية حول تطوير البرمجيات وأنظمة الأعمال والذكاء الاصطناعي.",
    all: "اقرأ جميع المقالات",
  },
} as const;

export async function HomeBlogSection({ locale }: { locale: Locale }) {
  if (!process.env.DATABASE_URL) return null;

  let posts: BlogPostSummary[];
  try {
    const page = await listPublishedBlogPostsPage({
      page: 1,
      limit: HOME_BLOG_LIMIT,
      category: null,
      tag: null,
      author: null,
      q: null,
      sort: "newest",
      locale,
    });
    posts = page.posts;
  } catch {
    console.error("home_blog_section_unavailable");
    return null;
  }

  if (posts.length === 0) return null;

  const text = copy[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <section className="home-blog-section section-padding style-5" dir={dir} aria-labelledby="home-blog-title">
      <div className="container">
        <header className="section-head text-center mb-50 style-5">
          <small className="project-showcase-eyebrow">{text.eyebrow}</small>
          <h2 id="home-blog-title" className="mb-20">{text.heading}</h2>
          <p>{text.description}</p>
        </header>
        <ul className="home-blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "1.75rem", listStyle: "none", padding: 0, margin: "0 0 3rem" }}>
          {posts.map((post) => (
            <li key={post.id}>
              <BlogPostCard post={post} locale={locale} />
            </li>
          ))}
        </ul>
        <div className="text-center">
          <Link href={`/${locale}/blog`} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold">
            <span>{text.all} <i className={`bi ${locale === "ar" ? "bi-arrow-left" : "bi-arrow-right"} ms-1`} aria-hidden="true" /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
