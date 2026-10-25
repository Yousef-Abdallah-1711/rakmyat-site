import { z } from "zod";

export const blogPostStatuses = ["draft", "published", "archived"] as const;
export type BlogPostStatus = typeof blogPostStatuses[number];

export type BlogCategory = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  created_at: string;
  updated_at: string;
};

export type BlogPostType = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  created_at: string;
};

export type BlogTag = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  created_at: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  body_en: string;
  body_ar: string;
  cover_image_url: string | null;
  category_id: string | null;
  post_type_id: string | null;
  author_name: string;
  status: BlogPostStatus;
  locale_primary: string;
  seo_title_en: string | null;
  seo_title_ar: string | null;
  seo_description_en: string | null;
  seo_description_ar: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  revision: number;
  deleted_at: string | null;
  // Estimated read time per locale, computed in SQL from the body (200 words per minute, minimum 1).
  reading_minutes_en: number;
  reading_minutes_ar: number;
  // Joined fields (optional):
  category_name_en?: string;
  category_name_ar?: string;
  post_type_name_en?: string;
  post_type_name_ar?: string;
  tags?: BlogTag[];
};

/** A post without the (potentially large) body columns, used for listings. */
export type BlogPostSummary = Omit<BlogPost, "body_en" | "body_ar" | "tags">;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const uuid = z.string().uuid();

/** Allows site-relative paths and absolute http(s) URLs only. */
export function isSafeImageUrl(value: string) {
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

const requiredText = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max);
const optionalNullableText = (max: number) => z.string().trim().max(max).nullable();

const postFields = {
  slug: z.string().trim().min(2).max(200).regex(slugPattern),
  title_en: requiredText(300),
  title_ar: requiredText(300),
  excerpt_en: optionalText(1000),
  excerpt_ar: optionalText(1000),
  body_en: optionalText(60000),
  body_ar: optionalText(60000),
  cover_image_url: z.string().trim().max(2048).refine(isSafeImageUrl).nullable(),
  category_id: uuid.nullable(),
  post_type_id: uuid.nullable(),
  author_name: requiredText(160),
  locale_primary: z.enum(["en", "ar"]),
  seo_title_en: optionalNullableText(300),
  seo_title_ar: optionalNullableText(300),
  seo_description_en: optionalNullableText(500),
  seo_description_ar: optionalNullableText(500),
};

// Create: only slug and both titles are required; everything else falls back to defaults.
export const blogPostCreateSchema = z.object({
  slug: postFields.slug,
  title_en: postFields.title_en,
  title_ar: postFields.title_ar,
  excerpt_en: postFields.excerpt_en.default(""),
  excerpt_ar: postFields.excerpt_ar.default(""),
  body_en: postFields.body_en.default(""),
  body_ar: postFields.body_ar.default(""),
  cover_image_url: postFields.cover_image_url.default(null),
  category_id: postFields.category_id.default(null),
  post_type_id: postFields.post_type_id.default(null),
  author_name: postFields.author_name.default("Rakmyat"),
  locale_primary: postFields.locale_primary.default("en"),
  seo_title_en: postFields.seo_title_en.default(null),
  seo_title_ar: postFields.seo_title_ar.default(null),
  seo_description_en: postFields.seo_description_en.default(null),
  seo_description_ar: postFields.seo_description_ar.default(null),
  tag_ids: z.array(uuid).max(50).default([]),
});

export const blogPostUpdateSchema = z
  .object({
    ...postFields,
    status: z.enum(blogPostStatuses),
    published_at: z.iso.datetime({ offset: true }).nullable(),
    tag_ids: z.array(uuid).max(50),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0);

export const blogIdSchema = uuid;
