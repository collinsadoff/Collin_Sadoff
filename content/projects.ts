/**
 * PROJECTS - the Work grid and the lightbox player.
 *
 * --------------------------------------------------------------------------
 * HOW TO ADD A PROJECT
 * --------------------------------------------------------------------------
 * Copy any entry below and change the fields:
 *
 *   id           Unique slug. Used for React keys and lightbox navigation.
 *   title        Project title. Rendered uppercase as "CLIENT | TITLE".
 *   client       Client name. Rendered uppercase before the pipe.
 *   categories   One or more of CATEGORIES (below). Drives the filter bar.
 *   aspectRatio  width / height as a NUMBER: 16/9, 9/16, 1, 4/5, 2.39.
 *                This is what the justified grid uses to size the tile, so it
 *                must match the real media or the row will look off.
 *   poster       Still frame URL. "" renders the built-in gray placeholder.
 *   preview      OPTIONAL short muted loop (5-8s, <=720p, MP4). Plays on hover
 *                (desktop) or when scrolled into view (mobile). Omit for none.
 *   video        The full film opened by the lightbox:
 *                  { type: "vimeo",      src: "76979871" }            // id
 *                  { type: "youtube",    src: "dQw4w9WgXcQ" }         // id
 *                  { type: "bunny",      src: "<libraryId>/<videoId>" }
 *                  { type: "mux",        src: "<playbackId>" }
 *                  { type: "cloudflare", src: "<customerCode>/<videoUid>" }
 *                  { type: "mp4",        src: "https://.../film.mp4" }
 *                src: "" renders a placeholder frame instead of a player.
 *   year         OPTIONAL. Shown in the lightbox metadata.
 *   role         What you did: "Shot", "Edited", "Color", "Sound",
 *                "Motion Graphics", "Drone".
 *   tools        OPTIONAL list of software used.
 *   description  OPTIONAL 1-3 sentences shown in the lightbox.
 *   featured     OPTIONAL. Reserved for emphasis; does not reorder the grid.
 *
 * Grid order = array order. Put your strongest work first.
 * --------------------------------------------------------------------------
 */

