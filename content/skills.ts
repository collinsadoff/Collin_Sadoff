/**
 * SKILLS, SOFTWARE & GEAR.
 *
 * HOW TO EDIT:
 * - `skillGroups`: add/remove a group or reorder its items. No bars, no
 *   percentages, by design — just grouped capability.
 * - `software`: `years` is optional; omit it and only the name renders.
 * - `gear`: a flat list, joined with a middot on the site.
 * The resume page and PDF condense these same arrays into comma-separated lines.
 */

export type SkillGroup = {
  title: string;
  items: string[];
};

export type Software = {
  name: string;
  /** e.g. "5 yrs" — optional. */
  years?: string;
  /** e.g. "Edit, Color, Fairlight, Fusion" — optional. */
  detail?: string;
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Post-Production",
    items: [
      "Editing, storytelling & pacing",
      "Color grading",
      "Audio mixing (Fairlight)",
      "Motion graphics & compositing (Fusion)",
      "Subtitles & captions (incl. Spanish SRT)",
      "Media management & archiving",
      "Delivery specs for social, web & internal comms",
    ],
  },
  {
    title: "Post Supervision",
    items: [
      "Coaching & developing editors",
      "Reviewing editors' cuts",
      "Post scheduling & risk management",
      "Project & timeline management",
      "Workflow & SOP building",
      "Scheduling crew & shot lists",
      "Technical troubleshooting",
    ],
  },
  {
    // Kept last on purpose: the shooting background is real and useful, but
    // these roles want it as on-set availability, not as the headline.
    title: "On-Set Support",
    items: [
      "Cinematography (S-Log3)",
      "Drone",
      "Lighting & grip",
      "Available for on-set support",
    ],
  },
];

export const software: Software[] = [
  {
    name: "DaVinci Resolve",
    years: "5 yrs",
    detail: "Edit, Color, Fairlight, Fusion",
  },
  { name: "Adobe Premiere Pro", years: "4 yrs" },
  { name: "Final Cut Pro", years: "4 yrs" },
  { name: "Adobe Photoshop, Lightroom & Creative Cloud" },
  { name: "Topaz Video AI, Topaz Photo AI" },
  { name: "Google Drive / Workspace" },
  { name: "macOS & Windows" },
];

export const gear: string[] = [
  "Sony A7 IV",
  "Sigma 24–70mm f/2.8",
  "Laowa 10mm f/2.8",
  "DJI Mini 5 Pro",
];
