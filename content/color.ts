/**
 * COLOR - the before/after grading comparisons.
 *
 * HOW TO EDIT:
 * - `before` is the ungraded/log frame, `after` is the final grade.
 * - Leave both as "" to render the built-in placeholder (a flat desaturated
 *   block on the LOG side, a contrasty one on the GRADED side) so you can see
 *   the slider working before you have real frames.
 * - Drop real frames in /public/color/ and reference them as "/color/name.jpg".
 *   Export matched stills from the SAME frame of the SAME shot, same
 *   resolution, ~1600px wide, WebP or JPG.
 * - To compare VIDEO later instead of stills, set `beforeVideo` / `afterVideo`
 *   to muted loop URLs; the component plays them in sync and the stills become
 *   the posters.
 */

export type ColorComparison = {
  id: string;
  title: string;
  client?: string;
  /** Ungraded / log still. "" = placeholder. */
  before: string;
  /** Final graded still. "" = placeholder. */
  after: string;
  /** OPTIONAL muted loop for the LOG side. */
  beforeVideo?: string;
  /** OPTIONAL muted loop for the GRADED side. */
  afterVideo?: string;
  /** Short note on the grade - shown under the slider. */
  note?: string;
  /** width / height of the frames. */
  aspectRatio: number;
};

export const colorHeading = {
  title: "Color",
  line: "Shot in log and exposed for the grade, whatever the camera. I set the look for a project and then hold it - every shot, every deliverable, across the whole brand.",
};

export const colorComparisons: ColorComparison[] = [
  {
    id: "exterior-golden-hour",
    title: "Exterior, Golden Hour",
    client: "Construction",
    before: "",
    after: "",
    aspectRatio: 16 / 9,
    note: "Log to Rec.709, warmed through the highlights with the sky held back so the building keeps its edge.",
  },
  {
    id: "interior-mixed-light",
    title: "Interior, Mixed Light",
    client: "Real Estate",
    before: "",
    after: "",
    aspectRatio: 16 / 9,
    note: "Tungsten and daylight balanced per-window, then a light contrast curve to keep the whites from going flat.",
  },
  {
    id: "interview-skin-tones",
    title: "Interview, Skin Tones",
    client: "Medical",
    before: "",
    after: "",
    aspectRatio: 16 / 9,
    note: "Skin tones pinned to the vector line first, background desaturated after, so the subject sits forward in frame.",
  },
];
