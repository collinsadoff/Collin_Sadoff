/**
 * SKILLS, SOFTWARE & GEAR.
 *
 * HOW TO EDIT:
 * - `skillGroups`: add/remove a group or reorder its items. No bars, no
 *   percentages, by design — just grouped capability.
 * - `software`: `years` is optional; omit it and only the name renders.
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
      "Subtitles & captions",
      "Media management & archiving",
      "Delivery specs for social & web",
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
    // Kept last on purpose: the shooting work is real, but for a post role it
    // supports the edit rather than leading the pitch.
    title: "Production",
    items: [
      "Cinematography across log formats",
      "Exposing log correctly for the grade",
      "Drone operator",
      "Interview & location lighting",
    ],
  },
];

export const software: Software[] = [
  {
    name: "DaVinci Resolve",
    years: "5 yrs",
    detail: "Edit, Color, Fairlight, Fusion",
  },

  { name: "Final Cut Pro", years: "3 yrs" },
  {
    name: "Adobe Creative Cloud",
    years: "9 yrs",
    detail: "Premiere Pro, Photoshop, Lightroom",
  },
  { name: "Topaz Video AI, Topaz Photo AI" },
  { name: "Google Drive / Workspace" },
  { name: "Dropbox" },
  { name: "WeTransfer" },
  { name: "macOS & Windows" },
];

