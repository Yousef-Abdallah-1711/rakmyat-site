import type { Locale } from "@/content/i18n";

export type LocalizedProjectCopy = {
  title: string;
  summary: string;
  client?: string;
  date?: string;
  services: string[];
  challengeHeading: string;
  challenge: string;
  challengePoints: string[];
  solutionHeading: string;
  solution: string;
  outcomes: string[];
  testimonial?: { quote: string; name: string; role: string };
  imageAlts: string[];
};

export type ProjectRecord = {
  slug: string;
  approvedForPublication: true;
  locales: Record<Locale, LocalizedProjectCopy>;
  assets: {
    cover: string;
    challenge: string[];
    product: string[];
    screenshots: string[];
    related: string[];
  };
  evidence: {
    clientPermission: string;
    imageRights: string;
    outcomeEvidence?: string;
    testimonialPermission?: string;
  };
};

// No case study is approved for publication yet. Add a record only after the
// client, image rights, bilingual copy, and any published outcomes are verified.
export const publishedProjects: readonly ProjectRecord[] = [];

export function getPublishedProject(slug: string): ProjectRecord | undefined {
  return publishedProjects.find((project) => project.slug === slug);
}
