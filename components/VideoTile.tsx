"use client";

import { useEffect, useRef, useState } from "react";
import { aspectLabel, type Project } from "@/content/projects";
import { MediaPlaceholder } from "@/components/Placeholder";
import { useInView } from "@/hooks/useInView";
import { useHasHover } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * One tile in the justified grid.
 *
 * Poster by default. The short muted preview loop is only attached to the DOM
 * once the tile has been near the viewport (IntersectionObserver), and only
 * PLAYS when it should:
 *   - pointer devices: on hover / keyboard focus
 *   - touch devices:   while the tile is actually on screen
 * It pauses and rewinds the moment either stops being true, so a long grid
 * never has more than a few decoding video elements at once.
 */
export function VideoTile({
  project,
  width,
  height,
  index,
  onOpen,
}: {
  project: Project;
  width: number;
  height: number;
  index: number;
  onOpen: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const hasHover = useHasHover();
  const reduced = useReducedMotion();

  // rootMargin pre-loads a screen early so a preview is ready on arrival.
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "300px" });
  // Latches once, so we never tear the <video> element back out of the DOM.
  const [everInView, setEverInView] = useState(false);
  useEffect(() => {
    if (inView) setEverInView(true);
  }, [inView]);

  const hasPreview = Boolean(project.preview);
  const shouldPlay =
    hasPreview && !reduced && (hasHover ? hovered : inView);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlay) {
      void video.play().catch(() => {});
    } else {
      video.pause();
      // Rewind so the next hover starts the loop from the top.
      if (video.currentTime > 0) video.currentTime = 0;
    }
  }, [shouldPlay]);

  const label = `${project.client} | ${project.title}`;

  return (
    <div
      ref={ref}
      className="group relative shrink-0 overflow-hidden bg-ink-2"
      style={{ width, height }}
    >
      <button
        type="button"
        onClick={onOpen}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="absolute inset-0 h-full w-full cursor-pointer text-left"
      >
        <span className="sr-only">
          Open {label}
          {project.year ? `, ${project.year}` : ""}
        </span>

        {/* Media layer. Scales very slightly on hover; no scale when reduced. */}
        <span
          className={`absolute inset-0 block overflow-hidden transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            reduced ? "" : "group-hover:scale-[1.035]"
          }`}
        >
          {project.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.poster}
              alt=""
              loading={index < 4 ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <MediaPlaceholder tone={(index % 4) as 0 | 1 | 2 | 3} />
          )}

          {everInView && hasPreview ? (
            <video
              ref={videoRef}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                shouldPlay ? "opacity-100" : "opacity-0"
              }`}
              src={project.preview}
              poster={project.poster || undefined}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              tabIndex={-1}
            />
          ) : null}
        </span>

        {/* Scrim: keeps the centered title legible over any frame. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 block bg-gradient-to-b from-black/35 via-black/45 to-black/55 transition-opacity duration-500 group-hover:opacity-80"
        />

        {/* Title block */}
        <span className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <span
            className={`font-display text-[clamp(0.75rem,1.15vw,1rem)] leading-tight font-bold tracking-[0.1em] text-white uppercase drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              reduced ? "" : "group-hover:-translate-y-1"
            }`}
          >
            {project.client} | {project.title}
          </span>

          {/* Placeholder-only: label the aspect ratio while testing layout. */}
          {!project.poster ? (
            <span className="label mt-2 text-[10px] text-white/60">
              {aspectLabel(project.aspectRatio)} - PLACEHOLDER
            </span>
          ) : null}

        </span>
      </button>
    </div>
  );
}
