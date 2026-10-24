"use client";

import { Suspense, useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { BlogCategory, BlogPostSummary, BlogTag } from "@/lib/blog-schema";
import { blogLocaleCopy } from "@/content/blog-copy";
import type { Locale } from "@/content/i18n";
import { BlogGridSkeleton, BlogPostCard, type BlogView } from "@/components/sections/BlogPostCard";
import styles from "./Blog.module.css";

export type BlogPostsPageData = {
  posts: BlogPostSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type SortKey = "newest" | "oldest" | "az" | "za";
type Filters = {
  q: string;
  category: string;
  tag: string;
  author: string;
  sort: SortKey;
  page: number;
  view: BlogView;
};
type Result = { key: string; data: BlogPostsPageData | null };

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 350;
const sortKeys: readonly SortKey[] = ["newest", "oldest", "az", "za"];
const defaultFilters: Filters = { q: "", category: "", tag: "", author: "", sort: "newest", page: 1, view: "grid" };

function isSortKey(value: string | null): value is SortKey {
  return value !== null && (sortKeys as readonly string[]).includes(value);
}

function parseFilters(params: URLSearchParams): Filters {
  const page = Number(params.get("page"));
  const sortParam = params.get("sort");
  return {
    q: (params.get("q") ?? "").trim().slice(0, 120),
    category: (params.get("category") ?? "").trim().slice(0, 80),
    tag: (params.get("tag") ?? "").trim().slice(0, 80),
    author: (params.get("author") ?? "").trim().slice(0, 160),
    sort: isSortKey(sortParam) ? sortParam : "newest",
    page: Number.isSafeInteger(page) && page >= 1 ? page : 1,
    view: params.get("view") === "list" ? "list" : "grid",
  };
}

function sameFilters(a: Filters, b: Filters) {
  return a.q === b.q && a.category === b.category && a.tag === b.tag && a.author === b.author
    && a.sort === b.sort && a.page === b.page && a.view === b.view;
}

/** Query string for /api/blog/posts. The view mode is excluded, so switching layout never refetches. */
function apiQuery(filters: Filters, locale: Locale) {
  const params = new URLSearchParams({ page: String(filters.page), limit: String(PAGE_SIZE), sort: filters.sort, locale });
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.author) params.set("author", filters.author);
  return params.toString();
}

/** Shareable archive URL. Defaults are left out to keep URLs short. */
function archiveUrl(base: string, filters: Filters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.author) params.set("author", filters.author);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  if (filters.view !== "grid") params.set("view", filters.view);
  if (filters.page > 1) params.set("page", String(filters.page));
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

/** Up to five page numbers, centred on the current page. */
function pageWindow(current: number, total: number) {
  const size = Math.min(5, total);
  const start = Math.max(1, Math.min(current - 2, total - size + 1));
  return Array.from({ length: size }, (_, index) => start + index);
}

function hasActiveFilters(filters: Filters) {
  return Boolean(filters.q || filters.category || filters.tag || filters.author);
}

/** Reports URL changes (initial load, back/forward) to the archive state. Rendered inside Suspense so the list still server-renders. */
function UrlSync({ onUrlChange }: { onUrlChange: (params: URLSearchParams) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    onUrlChange(new URLSearchParams(searchParams.toString()));
  }, [searchParams, onUrlChange]);
  return null;
}

