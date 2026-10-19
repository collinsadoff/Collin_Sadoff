import type { VideoSource } from "@/content/projects";

/**
 * Turns a `{ type, src }` pair from a content file into a playable embed URL.
 *
 * `src` accepts either the provider's bare id (the normal case, documented in
 * content/projects.ts) or a full URL you pasted from the provider - if it
 * already starts with http, it is used as-is.
 */
export function embedUrl(source: VideoSource, autoplay = true): string {
  const { type, src } = source;
  if (!src) return "";
  if (src.startsWith("http") && type !== "mp4") return src;

  const auto = autoplay ? "1" : "0";

  switch (type) {
    case "vimeo":
      return `https://player.vimeo.com/video/${src}?autoplay=${auto}&dnt=1&title=0&byline=0&portrait=0`;
    case "youtube":
      return `https://www.youtube-nocookie.com/embed/${src}?autoplay=${auto}&rel=0&modestbranding=1`;
    case "bunny":
      // src is "<libraryId>/<videoId>"
      return `https://iframe.mediadelivery.net/embed/${src}?autoplay=${auto}&preload=true`;
    case "mux":
      // src is the playback id
      return `https://player.mux.com/${src}?autoplay=${auto}`;
    case "cloudflare":
      // src is "<customerCode>/<videoUid>"
      return `https://customer-${src.split("/")[0]}.cloudflarestream.com/${src
        .split("/")
        .slice(1)
        .join("/")}/iframe?autoplay=${auto}`;
    case "mp4":
    default:
      return src;
  }
}

/** mp4 plays in a native <video>; everything else is a provider iframe. */
export function isNativeVideo(source: VideoSource): boolean {
  return source.type === "mp4";
}

/** Nothing to play yet - render the placeholder frame instead of a player. */
export function hasVideo(source: VideoSource): boolean {
  return Boolean(source.src);
}
