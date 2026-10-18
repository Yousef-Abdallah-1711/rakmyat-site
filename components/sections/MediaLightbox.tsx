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
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (media) {
      closeButtonRef.current?.focus();
      return;
    }
    openerRef.current?.focus();
    openerRef.current = null;
  }, [Boolean(media)]);

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
        'a[data-fancybox="gallery"]',
      );
      if (!imageLink) return;
      event.preventDefault();
      openerRef.current = imageLink;
      const links = [
        ...document.querySelectorAll<HTMLAnchorElement>(
          'a[data-fancybox="gallery"]',
        ),
      ];
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
  return (
    <div
      ref={dialogRef}
      className="media-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={media.kind === "image" ? "Image gallery" : "Video player"}
      tabIndex={-1}
      onClick={() => setMedia(null)}
    >
      <button
        ref={closeButtonRef}
        className="media-lightbox__close"
        type="button"
        aria-label="Close media"
        onClick={() => setMedia(null)}
      >
        ×
      </button>
      {media.kind === "image" ? (
        <>
          <button
            className="media-lightbox__previous"
            type="button"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation();
              setMedia({
                ...media,
                index:
                  (media.index - 1 + media.images.length) % media.images.length,
              });
            }}
          >
            ‹
          </button>
          <img
            className="media-lightbox__image"
            src={media.images[media.index].src}
            alt={media.images[media.index].alt}
            onClick={(event) => event.stopPropagation()}
          />
          <button
            className="media-lightbox__next"
            type="button"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              setMedia({
                ...media,
                index: (media.index + 1) % media.images.length,
              });
            }}
          >
            ›
          </button>
        </>
      ) : (
        <>
          <iframe
            className="media-lightbox__video"
            src={media.src}
            title="Iteck introduction video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            onError={() => setVideoFailed(true)}
            onClick={(event) => event.stopPropagation()}
          />
          <p className="media-lightbox__fallback" role="status">
            {videoFailed ? "Video could not be loaded." : "If the video does not play:"}{" "}
            <a
              href={media.externalHref}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              Open on YouTube
            </a>
          </p>
        </>
      )}
    </div>
  );
}
