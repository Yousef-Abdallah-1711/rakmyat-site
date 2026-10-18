import { notFound } from "next/navigation";
import { SingleProjectSourceSections } from "@/components/sections/SingleProjectSourceSections";
import { SiteLayout } from "@/components/layout/SiteLayout";

const projectSlugs = ["notero"];
export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title:
      slug === "notero" ? "Notero - Easy Notes App | Iteck" : "Project | Iteck",
  };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!projectSlugs.includes(slug)) notFound();
  return (
    <SiteLayout activePage="project" transparentHeader>
      <SingleProjectSourceSections />
    </SiteLayout>
  );
}
