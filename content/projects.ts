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
 *   categories   One or more of CATEGORIES (below). Context only - shown on
 *                tile hover and in the lightbox. There is no filter bar.
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
  // ==========================================================================
  // TWO THINGS STILL NEED YOU, both marked inline below:
  //
  //   1. video.src is "" on every entry. Paste the hosted URL in and the
  //      lightbox plays it; until then it shows a placeholder frame.
  //
  //   2. Entries marked `CLIENT TBD` are ones I identified from frames but
  //      could not attribute. Replace the client, and check the title while
  //      you are there. Everything above the "unconfirmed" divider has a
  //      client confirmed by on-screen evidence.
  //
  // `role` is a conservative default of Edited + Color on every entry, since
  // I cannot tell from footage what you shot versus finished. Add "Shot",
  // "Sound", "Drone" or "Motion Graphics" where they apply - the lightbox
  // lists them, and they are the clearest signal of range on the whole site.
  // ==========================================================================

  // ---- client confirmed ----------------------------------------------------

  {
    id: "goat-turf-brand-film",
    title: "Brand Film",
    client: "Goat Turf",
    categories: ["Construction", "Real Estate"],
    aspectRatio: 9 / 16,
    poster: "/work/goat-turf-brand-film.webp",
    video: { type: "mp4", src: "" },
    role: ["Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description:
      "Brand film built around the crew and the trucks, cut vertical for social.",
    featured: true,
  },
  {
    id: "1509-texas-ave-property-tour",
    title: "Property Tour",
    client: "1509 Texas Ave",
    categories: ["Real Estate"],
    aspectRatio: 16 / 9,
    poster: "/work/1509-texas-ave-property-tour.webp",
    video: { type: "mp4", src: "" },
    role: ["Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description:
      "Walkthrough of a finished renovation, interiors through to the exterior approach.",
  },
  {
    id: "bent-river-steel-install",
    title: "Steel Install",
    client: "Bent River",
    categories: ["Construction"],
    aspectRatio: 9 / 16,
    poster: "/work/bent-river-steel-install.webp",
    video: { type: "mp4", src: "" },
    role: ["Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description:
      "Crane lift and steel placement on an active site, cut as a short vertical hook.",
  },
  {
    id: "evolve-fitness-team",
    title: "The Team",
    client: "Evolve Fitness",
    categories: ["Fitness"],
    aspectRatio: 9 / 16,
    poster: "/work/evolve-fitness-team.webp",
    video: { type: "mp4", src: "" },
    role: ["Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description:
      "Captioned vertical piece introducing the gym and the people in it.",
  },
  {
    id: "roofplan-commercial-roofing",
    title: "Commercial Roofing",
    client: "RoofPlan",
    categories: ["Construction"],
    aspectRatio: 16 / 9,
    poster: "/work/roofplan-commercial-roofing.webp",
    video: { type: "mp4", src: "" },
    role: ["Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description:
      "Rooftop work shot from the air at golden hour, scaled across a commercial property.",
    featured: true,
  },
  {
    id: "pti-performance-training",
    title: "Performance Training",
    client: "PTI",
    categories: ["Fitness"],
    aspectRatio: 9 / 16,
    poster: "/work/pti-performance-training.webp",
    video: { type: "mp4", src: "" },
    role: ["Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description:
      "Training floor piece cut vertical, from the facility exterior into the session.",
  },
  {
    id: "wedding-jared-amanda",
    title: "Wedding Film",
    client: "Jared & Amanda",
    categories: ["Events"],
    // 16:9. The film is letterboxed to roughly 2.15:1 for parts of its
    // runtime as a look; the poster keeps those bars so the two match.
    aspectRatio: 16 / 9,
    poster: "/work/wedding-jared-amanda.webp",
    video: { type: "mp4", src: "" },
    role: ["Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description:
      "Downtown ceremony and reception, cut as a story-driven film from a live one-take event.",
  },

  // ---- client unconfirmed: replace `CLIENT TBD` before publishing ---------

  {
    id: "lakefront-home-aerial",
    title: "Lakefront Home",
    client: "CLIENT TBD",
    categories: ["Real Estate"],
    aspectRatio: 9 / 16,
    poster: "/work/lakefront-home-aerial.webp",
    video: { type: "mp4", src: "" },
    role: ["Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description: "Aerial tour of a lakefront property and its grounds.",
  },
  {
    id: "live-music-concert",
    title: "Live Music",
    client: "CLIENT TBD",
    categories: ["Events"],
    aspectRatio: 16 / 9,
    poster: "/work/live-music-concert.webp",
    video: { type: "mp4", src: "" },
    role: ["Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description:
      "Concert coverage cut to the performance, shot under heavy stage lighting.",
  },
  {
    id: "metal-fabrication",
    title: "Fabrication",
    client: "CLIENT TBD",
    categories: ["Construction"],
    aspectRatio: 9 / 16,
    poster: "/work/metal-fabrication.webp",
    video: { type: "mp4", src: "" },
    role: ["Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description:
      "Shop-floor process piece: CNC plasma cutting, welding, and finished assemblies.",
  },
  {
    id: "garden-gate-landscape",
    title: "Landscape Design",
    client: "CLIENT TBD",
    categories: ["Real Estate"],
    aspectRatio: 9 / 16,
    poster: "/work/garden-gate-landscape.webp",
    video: { type: "mp4", src: "" },
    role: ["Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description:
      "A designed garden shot as a slow walk through it. Opens on a title card reading “The art of landscape design”.",
  },
  {
    id: "concrete-parking-structure",
    title: "Parking Structure",
    client: "CLIENT TBD",
    categories: ["Construction"],
    aspectRatio: 9 / 16,
    poster: "/work/concrete-parking-structure.webp",
    video: { type: "mp4", src: "" },
    role: ["Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description:
      "Captioned vertical on a concrete deck build, from aerial scale down to crews finishing the surface.",
  },
  {
    id: "gym-comeback-promo",
    title: "Comeback",
    client: "CLIENT TBD",
    categories: ["Fitness"],
    aspectRatio: 9 / 16,
    poster: "/work/gym-comeback-promo.webp",
    video: { type: "mp4", src: "" },
    role: ["Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description: "Captioned gym promo cut to a spoken piece to camera.",
  },
  {
    id: "stone-slab-yard",
    title: "Slab Yard",
    client: "CLIENT TBD",
    categories: ["Construction"],
    aspectRatio: 16 / 9,
    poster: "/work/stone-slab-yard.webp",
    video: { type: "mp4", src: "" },
    role: ["Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description:
      "Stone selection and fabrication, from the slab yard through to finishing by hand.",
  },
  {
    id: "reflecting-pool-landscape",
    title: "Garden & Pool",
    client: "CLIENT TBD",
    categories: ["Real Estate"],
    aspectRatio: 9 / 16,
    poster: "/work/reflecting-pool-landscape.webp",
    video: { type: "mp4", src: "" },
    role: ["Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description:
      "Planting, pergola and water in a designed outdoor space. Possibly the same property as Landscape Design.",
  },
  {
    id: "playground-turf-install",
    title: "Playground Install",
    client: "CLIENT TBD",
    categories: ["Construction"],
    aspectRatio: 9 / 16,
    poster: "/work/playground-turf-install.webp",
    video: { type: "mp4", src: "" },
    role: ["Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description:
      "Playground equipment set on new artificial turf, cut as a captioned vertical.",
  },
  {
    id: "lawn-before-after-aerial",
    title: "Before & After",
    client: "CLIENT TBD",
    categories: ["Real Estate"],
    aspectRatio: 9 / 16,
    poster: "/work/lawn-before-after-aerial.webp",
    video: { type: "mp4", src: "" },
    role: ["Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description:
      "Aerial before-and-after on a residential lawn, with an on-screen reveal.",
  },
  {
    id: "hardscape-pavers",
    title: "Hardscape",
    client: "CLIENT TBD",
    categories: ["Construction"],
    aspectRatio: 9 / 16,
    poster: "/work/hardscape-pavers.webp",
    video: { type: "mp4", src: "" },
    role: ["Edited", "Color"],
    tools: ["DaVinci Resolve"],
    description:
      "Stone patio and paver detail work, shot close and cut slow.",
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
