/**
 * Section registry. One list drives the nav links, the anchor ids, and the
 * timecode-styled section numbers (01:00:00:00 - WORK), so adding a section
 * means editing this file and nothing else.
 */

export type Section = {
  /** Anchor id, used as #id in the nav and as the <section id>. */
  id: string;
  /** Nav link text. */
  nav: string;
  /** Heading label shown beside the timecode. */
  label: string;
  /** false = section exists but is not listed in the nav. */
  inNav: boolean;
};

export const sections: Section[] = [
  { id: "work", nav: "Work", label: "Work", inNav: true },
  { id: "color", nav: "Color", label: "Color", inNav: true },
  { id: "about", nav: "About", label: "About", inNav: true },
  { id: "process", nav: "Process", label: "How I Work", inNav: true },
  { id: "experience", nav: "Experience", label: "Experience", inNav: true },
  { id: "skills", nav: "Skills", label: "Skills & Tools", inNav: true },
  { id: "contact", nav: "Contact", label: "Contact", inNav: true },
];

export const navSections = sections.filter((s) => s.inNav);

/**
 * Hour-incrementing timecode for a section, the way reels are numbered on
 * tape: section 1 is 01:00:00:00, section 2 is 02:00:00:00.
 */
export function timecodeFor(id: string): string {
  const index = sections.findIndex((s) => s.id === id);
  const hour = String(Math.max(index, 0) + 1).padStart(2, "0");
  return `${hour}:00:00:00`;
}