export function BlogIndexSection({
  locale,
  initialData,
  categories,
  tags,
}: {
  locale: Locale;
  initialData: BlogPostsPageData;
  categories: BlogCategory[];
  tags: BlogTag[];
}) {
  const copy = blogLocaleCopy(locale);
  const router = useRouter();
  const base = `/${locale}/blog`;
  const dir = locale === "ar" ? "rtl" : "ltr";
  const initialKey = apiQuery(defaultFilters, locale);

  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const filtersRef = useRef<Filters>(defaultFilters);
  const [searchInput, setSearchInput] = useState("");
  // The server-rendered first page answers the default state, so no request is needed on mount.
  const [result, setResult] = useState<Result>({ key: initialKey, data: initialData });
  const resultsRef = useRef<HTMLDivElement>(null);

  const currentKey = apiQuery(filters, locale);
  const loading = result.key !== currentKey;

  const commit = useCallback((patch: Partial<Filters>, mode: "push" | "replace") => {
    const next = { ...filtersRef.current, ...patch };
    filtersRef.current = next;
    setFilters(next);
    const url = archiveUrl(base, next);
    if (mode === "push") router.push(url, { scroll: false });
    else router.replace(url, { scroll: false });
  }, [base, router]);

  const applyUrl = useCallback((params: URLSearchParams) => {
    const next = parseFilters(params);
    if (sameFilters(filtersRef.current, next)) return;
    if (next.q !== filtersRef.current.q) setSearchInput(next.q);
    filtersRef.current = next;
    setFilters(next);
  }, []);

  // Fetch when the query differs from the last result. Only currentKey and result.key drive this effect,
  // so changing the view mode while a request is in flight cannot abort it.
  useEffect(() => {
    if (result.key === currentKey) return;
    const requestedPage = filters.page;
    const controller = new AbortController();
    fetch(`/api/blog/posts?${currentKey}`, { signal: controller.signal, headers: { Accept: "application/json" } })
      .then(async (response) => {
        if (!response.ok) throw new Error(`blog_posts_${response.status}`);
        return (await response.json()) as BlogPostsPageData;
      })
      .then((payload) => {
        setResult({ key: currentKey, data: payload });
        // The server clamps out-of-range pages; mirror the clamped page into the URL.
        if (payload.page !== requestedPage) commit({ page: payload.page }, "replace");
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setResult({ key: currentKey, data: null });
      });
    return () => controller.abort();
  }, [currentKey, result.key, commit]);

  // Debounced search: write the trimmed query to the URL after the user pauses typing.
  useEffect(() => {
    const next = searchInput.trim().slice(0, 120);
    if (next === filtersRef.current.q) return;
    const timer = window.setTimeout(() => commit({ q: next, page: 1 }, "replace"), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchInput, commit]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = searchInput.trim().slice(0, 120);
    if (next !== filtersRef.current.q) commit({ q: next, page: 1 }, "replace");
  }

  function goToPage(page: number) {
    commit({ page }, "push");
    resultsRef.current?.scrollIntoView({ block: "start" });
  }

  function retry() {
    setResult({ key: "", data: null });
  }

  const sortOptions: [SortKey, string][] = [
    ["newest", copy.sortNewest],
    ["oldest", copy.sortOldest],
    ["az", copy.sortAZ],
    ["za", copy.sortZA],
  ];
  const shown = loading ? null : result.data;
  const view = filters.view;

  return <main className={`blog-index ${styles.section}`} lang={locale} dir={dir}>
    <Suspense fallback={null}>
      <UrlSync onUrlChange={applyUrl} />
    </Suspense>
    <section className="section-padding pt-50 style-5">
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>{copy.heading} <span className={styles.accent}>{copy.accent}</span></h1>
          <p className={styles.lead}>{copy.lead}</p>
          <form role="search" className={styles.search} onSubmit={submitSearch}>
            <label className="visually-hidden" htmlFor="blog-search">{copy.searchPlaceholder}</label>
            <input
              id="blog-search"
              type="search"
              className={styles.searchInput}
              value={searchInput}
              placeholder={copy.searchPlaceholder}
              autoComplete="off"
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </form>
        </header>

        <div className={styles.toolbar}>
          <select className={styles.select} aria-label={copy.category} value={filters.category}
            onChange={(event) => commit({ category: event.target.value, page: 1 }, "replace")}>
            <option value="">{copy.filterByCategory}</option>
            {categories.map((category) => <option key={category.id} value={category.slug}>
              {locale === "ar" ? category.name_ar : category.name_en}
            </option>)}
          </select>
          <select className={styles.select} aria-label={copy.tags} value={filters.tag}
            onChange={(event) => commit({ tag: event.target.value, page: 1 }, "replace")}>
            <option value="">{copy.filterByTag}</option>
            {tags.map((tag) => <option key={tag.id} value={tag.slug}>
              {locale === "ar" ? tag.name_ar : tag.name_en}
            </option>)}
          </select>
          <select className={styles.select} aria-label={copy.sortBy} value={filters.sort}
            onChange={(event) => commit({ sort: event.target.value as SortKey, page: 1 }, "replace")}>
            {sortOptions.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
          <div className={styles.viewToggle} role="group" aria-label={copy.viewLabel}>
            <button type="button" className={`${styles.viewButton} ${view === "grid" ? styles.viewButtonActive : ""}`}
              aria-pressed={view === "grid"} onClick={() => commit({ view: "grid" }, "replace")}>
              <span aria-hidden="true">⊞ </span>{copy.viewGrid}
            </button>
            <button type="button" className={`${styles.viewButton} ${view === "list" ? styles.viewButtonActive : ""}`}
              aria-pressed={view === "list"} onClick={() => commit({ view: "list" }, "replace")}>
              <span aria-hidden="true">≡ </span>{copy.viewList}
            </button>
          </div>
        </div>

        {filters.author && <div className={styles.activeFilters}>
          <span className={styles.chip}>
            {copy.postsBy(filters.author)}
            <button type="button" className={styles.chipClear} aria-label={copy.clearFilter} title={copy.clearFilter}
              onClick={() => commit({ author: "", page: 1 }, "replace")}>×</button>
          </span>
        </div>}

        <div ref={resultsRef} aria-busy={loading}>
          {loading
            ? <BlogGridSkeleton count={6} view={view} />
            : result.data === null
              ? <div className={styles.empty} role="alert">
                  <p>{copy.loadError}</p>
                  <button type="button" className={styles.retry} onClick={retry}>{copy.retry}</button>
                </div>
              : result.data.posts.length === 0
                ? <div className={styles.empty}>
                    {hasActiveFilters(filters)
                      ? <p>{copy.noResults}</p>
                      : <><h2>{copy.empty}</h2><p>{copy.emptyText}</p></>}
                  </div>
                : <>
                    <ul className={view === "list" ? styles.listGrid : styles.grid} aria-label={copy.accent}>
                      {result.data.posts.map((post) => <li key={post.id}>
                        <BlogPostCard post={post} locale={locale} variant={view} />
                      </li>)}
                    </ul>
                    {shown && shown.totalPages > 1 && <nav className={styles.pagination} aria-label={copy.paginationLabel}>
                      <button type="button" className={styles.pageButton} onClick={() => goToPage(shown.page - 1)} disabled={shown.page <= 1}>
                        {copy.previous}
                      </button>
                      <ul className={styles.pageNumbers}>
                        {pageWindow(shown.page, shown.totalPages).map((number) => <li key={number}>
                          <button type="button"
                            className={`${styles.pageButton} ${number === shown.page ? styles.pageButtonActive : ""}`}
                            aria-current={number === shown.page ? "page" : undefined}
                            aria-label={`${copy.page} ${number}`}
                            onClick={() => goToPage(number)}>
                            {number}
                          </button>
                        </li>)}
                      </ul>
                      <button type="button" className={styles.pageButton} onClick={() => goToPage(shown.page + 1)} disabled={shown.page >= shown.totalPages}>
                        {copy.next}
                      </button>
                      <p className={styles.pageStatus}>{copy.page} {shown.page} {copy.of} {shown.totalPages}</p>
                    </nav>}
                  </>}
        </div>
      </div>
    </section>
  </main>;
}
