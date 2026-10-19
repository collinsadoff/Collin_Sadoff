/**
 * HOW I WORK - the process section.
 *
 * HOW TO EDIT:
 * - `processSteps`: the numbered pipeline. Reorder or add a step; the numbers
 *   (01, 02, ...) are generated from array position, so you never renumber.
 * - `runningPost`: the post-supervision bullets under the steps.
 * - `editorCoaching`: how you develop other editors. Post-producer roles weight
 *   this heavily, so it gets its own block rather than one passing bullet.
 * - `aiNote`: the single "AI, used responsibly" line.
 *
 * All three blocks share one shape, so adding a fourth is a copy/paste plus one
 * line in components/Process.tsx.
 */

export type ProcessStep = {
  title: string;
  body: string;
};

export type ProcessBlock = {
  title: string;
  bullets: string[];
};

export const processSteps: ProcessStep[] = [
  {
    title: "Brief & Plan",
    body: "Understand the goal, the audience, and the deliverables before anything gets shot or cut.",
  },
  {
    title: "Ingest & Organize",
    body: "Consistent naming conventions, a proxy/optimized media strategy, and media that is backed up and retrievable.",
  },
  {
    title: "Edit",
    body: "Story and pacing first: build the structure, then refine it.",
  },
  {
    title: "Color",
    body: "Establish the look, then hold it: a consistent grade across the whole project, S-Log3 to Rec.709.",
  },
  {
    title: "Sound",
    body: "Fairlight mixes balancing dialogue, music, and SFX, with platform-specific loudness targets.",
  },
  {
    title: "Finish & Deliver",
    body: "Platform-specific export specs, captions and subtitles, including Spanish SRT.",
  },
  {
    title: "Archive & Handoff",
    body: "Clean project archives and handoffs so anyone can pick it back up.",
  },
];

export const runningPost: ProcessBlock = {
  title: "Running Post",
  bullets: [
    "Build the post schedule off the brief, then flag risk early enough to protect the work instead of absorbing it at the deadline.",
    "Own the pipeline across concurrent projects: milestones, editing tasks, and who is picking up what.",
    "Manage schedules, shot lists, and subcontracted crew, including a drone pilot on a recurring client content package.",
    "Build repeatable workflows and cheat sheets - pass-off standards, naming conventions, review stages, finishing checklists - so the team works faster and more consistently.",
    "Troubleshoot technical problems - corrupted optimized media, plugin performance bottlenecks - before they hit a deadline.",
  ],
};

export const editorCoaching: ProcessBlock = {
  title: "Developing Editors",
  bullets: [
    "Notes that transfer, not just notes that fix: I tell an editor why a cut is not landing, so the next one comes back better.",
    "Review other editors' cuts for pacing, structure, and brand consistency, and keep that standard the same across everyone.",
    "Share the technique behind the fix - the grade, the mix move, the timeline setup - so it becomes something the team owns.",
    "Finish other people's work without ego: my job is to make the piece better regardless of who cut the majority of it.",
  ],
};

export const aiNote = {
  title: "AI, Used Responsibly",
  body: "I use AI where it actually helps, like upscaling and cleanup in Topaz Video AI and Photo AI or AI-assisted virtual staging for real estate stills, and never as a substitute for taste.",
};
