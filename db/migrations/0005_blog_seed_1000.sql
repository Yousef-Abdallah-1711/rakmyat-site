-- 0005_blog_seed_1000.sql
-- SIMULATION DATA ONLY: 1000 blog posts for UI, pagination and search testing.
--
-- Set-based (generate_series), no application loop. Idempotent: existing slugs are skipped
-- and tag links are resolved by slug, so re-running adds nothing new and never violates FKs.
--
-- WARNING: scripts/migrate.ts applies every file in db/migrations to any database it targets,
-- including production. Delete or move this file out of db/migrations before any deployment
-- that must not contain simulation content.

DO $$
BEGIN
  IF (SELECT count(*) FROM blog_categories) = 0
     OR (SELECT count(*) FROM blog_post_types) = 0
     OR (SELECT count(*) FROM blog_tags) = 0 THEN
    RAISE EXCEPTION 'blog taxonomy must be seeded (0003_blog.sql) before the simulation seed runs';
  END IF;
END $$;

WITH params AS (
  SELECT
    ARRAY[
      'Building Better Software', 'A Guide to Clean Architecture',
      'Understanding Database Indexing', 'React Performance Patterns',
      'API Design Best Practices', 'TypeScript Tips and Tricks',
      'PostgreSQL Query Optimization', 'Next.js App Router Deep Dive',
      'CSS Grid Mastery', 'Authentication Patterns for Web Apps',
      'Working with Arabic Text in Web', 'RTL Layout Techniques',
      'Microservices vs Monoliths', 'Docker for Developers',
      'Testing Strategies for Production', 'CI/CD Pipeline Setup',
      'SEO for Modern Web Apps', 'Web Accessibility Fundamentals',
      'State Management in 2025', 'Building Admin Dashboards'
    ]::text[] AS en_titles,
    ARRAY[
      'بناء برمجيات أفضل', 'دليل إلى البنية النظيفة',
      'فهم فهرسة قواعد البيانات', 'أنماط أداء React',
      'أفضل ممارسات تصميم API', 'نصائح وحيل TypeScript',
      'تحسين استعلامات PostgreSQL', 'غوص عميق في Next.js App Router',
      'إتقان CSS Grid', 'أنماط المصادقة لتطبيقات الويب',
      'العمل مع النص العربي في الويب', 'تقنيات تخطيط RTL',
      'Microservices مقابل Monoliths', 'Docker للمطورين',
      'استراتيجيات الاختبار للإنتاج', 'إعداد خط أنابيب CI/CD',
      'تحسين محركات البحث لتطبيقات الويب الحديثة', 'أساسيات إمكانية الوصول',
      'إدارة الحالة في 2025', 'بناء لوحات إدارة'
    ]::text[] AS ar_titles,
    ARRAY(SELECT id FROM blog_categories ORDER BY slug) AS cat_ids,
    ARRAY(SELECT id FROM blog_post_types ORDER BY slug) AS type_ids
),
src AS (
  SELECT
    g.n,
    params.en_titles[1 + (g.n % cardinality(params.en_titles))] AS en_t,
    params.ar_titles[1 + (g.n % cardinality(params.ar_titles))] AS ar_t,
    params.cat_ids[1 + (g.n % cardinality(params.cat_ids))] AS cat_id,
    params.type_ids[1 + (g.n % cardinality(params.type_ids))] AS type_id
  FROM generate_series(1, 1000) AS g(n)
  CROSS JOIN params
)
INSERT INTO blog_posts (
  id, slug, title_en, title_ar,
  excerpt_en, excerpt_ar,
  body_en, body_ar,
  category_id, post_type_id,
  author_name, status, locale_primary,
  published_at, created_at, updated_at
)
SELECT
  gen_random_uuid(),
  'sim-post-' || s.n,
  s.en_t || ' — Part ' || s.n,
  s.ar_t || ' — الجزء ' || s.n,
  'This article covers ' || s.en_t || ' in depth, exploring practical techniques and real-world examples for software teams.',
  'تتناول هذه المقالة موضوع ' || s.ar_t || ' بعمق، مع استكشاف تقنيات عملية وأمثلة واقعية لفرق البرمجيات.',
  'Software development is a craft that requires both technical skill and strategic thinking. ' ||
  'In this article, we explore ' || lower(s.en_t) || '. ' ||
  E'\n\n' ||
  'The fundamentals begin with understanding your problem domain clearly. Before writing a single line of code, teams should invest time in requirements gathering, architecture review, and identifying potential risks. ' ||
  E'\n\n' ||
  'Implementation follows a clear pattern: start with the core domain logic, add persistence, then build the API layer, and finally the user interface. Each layer should be independently testable. ' ||
  E'\n\n' ||
  'Testing is not optional. Unit tests cover logic, integration tests cover boundaries, and end-to-end tests cover user workflows. Aim for fast feedback loops at every level. ' ||
  E'\n\n' ||
  'Deployment should be automated and repeatable. Use environment variables for configuration, and never hardcode secrets. A good CI/CD pipeline catches regressions before they reach production.',
  'تطوير البرمجيات حرفة تتطلب مهارة تقنية وتفكيراً استراتيجياً. ' ||
  'في هذه المقالة، نستكشف ' || s.ar_t || '. ' ||
  E'\n\n' ||
  'تبدأ الأساسيات بفهم مجال مشكلتك بوضوح. قبل كتابة سطر واحد من الكود، يجب على الفرق الاستثمار في جمع المتطلبات ومراجعة البنية وتحديد المخاطر المحتملة. ' ||
  E'\n\n' ||
  'يتبع التنفيذ نمطاً واضحاً: ابدأ بمنطق النطاق الأساسي، وأضف الثبات، ثم ابنِ طبقة API، وأخيراً واجهة المستخدم. يجب أن تكون كل طبقة قابلة للاختبار بشكل مستقل.',
  s.cat_id,
  s.type_id,
  CASE WHEN s.n % 7 = 0 THEN 'Rakmyat Team'
       WHEN s.n % 5 = 0 THEN 'Tech Lead'
       ELSE 'Rakmyat' END,
  CASE WHEN s.n <= 700 THEN 'published'
       WHEN s.n <= 950 THEN 'draft'
       ELSE 'archived' END,
  CASE WHEN s.n % 3 = 0 THEN 'ar' ELSE 'en' END,
  CASE WHEN s.n <= 700 THEN now() - ((1000 - s.n) * interval '2 hours') END,
  now() - ((1000 - s.n) * interval '2 hours'),
  now() - ((1000 - s.n) * interval '1 hour')
FROM src s
ON CONFLICT (slug) DO NOTHING;

-- Tag links: 1 tag per post, plus a second when n % 3 = 0 and a third when n % 5 = 0.
-- Resolved by slug so re-runs attach to the existing rows.
WITH tag_src AS (
  SELECT ARRAY(SELECT id FROM blog_tags ORDER BY slug) AS tag_ids
),
links AS (
  SELECT g.n, o.offset_n
  FROM generate_series(1, 1000) AS g(n)
  CROSS JOIN LATERAL unnest(
    ARRAY[0]
    || CASE WHEN g.n % 3 = 0 THEN ARRAY[2] ELSE ARRAY[]::int[] END
    || CASE WHEN g.n % 5 = 0 THEN ARRAY[4] ELSE ARRAY[]::int[] END
  ) AS o(offset_n)
)
INSERT INTO blog_post_tags (post_id, tag_id)
SELECT DISTINCT p.id, (ts.tag_ids)[1 + ((l.n + l.offset_n) % cardinality(ts.tag_ids))]
FROM links l
CROSS JOIN tag_src ts
JOIN blog_posts p ON p.slug = 'sim-post-' || l.n
ON CONFLICT DO NOTHING;
