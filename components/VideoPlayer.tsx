"use client";

import type { VideoSource } from "@/content/projects";
import { embedUrl, hasVideo, isNativeVideo } from "@/lib/video";
import { MediaPlaceholder } from "@/components/Placeholder";

/**
 * One player for every source type in the content files. Fills its parent,
 * which owns the aspect ratio, so there is no layout shift when it loads.
 */
export function VideoPlayer({
  source,
  title,
  poster,
  autoPlay = true,
  placeholderLabel,
}: {
  source: VideoSource;
  title: string;
  poster?: string;
  autoPlay?: boolean;
  placeholderLabel?: string;
}) {
  if (!hasVideo(source)) {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <MediaPlaceholder label={placeholderLabel ?? "NO VIDEO SOURCE YET"} />
        <p className="label relative z-10 text-center text-white/60">
          Add a video source in content/projects.ts
        </p>
      </div>
    );
  }

  if (isNativeVideo(source)) {
    return (
      <video
        className="absolute inset-0 h-full w-full bg-black"
        src={source.src}
        poster={poster || undefined}
        controls
        autoPlay={autoPlay}
        playsInline
        preload="metadata"
      >
        {/* A real caption track only when there is one to point at. An empty
            <track> advertises captions that do not exist, which is worse for
            a screen-reader user than having none. */}
        {source.captions?.map((track, index) => (
          <track
            key={track.src}
            kind="subtitles"
            src={track.src}
            srcLang={track.lang}
            label={track.label}
            default={index === 0}
          />
        ))}
      </video>
    );
  }

  return (
    <iframe
      className="absolute inset-0 h-full w-full border-0 bg-black"
      src={embedUrl(source, autoPlay)}
      title={title}
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
      allowFullScreen
      loading="lazy"
    />
  );
}