export const CATEGORIES = [
  "Real Estate",
  "Construction",
  "Events",
  "Public Figures",
  "Fitness",
  "Medical",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type VideoSourceType =
  | "vimeo"
  | "bunny"
  | "mux"
  | "youtube"
  | "cloudflare"
  | "mp4";

export type CaptionTrack = {
  /** URL of a WebVTT file. Browsers do NOT read .srt - convert it first. */
  src: string;
  /** BCP-47 language tag, e.g. "en" or "es". */
  lang: string;
  /** What the player shows in its subtitle menu, e.g. "Espanol". */
  label: string;
};

export type VideoSource = {
  type: VideoSourceType;
  /** Provider id or full URL - see the table above. "" = placeholder. */
  src: string;
  /**
   * OPTIONAL subtitle tracks. Only applies to `type: "mp4"` - the hosted
   * players carry their own captions, uploaded on their side.
   *
   * Browsers need WebVTT, not SRT. To convert, add a "WEBVTT" line at the
   * top of the file and change the comma in each timestamp to a period
   * (00:00:01,500 becomes 00:00:01.500), or run:
   *   ffmpeg -i subtitles.srt subtitles.vtt
   *
   * The first track in the list is the default.
   */
  captions?: CaptionTrack[];
};

export type Role =
  | "Shot"
  | "Edited"
  | "Color"
  | "Sound"
  | "Motion Graphics"
  | "Drone";

export type Project = {
  id: string;
  title: string;
  client: string;
  categories: Category[];
  /** width / height, e.g. 16 / 9 */
  aspectRatio: number;
  /** Poster image URL. "" renders the generated placeholder tile. */
  poster: string;
  /** Short muted loop played on hover / in view. */
  preview?: string;
  video: VideoSource;
  year?: string;
  role: Role[];
  tools?: string[];
  description?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "cornerstone-site-film",
    title: "Site Film",
    client: "Cornerstone Construction",
    categories: ["Construction"],
    aspectRatio: 16 / 9,
    poster: "",
    video: { type: "mp4", src: "" },
    year: "2025",
    role: ["Shot", "Edited", "Color", "Sound", "Drone"],
    tools: ["DaVinci Resolve", "Sony A7 IV", "DJI Mini 5 Pro"],
    description:
      "A single-day shoot across an active build site, cut into a brand film that tracks a project from foundation to framing.",
    featured: true,
  },
  {
    id: "hickory-brand-film",
    title: "Brand Film",
    client: "Hickory Construction",
    categories: ["Construction"],
    aspectRatio: 2.39,
    poster: "",
    video: { type: "mp4", src: "" },
    year: "2025",
    role: ["Shot", "Edited", "Color", "Sound"],
    tools: ["DaVinci Resolve", "Fairlight", "Fusion"],
    description:
      "Anamorphic-framed brand piece built around crew interviews, graded warm to sit alongside the company's print collateral.",
    featured: true,
  },
  {
    id: "svn-listing-tour",
    title: "Listing Tour",
    client: "SVN",
    categories: ["Real Estate"],
    aspectRatio: 16 / 9,
    poster: "",
    video: { type: "mp4", src: "" },
    year: "2025",
    role: ["Shot", "Edited", "Color", "Drone"],
    tools: ["DaVinci Resolve", "DJI Mini 5 Pro"],
    description:
      "Commercial property walkthrough combining drone exteriors with stabilized interior moves.",
  },
  {
    id: "dodson-interiors",
    title: "Interiors",
    client: "Dodson Designs",
    categories: ["Real Estate"],
    aspectRatio: 4 / 5,
    poster: "",
    video: { type: "mp4", src: "" },
    year: "2024",
    role: ["Shot", "Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description:
      "Social cut built for feed placement, with a grade tuned to keep interior whites clean under mixed lighting.",
  },
  {
    id: "reach-member-stories",
    title: "Member Stories",
    client: "Reach Fitness",
    categories: ["Fitness"],
    aspectRatio: 9 / 16,
    poster: "",
    video: { type: "mp4", src: "" },
    year: "2025",
    role: ["Shot", "Edited", "Color", "Sound"],
    tools: ["DaVinci Resolve", "Fairlight"],
    description:
      "Recurring vertical series profiling members, delivered on a weekly cadence from a repeatable template.",
  },
  {
    id: "revitalyze-clinic-spot",
    title: "Clinic Spot",
    client: "Revitalyze MD",
    categories: ["Medical"],
    aspectRatio: 16 / 9,
    poster: "",
    video: { type: "mp4", src: "" },
    year: "2024",
    role: ["Shot", "Edited", "Color", "Sound", "Motion Graphics"],
    tools: ["DaVinci Resolve", "Fusion"],
    description:
      "Broadcast-style clinic spot with Fusion lower thirds and a mix balanced for both web and in-office playback.",
  },
  {
    id: "russell-biven-on-camera",
    title: "On Camera",
    client: "Russell Biven",
    categories: ["Public Figures"],
    aspectRatio: 1,
    poster: "",
    video: { type: "mp4", src: "" },
    year: "2024",
    role: ["Shot", "Edited", "Color", "Sound"],
    tools: ["DaVinci Resolve"],
    description:
      "Square-format talent piece cut for social, lit and graded to keep skin tones consistent across two locations.",
  },
  {
    id: "goat-turf-install-day",
    title: "Install Day",
    client: "Goat Turf",
    categories: ["Construction", "Real Estate"],
    aspectRatio: 9 / 16,
    poster: "",
    video: { type: "mp4", src: "" },
    year: "2025",
    role: ["Shot", "Edited", "Color"],
    tools: ["DaVinci Resolve", "Sony A7 IV"],
    description:
      "Vertical process film following a single install from tear-out to finished yard.",
  },
  {
    id: "expoquip-trade-show",
    title: "Trade Show Recap",
    client: "Expoquip",
    categories: ["Construction", "Events"],
    aspectRatio: 16 / 9,
    poster: "",
    video: { type: "mp4", src: "" },
    year: "2024",
    role: ["Shot", "Edited", "Color", "Sound"],
    tools: ["DaVinci Resolve"],
    description:
      "Same-week event recap shot across a multi-day show floor and turned around for post-event follow-up.",
  },
  {
    id: "curt-maggitt-training-day",
    title: "Training Day",
    client: "Curt Maggitt",
    categories: ["Public Figures", "Fitness"],
    aspectRatio: 9 / 16,
    poster: "",
    video: { type: "mp4", src: "" },
    year: "2025",
    role: ["Shot", "Edited", "Color", "Sound"],
    tools: ["DaVinci Resolve", "Fairlight"],
    description:
      "High-contrast vertical training piece, cut to the rhythm of the session rather than to a music bed.",
  },
  {
    id: "breazeale-patient-story",
    title: "Patient Story",
    client: "Breazeale Clinic",
    categories: ["Medical"],
    aspectRatio: 16 / 9,
    poster: "",
    video: { type: "mp4", src: "" },
    year: "2024",
    role: ["Shot", "Edited", "Color", "Sound"],
    tools: ["DaVinci Resolve", "Fairlight"],
    description:
      "Interview-led patient story with a quiet mix that keeps dialogue forward and music well under it.",
  },
  {
    id: "evolve-class-promo",
    title: "Class Promo",
    client: "Evolve Fitness",
    categories: ["Fitness"],
    aspectRatio: 4 / 5,
    poster: "",
    video: { type: "mp4", src: "" },
    year: "2025",
    role: ["Shot", "Edited", "Color", "Motion Graphics"],
    tools: ["DaVinci Resolve", "Fusion"],
    description:
      "Short promo with animated schedule cards, exported to platform-specific loudness targets.",
  },
  {
    id: "aj-johnson-event-recap",
    title: "Event Recap",
    client: "AJ Johnson",
    categories: ["Public Figures", "Events"],
    aspectRatio: 1,
    poster: "",
    video: { type: "mp4", src: "" },
    year: "2024",
    role: ["Shot", "Edited", "Color", "Sound"],
    tools: ["DaVinci Resolve"],
    description:
      "Live event coverage condensed into a square recap built for same-day posting.",
  },
  {
    id: "bubble-short-film",
    title: "Short Film",
    client: "Bubble",
    categories: ["Events"],
    aspectRatio: 16 / 9,
    poster: "",
    video: { type: "mp4", src: "" },
    year: "2023",
    role: ["Shot", "Edited", "Color", "Sound", "Motion Graphics"],
    tools: ["DaVinci Resolve", "Fusion", "Fairlight"],
    description:
      "Narrative short shot in S-Log3 and finished end to end - grade, mix, titles.",
  },
];

/** Human-readable aspect label for the placeholder tiles, e.g. "16:9". */
export function aspectLabel(ratio: number): string {
  const known: [number, string][] = [
    [16 / 9, "16:9"],
    [9 / 16, "9:16"],
    [1, "1:1"],
    [4 / 5, "4:5"],
    [2.39, "2.39:1"],
    [3 / 2, "3:2"],
    [2 / 3, "2:3"],
    [4 / 3, "4:3"],
  ];
  const hit = known.find(([r]) => Math.abs(r - ratio) < 0.01);
  return hit ? hit[1] : `${ratio.toFixed(2)}:1`;
}
