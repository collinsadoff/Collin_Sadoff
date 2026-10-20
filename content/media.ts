/**
 * SITE MEDIA - the one-off assets that aren't part of a project list.
 *
 * HOW TO EDIT: drop the real file in /public/ and point the path here.
 * Any value left as "" renders the generated gray placeholder instead, so the
 * site looks finished before your media exists.
 */

export type Showreel = {
  /**
   * The reel's shape, as width / height. THIS ALSO PICKS THE HERO LAYOUT:
   *
   *   9 / 16  (or anything taller than it is wide)
   *     Vertical-first hero. The reel stands beside your name instead of
   *     above it, sized to the viewport height. Use this when most of your
   *     work is social/Instagram - a vertical reel on this near-black page
   *     reads as a column of image, not as a letterboxed widescreen video.
   *
   *   16 / 9  (or any landscape ratio)
   *     Classic full-width band across the top, name block underneath.
   *
   *   1       Square. Uses the vertical-first layout.
   *
   * Switch between them by changing this one number - no component edits.
   */
  aspectRatio: number;
  /** Muted autoplay loop behind the hero. MP4, 10-30s, <=1080p, no audio. */
  loop: string;
  /** Optional WebM of the same loop, served first when supported. */
  loopWebm: string;
  /** Still frame shown before the loop loads. ~1920px wide, WebP or JPG. */
  poster: string;
  /** The full reel with sound, opened by "Play reel with sound". */
  full: {
    type: "vimeo" | "bunny" | "mux" | "youtube" | "cloudflare" | "mp4";
    src: string;
  };
  /** Shown in the lightbox header. */
  title: string;
  /** Monospace runtime label, e.g. "01:42". "" hides it. */
  runtime: string;
};

export const showreel: Showreel = {
  aspectRatio: 9 / 16, // vertical-first. Change to 16 / 9 for a wide reel.
  loop: "", // e.g. "/media/reel-loop.mp4"
  loopWebm: "", // e.g. "/media/reel-loop.webm"
  poster: "", // e.g. "/media/reel-poster.jpg"
  full: { type: "mp4", src: "" }, // e.g. { type: "vimeo", src: "123456789" }
  title: "Showreel",
  runtime: "",
};

export type Headshot = {
  /** 4:5 portrait, ~1200x1500. "" renders the placeholder. */
  src: string;
  alt: string;
};

export const headshot: Headshot = {
  src: "", // e.g. "/media/headshot.jpg"
  alt: "Collin Sadoff",
};
