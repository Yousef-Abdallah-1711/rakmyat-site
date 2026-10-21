"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type MediaState =
  | { kind: "image"; images: { src: string; alt: string }[]; index: number }
  | { kind: "video"; src: string; externalHref: string }
  | null;

export function MediaLightbox() {
  const [media, setMedia] = useState<MediaState>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const pathname = usePathname();
  const isArabic = pathname.startsWith("/ar");
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const swipeStartX = useRef<number | null>(null);

  useEffect(() => {
    if (media) {
      closeButtonRef.current?.focus();
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = previousOverflow; };
    }
    openerRef.current?.focus();
    openerRef.current = null;
  }, [Boolean(media)]);

  useEffect(() => {
    setZoom(1);
  }, [media?.kind === "image" ? media.index : media?.kind]);

  useEffect(() => {
    const openMedia = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const videoLink = target.closest<HTMLAnchorElement>("a[data-lity]");
      if (videoLink) {
        event.preventDefault();
        openerRef.current = videoLink;
        setVideoFailed(false);
        const url = new URL(videoLink.href);
        const id = url.pathname.split("/").filter(Boolean).pop();
        const start = url.searchParams.get("t");
        if (id)
          setMedia({
            kind: "video",
            src: `https://www.youtube.com/embed/${id}?autoplay=1${start ? `&start=${Number.parseInt(start, 10) || 0}` : ""}`,
            externalHref: videoLink.href,
          });
        return;
      }
      const imageLink = target.closest<HTMLAnchorElement>(
        "a[data-fancybox]",
      );
      if (!imageLink) return;
      event.preventDefault();
      openerRef.current = imageLink;
      const group = imageLink.getAttribute("data-fancybox");
      const links = [
        ...document.querySelectorAll<HTMLAnchorElement>(
          "a[data-fancybox]",
        ),
      ].filter((link) => link.getAttribute("data-fancybox") === group);
      setMedia({
        kind: "image",
        images: links.map((link) => ({
          src: link.href,
          alt:
            link.querySelector("img")?.alt ||
            link.getAttribute("aria-label") ||
            "Gallery image",
        })),
        index: links.indexOf(imageLink),
      });
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && media) setMedia(null);
      if (
        media?.kind === "image" &&
        (event.key === "ArrowLeft" || event.key === "ArrowRight")
      ) {
        const direction = event.key === "ArrowRight" ? 1 : -1;
        setMedia((current) =>
          current?.kind === "image"
            ? {
                ...current,
                index:
                  (current.index + direction + current.images.length) %
                  current.images.length,
              }
            : current,
        );
      }
    };
    document.addEventListener("click", openMedia);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", openMedia);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [media, pathname]);

  useEffect(() => {
    if (!media) return;
    const dialog = dialogRef.current;
    const onTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !dialog) return;
      const controls = [...dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])',
      )].filter((element) => element.offsetParent !== null);
      if (!controls.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onTab);
    return () => document.removeEventListener("keydown", onTab);
  }, [Boolean(media)]);

  if (!media) return null;
  const activeImage = media.kind === "image" ? media.images[media.index] : null;
  const imageBaseWidth = typeof window === "undefined" ? 1200 : Math.min(1200, window.innerWidth * 0.9);
  const moveImage = (direction: number) => {
    setMedia((current) => current?.kind === "image" ? {
      ...current,
      index: (current.index + direction + current.images.length) % current.images.length,
    } : current);
    setZoom(1);
  };
  return (
    <div
      ref={dialogRef}
      className="media-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={media.kind === "image" ? (isArabic ? "معرض الصور" : "Image gallery") : (isArabic ? "مشغل الفيديو" : "Video player")}
      tabIndex={-1}
      onClick={() => setMedia(null)}
    >
      <button
        ref={closeButtonRef}
        className="media-lightbox__close"
        type="button"
        aria-label={isArabic ? "إغلاق الوسائط" : "Close media"}
        onClick={() => setMedia(null)}
      >
        ×
      </button>
      {media.kind === "image" ? (
        <>
          <div className="media-lightbox__toolbar" onClick={(event) => event.stopPropagation()}>
            <button type="button" aria-label={isArabic ? "تصغير" : "Zoom out"} onClick={() => setZoom((value) => Math.max(1, value - 0.5))}>−</button>
            <button type="button" aria-label={isArabic ? "تكبير" : "Zoom in"} onClick={() => setZoom((value) => Math.min(3, value + 0.5))}>+</button>
            <button type="button" aria-label={isArabic ? "الحجم الأصلي للعرض" : "Reset image zoom"} onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
          </div>
          <button
            className="media-lightbox__previous"
            type="button"
            aria-label={isArabic ? "الصورة السابقة" : "Previous image"}
            onClick={(event) => {
              event.stopPropagation();
              moveImage(-1);
            }}
          >
            ‹
          </button>
          <div
            className="media-lightbox__stage"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) => { swipeStartX.current = event.touches[0]?.clientX ?? null; }}
            onTouchEnd={(event) => {
              const start = swipeStartX.current;
              const end = event.changedTouches[0]?.clientX;
              swipeStartX.current = null;
              if (start !== null && end !== undefined && Math.abs(end - start) > 80) moveImage(end < start ? 1 : -1);
            }}
          >
            <img
              key={activeImage?.src}
              className="media-lightbox__image"
              src={activeImage?.src}
              alt={activeImage?.alt ?? ""}
              style={{ width: `${imageBaseWidth * zoom}px` }}
            />
          </div>
          <button
            className="media-lightbox__next"
            type="button"
            aria-label={isArabic ? "الصورة التالية" : "Next image"}
            onClick={(event) => {
              event.stopPropagation();
              moveImage(1);
            }}
          >
            ›
          </button>
          <p className="media-lightbox__caption" aria-live="polite" dir={isArabic ? "rtl" : "ltr"}>
            {media.index + 1} / {media.images.length} · {activeImage?.alt}
          </p>
        </>
      ) : (
        <>
          <iframe
            className="media-lightbox__video"
            src={media.src}
            title={isArabic ? "فيديو تعريفي" : "Introduction video"}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            onError={() => setVideoFailed(true)}
            onClick={(event) => event.stopPropagation()}
          />
          <p className="media-lightbox__fallback" role="status">
            {videoFailed
              ? isArabic ? "تعذر تحميل الفيديو." : "Video could not be loaded."
              : isArabic ? "إذا لم يعمل الفيديو:" : "If the video does not play:"}{" "}
            <a
              href={media.externalHref}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              {isArabic ? "افتحه على YouTube" : "Open on YouTube"}
            </a>
          </p>
        </>
      )}
    </div>
  );
}
