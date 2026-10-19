/**
 * The resume, assembled once from the /content files and consumed by BOTH the
 * on-screen sheet and the generated PDF. Neither of those two ever reaches
 * into a content file directly, so they can never drift apart.
 */
import { profile } from "@/content/profile";
import { experience, publishedBullets } from "@/content/experience";
import { skillGroups, software } from "@/content/skills";
import { clients } from "@/content/clients";
import { education } from "@/content/education";

export type ResumeRole = {
  company: string;
  role: string;
  dates: string;
  location?: string;
  bullets: string[];
};

export type ResumeSkillLine = {
  label: string;
  value: string;
};

export type ResumeEducation = {
  line: string;
  detail: string;
};

export type ResumeData = {
  name: string;
  title: string;
  /** Header contact line, already joined. */
  contact: string[];
  summary: string;
  roles: ResumeRole[];
  skills: ResumeSkillLine[];
  clients: string;
  education: ResumeEducation[];
  portfolio: string;
};

/** Software condensed to one comma-separated line, years kept inline. */
function softwareLine(): string {
  return software
    .map((item) => (item.years ? `${item.name} (${item.years})` : item.name))
    .join(", ");
}

export function getResumeData(): ResumeData {
  return {
    name: profile.name,
    title: profile.title,
    contact: [profile.location, profile.phone, profile.email, profile.domain],
    summary: profile.summary,

    roles: experience.map((job) => ({
      company: job.company,
      role: job.role,
      dates: job.dates,
      location: job.location,
      // TODO bullets are excluded here, so they never reach the PDF either.
      bullets: publishedBullets(job),
    })),

    skills: [
      ...skillGroups.map((group) => ({
        label: group.title,
        value: group.items.join(", "),
      })),
      { label: "Software", value: softwareLine() },
    ],

    clients: clients.join(", "),

    education: education.map((item) => ({
      line: `${item.degree}, ${item.field}`,
      detail: [
        item.schoolShort
          ? `${item.school} (${item.schoolShort})`
          : item.school,
        item.location,
        item.year,
      ]
        .filter(Boolean)
        .join(" - "),
    })),

    portfolio: profile.domain,
  };
}
