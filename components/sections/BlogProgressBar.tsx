"use client";

import { useEffect, useRef } from "react";
import { blogLocaleCopy } from "@/content/blog-copy";
import type { Locale } from "@/content/i18n";
import styles from "./Blog.module.css";

/**
 * Fixed 3px reading-progress bar. It measures the article element (id `blog-article`) and writes the
 * transform straight to the DOM on scroll, so scrolling does not re-render React.
 */
export function BlogPostProgressBar({ locale, articleId = "blog-article" }: { locale: Locale; articleId?: string }) {
  const copy = blogLocaleCopy(locale);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const article = document.getElementById(articleId);
      const articleTop = article ? article.getBoundingClientRect().top + window.scrollY : 0;
      const articleHeight = article ? article.offsetHeight : document.documentElement.scrollHeight;
      // Progress runs from the moment the article reaches the top of the viewport until its last line is visible.
      const range = articleHeight - window.innerHeight;
      const scrolled = window.scrollY - articleTop;
      const progress = range <= 0 ? 1 : Math.min(1, Math.max(0, scrolled / range));
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
      trackRef.current?.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [articleId]);

  return <div ref={trackRef} className={styles.progressTrack} role="progressbar" aria-label={copy.readingProgress}
    aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
    <div ref={barRef} className={`${styles.progressBar} ${locale === "ar" ? styles.progressBarRtl : ""}`} />
  </div>;
}
