"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type MediaState =
  | { kind: "image"; images: { src: string; alt: string }[]; index: number }
  | { kind: "video"; src: string }
  | null;

export function MediaLightbox() {
  const [media, setMedia] = useState<MediaState>(null);
  const pathname = usePathname();

  useEffect(() => {
    const openMedia = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const videoLink = target.closest<HTMLAnchorElement>("a[data-lity]");
      if (videoLink) {
        event.preventDefault();
        const url = new URL(videoLink.href);
        const id = url.pathname.split("/").filter(Boolean).pop();
        const start = url.searchParams.get("t");
        if (id)
          setMedia({
            kind: "video",
            src: `https://www.youtube.com/embed/${id}?autoplay=1${start ? `&start=${Number.parseInt(start, 10) || 0}` : ""}`,
          });
        return;
      }
      const imageLink = target.closest<HTMLAnchorElement>(
        'a[data-fancybox="gallery"]',
      );
      if (!imageLink) return;
      event.preventDefault();
      const links = [
        ...document.querySelectorAll<HTMLAnchorElement>(
          'a[data-fancybox="gallery"]',
        ),
      ];
      setMedia({
        kind: "image",
        images: links.map((link) => ({
          src: link.href,
          alt: link.querySelector("img")?.alt ?? "",
        })),
        index: links.indexOf(imageLink),
      });
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMedia(null);
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

  if (!media) return null;
  return (
    <div
      className="media-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={media.kind === "image" ? "Image gallery" : "Video player"}
      onClick={() => setMedia(null)}
    >
      <button
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
        <iframe
          className="media-lightbox__video"
          src={media.src}
          title="Iteck introduction video"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          onClick={(event) => event.stopPropagation()}
        />
      )}
    </div>
  );
}
