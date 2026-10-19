"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ColorComparison } from "@/content/color";
import { ColorPlaceholder } from "@/components/Placeholder";

/**
 * Before/after grade comparison with a draggable divider.
 *
 * Input support is deliberately complete:
 *   - mouse drag (pointer events, with capture so the drag survives leaving
 *     the element)
 *   - touch drag (same pointer events, with touch-action: none)
 *   - keyboard: the handle is a real slider role with arrow / Home / End,
 *     so it works without a pointer at all
 *
 * Images now; set beforeVideo / afterVideo in content/color.ts later and the
 * same component plays two muted loops in sync instead.
 */
export function BeforeAfter({ item }: { item: ColorComparison }) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const beforeVideoRef = useRef<HTMLVideoElement | null>(null);
  const afterVideoRef = useRef<HTMLVideoElement | null>(null);

  const hasVideo = Boolean(item.beforeVideo && item.afterVideo);

  const setFromClientX = useCallback((clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  }, []);

  // Keep the two loops locked together; a drifting pair reads as a glitch.
  useEffect(() => {
    if (!hasVideo) return;
    const before = beforeVideoRef.current;
    const after = afterVideoRef.current;
    if (!before || !after) return;

    const sync = () => {
      if (Math.abs(before.currentTime - after.currentTime) > 0.08) {
        after.currentTime = before.currentTime;
      }
    };
    before.addEventListener("timeupdate", sync);
    return () => before.removeEventListener("timeupdate", sync);
  }, [hasVideo]);

  const step = (delta: number) =>
    setPosition((value) => Math.min(100, Math.max(0, value + delta)));

  return (
    <figure>
      <div
        ref={frameRef}
        className="relative w-full touch-none overflow-hidden bg-ink-2 select-none"
        style={{ aspectRatio: item.aspectRatio }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
          setFromClientX(event.clientX);
        }}
        onPointerMove={(event) => {
          if (dragging) setFromClientX(event.clientX);
        }}
        onPointerUp={(event) => {
          event.currentTarget.releasePointerCapture(event.pointerId);
          setDragging(false);
        }}
        onPointerCancel={() => setDragging(false)}
      >
        {/* GRADED (after) fills the frame; LOG (before) is clipped over it. */}
        <Side
          side="after"
          item={item}
          videoRef={afterVideoRef}
          hasVideo={hasVideo}
        />

        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Side
            side="before"
            item={item}
            videoRef={beforeVideoRef}
            hasVideo={hasVideo}
          />
        </div>

        {/* Corner labels */}
        <span className="label pointer-events-none absolute top-3 left-3 bg-ink/65 px-2 py-1 text-white/80 backdrop-blur-sm">
          Log
        </span>
        <span className="label pointer-events-none absolute top-3 right-3 bg-ink/65 px-2 py-1 text-white/80 backdrop-blur-sm">
          Graded
        </span>

        {/* Divider */}
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-white/90"
          style={{ left: `${position}%` }}
          aria-hidden="true"
        />

        {/* Handle: the real, focusable control. */}
        <button
          type="button"
          role="slider"
          aria-label={`Reveal the graded version of ${item.title}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)}% graded`}
          onKeyDown={(event) => {
            const keys: Record<string, number> = {
              ArrowLeft: -2,
              ArrowRight: 2,
              ArrowDown: -2,
              ArrowUp: 2,
              PageDown: -10,
              PageUp: 10,
            };
            if (event.key in keys) {
              event.preventDefault();
              step(keys[event.key]);
            } else if (event.key === "Home") {
              event.preventDefault();
              setPosition(0);
            } else if (event.key === "End") {
              event.preventDefault();
              setPosition(100);
            }
          }}
          className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-white/70 bg-ink/70 text-white backdrop-blur-sm"
          style={{ left: `${position}%` }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M9 7l-4 5 4 5M15 7l4 5-4 5" />
          </svg>
        </button>
      </div>

      <figcaption className="mt-4">
        <p className="font-display text-sm font-bold tracking-[0.12em] text-chalk uppercase">
          {item.title}
          {item.client ? (
            <span className="text-fog-2"> / {item.client}</span>
          ) : null}
        </p>
        {item.note ? (
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-fog">
            {item.note}
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}

function Side({
  side,
  item,
  videoRef,
  hasVideo,
}: {
  side: "before" | "after";
  item: ColorComparison;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  hasVideo: boolean;
}) {
  const src = side === "before" ? item.before : item.after;
  const videoSrc = side === "before" ? item.beforeVideo : item.afterVideo;

  if (hasVideo && videoSrc) {
    return (
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={videoSrc}
        poster={src || undefined}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      />
    );
  }

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={
          side === "before"
            ? `${item.title}, ungraded log frame`
            : `${item.title}, final graded frame`
        }
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <ColorPlaceholder
      graded={side === "after"}
      className="absolute inset-0 h-full w-full"
    />
  );
}
