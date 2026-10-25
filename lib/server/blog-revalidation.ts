import "server-only";
import { revalidatePath } from "next/cache";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Revalidate localized blog indexes and all affected detail URLs after a committed change. */
export function revalidateBlogPaths(slugs: Iterable<string> = []) {
  revalidatePath("/en/blog");
  revalidatePath("/ar/blog");
  revalidatePath("/sitemap.xml");
  for (const slug of new Set(slugs)) {
    if (!slugPattern.test(slug)) continue;
    revalidatePath(`/en/blog/${slug}`);
    revalidatePath(`/ar/blog/${slug}`);
  }
}
