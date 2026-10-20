/**
 * EXPERIENCE — the timeline on the homepage and the EXPERIENCE block on /resume.
 *
 * HOW TO EDIT:
 * - Keep the array newest-first; both the timeline and the resume render in order.
 * - Each bullet is a plain string. Write them as accomplishments, not duties.
 * - A bullet with `todo: true` is a placeholder you still need to write. It is
 *   NEVER rendered on the live site or in the PDF — it exists so this file keeps
 *   track of the gap. Replace the text and delete the `todo` flag to publish it.
 */

export type Bullet = {
  text: string;
  /** true = unfinished placeholder; hidden from the site, resume and PDF. */
  todo?: boolean;
};

export type Job = {
  id: string;
  company: string;
  role: string;
  /** Display string, e.g. "2023 – Present". */
  dates: string;
  location?: string;
  bullets: Bullet[];
};

export const experience: Job[] = [
  {
    id: "skvara",
    company: "The Skvara Agency",
    role: "Lead Videographer & Lead Editor",
    dates: "2023 – Present",
    location: "Knoxville, TN",
    // Ordered post-first on purpose: post-producer roles read the top two or
    // three bullets, and the shooting work is a supporting strength here.
    bullets: [
      {
        text: "Lead post-production for commercial and social clients across construction, fitness, medical, and design, from ingest to final delivery.",
      },
      {
        text: "Edit, color, and mix end to end in DaVinci Resolve, including Fusion motion graphics and detailed Fairlight audio mixes.",
      },
      {
        text: "Review other editors' cuts and give notes that explain the why, not just the fix, keeping the team's work consistent and on-brand.",
      },
      {
        text: "Built standardized social delivery workflows: proxy media strategy, bus routing with sidechain ducking, loudness targets, naming conventions, and export specs.",
      },
      {
        text: "Manage recurring content schedules across concurrent projects, including shot lists for a subcontracted drone pilot, and lead shoots myself when a project calls for it.",
      },
      { text: "Deliver Spanish SRT subtitles for construction clients." },
    ],
  },
  {
    id: "wedding",
    company: "Independent Wedding Videographer",
    role: "Owner / Operator",
    dates: "2020 – 2023",
    location: "Knoxville, TN",
    bullets: [
      {
        text: "Ran a solo wedding film business end to end: booking, planning, shooting, editing, color, sound, and delivery.",
      },
      {
        text: "Captured live, one-take events with no reshoots, then cut them into story-driven films.",
      },
      {
        text: "Managed multiple projects in post at once while consistently meeting delivery deadlines.",
      },
    ],
  },
  {
    id: "haven",
    company: "Haven Media",
    role: "Videographer & Video Editor",
    dates: "2017 – 2020",
    location: "Knoxville, TN",
    bullets: [
      {
        text: "Worked commercial sets as part of the production crew, from setup through wrap.",
      },
      {
        text: "Filmed and edited weddings end to end, from coverage through the final cut.",
      },
      {
        text: "Owned all behind-the-scenes content: filmed it, cut it, and managed delivery.",
      },
    ],
  },
];

/** Bullets that are safe to display (everything not marked TODO). */
export function publishedBullets(job: Job): string[] {
  return job.bullets.filter((b) => !b.todo).map((b) => b.text);
}
