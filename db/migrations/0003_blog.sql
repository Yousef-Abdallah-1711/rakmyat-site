-- Blog: categories, tags, post types, posts, and post relations

CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar(80) NOT NULL UNIQUE,
  name_en varchar(160) NOT NULL,
  name_ar varchar(160) NOT NULL,
  description_en text NOT NULL DEFAULT '',
  description_ar text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_post_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar(80) NOT NULL UNIQUE,
  name_en varchar(160) NOT NULL,
  name_ar varchar(160) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar(80) NOT NULL UNIQUE,
  name_en varchar(160) NOT NULL,
  name_ar varchar(160) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar(200) NOT NULL UNIQUE,
  title_en varchar(300) NOT NULL,
  title_ar varchar(300) NOT NULL,
  excerpt_en text NOT NULL DEFAULT '',
  excerpt_ar text NOT NULL DEFAULT '',
  body_en text NOT NULL DEFAULT '',
  body_ar text NOT NULL DEFAULT '',
  cover_image_url varchar(2048),
  category_id uuid REFERENCES blog_categories(id) ON DELETE SET NULL,
  post_type_id uuid REFERENCES blog_post_types(id) ON DELETE SET NULL,
  author_name varchar(160) NOT NULL DEFAULT 'Rakmyat',
  status varchar(16) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  locale_primary char(2) NOT NULL DEFAULT 'en' CHECK (locale_primary IN ('en','ar')),
  seo_title_en varchar(300),
  seo_title_ar varchar(300),
  seo_description_en varchar(500),
  seo_description_ar varchar(500),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS blog_posts_status_published_at_idx ON blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS blog_posts_category_id_idx ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);

CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Seed default post types
INSERT INTO blog_post_types (slug, name_en, name_ar) VALUES
  ('article', 'Article', 'مقالة'),
  ('tutorial', 'Tutorial', 'درس تعليمي'),
  ('case-study', 'Case Study', 'دراسة حالة'),
  ('news', 'News', 'أخبار')
ON CONFLICT (slug) DO NOTHING;

-- Seed default categories
INSERT INTO blog_categories (slug, name_en, name_ar, description_en, description_ar) VALUES
  ('software-development', 'Software Development', 'تطوير البرمجيات', 'Articles about software development practices and tools.', 'مقالات حول ممارسات وأدوات تطوير البرمجيات.'),
  ('business-systems', 'Business Systems', 'أنظمة الأعمال', 'Insights on building systems for real business workflows.', 'رؤى حول بناء أنظمة لسير عمل الأعمال الحقيقية.'),
  ('web-development', 'Web Development', 'تطوير الويب', 'Web technologies, design, and performance.', 'تقنيات الويب والتصميم والأداء.'),
  ('ai-and-automation', 'AI & Automation', 'الذكاء الاصطناعي والأتمتة', 'Practical AI and automation for business.', 'الذكاء الاصطناعي والأتمتة العملية للأعمال.')
ON CONFLICT (slug) DO NOTHING;

-- Seed default tags
INSERT INTO blog_tags (slug, name_en, name_ar) VALUES
  ('nextjs', 'Next.js', 'Next.js'),
  ('react', 'React', 'React'),
  ('postgresql', 'PostgreSQL', 'PostgreSQL'),
  ('typescript', 'TypeScript', 'TypeScript'),
  ('arabic', 'Arabic', 'عربي'),
  ('rtl', 'RTL', 'من اليمين إلى اليسار'),
  ('seo', 'SEO', 'تحسين محركات البحث'),
  ('performance', 'Performance', 'الأداء')
ON CONFLICT (slug) DO NOTHING;
