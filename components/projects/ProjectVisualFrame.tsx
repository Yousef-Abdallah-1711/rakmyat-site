import Image from "next/image";
import type { Locale } from "@/content/i18n";
import type { PortfolioProject, ProjectImage } from "@/content/portfolio";

type FrameVariant = "card" | "hero" | "gallery" | "related";

type ProjectVisualFrameProps = {
  project: PortfolioProject;
  locale: Locale;
  variant: FrameVariant;
  priority?: boolean;
  group?: string;
};

type ScreenshotVisualProps = {
  src: string;
  alt: string;
  locale: Locale;
  title: string;
  variant: FrameVariant;
  priority?: boolean;
  group: string;
};

const frameCopy = {
  en: { open: "Open full-size project image", concept: "Concept illustration · not a product screenshot" },
  ar: { open: "افتح صورة المشروع بالحجم الكامل", concept: "رسم توضيحي تصوري · ليس لقطة من المنتج" },
} as const;

export function ProjectVisualFrame({ project, locale, variant, priority = false, group }: ProjectVisualFrameProps) {
  const copy = frameCopy[locale];
  const groupName = group ?? `project-${project.slug}`;
  const presentation = project.assets.coverKind;
  const kind = presentation === "conceptual-visual" ? "conceptual-visual" : "framed-real-screenshot";

  return (
    <figure className={`project-visual project-visual--${variant} project-visual--${project.slug}`} data-presentation-kind={kind} data-project={project.slug}>
      {presentation === "conceptual-visual" ? (
        <a className="project-visual-concept" href={project.assets.cover} data-fancybox={groupName} aria-label={`${copy.open}: ${project.locales[locale].title}`}>
          <Image src={project.assets.cover} alt={project.assets.coverAlt[locale]} fill sizes={imageSizes(variant)} quality={84} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} />
        </a>
      ) : (
        <ScreenshotVisual
          src={project.assets.cover}
          alt={project.assets.coverAlt[locale]}
          locale={locale}
          title={project.locales[locale].title}
          variant={variant}
          priority={priority}
          group={groupName}
        />
      )}
      {presentation === "conceptual-visual" && <figcaption className="project-visual-caption">{copy.concept}</figcaption>}
    </figure>
  );
}

export function ProjectScreenshotFrame({
  image,
  locale,
  title,
  slug,
  variant = "gallery",
  group,
}: {
  image: ProjectImage;
  locale: Locale;
  title: string;
  slug: string;
  variant?: "gallery" | "device";
  group?: string;
}) {
  const copy = frameCopy[locale];
  const groupName = group ?? `project-${slug}`;
  return (
    <figure className={`project-visual project-visual--${variant} project-visual--${slug}`} data-presentation-kind="framed-real-screenshot" data-project={slug}>
      <a className={variant === "device" ? "project-visual-device" : "project-visual-gallery-frame"} href={image.src} data-fancybox={groupName} aria-label={`${copy.open}: ${title}`}>
        <span className="project-visual-image-area">
          <Image src={image.src} alt={image.alt[locale]} fill sizes={imageSizes(variant === "device" ? "gallery" : variant)} quality={84} loading="lazy" />
        </span>
      </a>
    </figure>
  );
}

function ScreenshotVisual({ src, alt, locale, title, variant, priority, group }: ScreenshotVisualProps) {
  const copy = frameCopy[locale];
  const image = (
    <span className="project-visual-image-area">
      <Image src={src} alt={alt} fill sizes={imageSizes(variant)} quality={84} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} />
    </span>
  );

  return (
    <a className="project-visual-screenshot-link" href={src} data-fancybox={group} aria-label={`${copy.open}: ${title}`}>
      {image}
    </a>
  );
}

function imageSizes(variant: FrameVariant) {
  if (variant === "hero") return "(max-width: 767px) 100vw, (max-width: 1199px) 92vw, 1100px";
  if (variant === "related") return "(max-width: 575px) 90vw, (max-width: 991px) 44vw, 360px";
  if (variant === "gallery") return "(max-width: 575px) 90vw, (max-width: 991px) 44vw, 580px";
  return "(max-width: 575px) 90vw, (max-width: 991px) 44vw, 620px";
}
