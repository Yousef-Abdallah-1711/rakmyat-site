import { notFound } from "next/navigation";

// Preserve the old unlocalized project alias as an unpublished 404.
export default function ProjectPage(): never {
  notFound();
}
