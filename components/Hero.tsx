"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { profile } from "@/content/profile";
import { showreel } from "@/content/media";
import { aspectLabel } from "@/content/projects";
import { ReelPlaceholder } from "@/components/Placeholder";
import { ReelLightbox } from "@/components/ReelLightbox";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Hero.
 *
 * The layout follows `showreel.aspectRatio` in content/media.ts:
 *
 *   PORTRAIT or SQUARE -> the reel stands beside the name block, sized to the
 *     viewport height rather than the container width. This is the right shape
 *     for a social/vertical body of work: on a near-black page with no frame
 *     around the video, a 9:16 reel reads as a column of image rather than as
 *     a widescreen video with bars either side. It also keeps the name and the
 *     reel above the fold together, which a full-width 16:9 band cannot do.
 *
 *   LANDSCAPE -> the classic full-width band with the name block underneath,
 *     height-capped so it never pushes the name off-screen.
 *
 * Either way the media box is reserved by aspect-ratio before anything loads,
 * so nothing on the page shifts when the reel arrives.
 */
export function Hero() {
  const [reelOpen, setReelOpen] = useState(false);
  const ratio = showreel.aspectRatio;
  const isPortrait = ratio < 1.2;

  return (
    <section
      id="top"
      aria-labelledby="hero-name"
      className="relative pt-16 sm:pt-20"
    >
      <div className="mx-auto max-w-[1800px] px-5 sm:px-8 lg:px-12">
        {isPortrait ? (
          <PortraitHero ratio={ratio} onPlay={() => setReelOpen(true)} />
        ) : (
          <LandscapeHero ratio={ratio} onPlay={() => setReelOpen(true)} />
        )}
      </div>

      <ReelLightbox open={reelOpen} onClose={() => setReelOpen(false)} />
    </section>
  );
}

/* -------------------------------------------------------------------------
   Vertical-first
   ------------------------------------------------------------------------- */

function PortraitHero({
  ratio,
  onPlay,
}: {
  ratio: number;
  onPlay: () => void;
}) {
  const reduced = useReducedMotion();
  const fade = reduced
    ? {}
    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="grid items-center gap-10 border-b border-line py-8 sm:py-12 lg:grid-cols-12 lg:gap-14 lg:py-16">
      {/* The name leads in the DOM, so the h1 is the first thing a screen
          reader or a crawler meets. CSS `order` alone moves the reel above it
          on small screens, where it is the hook that earns the scroll. */}
      <motion.div
        className="order-2 lg:order-1 lg:col-span-7"
        {...fade}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="label mb-5">{profile.location}</p>
        <h1
          id="hero-name"
          className="display-xl text-[clamp(2.75rem,8.5vw,7.5rem)] text-chalk"
        >
          {profile.name}
        </h1>
        <p className="mt-4 font-display text-[clamp(1rem,2.2vw,1.6rem)] font-semibold tracking-tight text-chalk uppercase">
          {profile.title}
        </p>

        <p className="mt-7 max-w-xl text-base leading-relaxed text-fog sm:text-lg">
          {profile.tagline}
        </p>

        <HeroActions />
      </motion.div>

      <motion.div
        className="order-1 lg:order-2 lg:col-span-5"
        {...fade}
        transition={{
          duration: 0.7,
          delay: reduced ? 0 : 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <ReelFrame ratio={ratio} onPlay={onPlay} />
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Classic wide band
   ------------------------------------------------------------------------- */

function LandscapeHero({
  ratio,
  onPlay,
}: {
  ratio: number;
  onPlay: () => void;
}) {
  const reduced = useReducedMotion();
  const fade = reduced
    ? {}
    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } };

  return (
    <>
      <ReelFrame ratio={ratio} onPlay={onPlay} wide />

      <div className="grid gap-8 border-b border-line py-10 sm:py-14 lg:grid-cols-12 lg:gap-12">
        <motion.div
          className="lg:col-span-7"
          {...fade}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="label mb-5">{profile.location}</p>
          <h1
            id="hero-name"
            className="display-xl text-[clamp(2.75rem,11vw,9rem)] text-chalk"
          >
            {profile.name}
          </h1>
          <p className="mt-4 font-display text-[clamp(1rem,2.6vw,1.75rem)] font-semibold tracking-tight text-chalk uppercase">
            {profile.title}
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col justify-end gap-7 lg:col-span-5"
          {...fade}
          transition={{
            duration: 0.7,
            delay: reduced ? 0 : 0.12,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <p className="max-w-md text-base leading-relaxed text-fog sm:text-lg">
            {profile.tagline}
          </p>
          <HeroActions />
        </motion.div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------
   Shared pieces
   ------------------------------------------------------------------------- */

/**
 * The reel itself.
 *
 * `wide` switches between two sizing models:
 *   - wide:  fill the container width, cap the height so the name still shows.
 *   - else:  size from the VIEWPORT HEIGHT and derive width from the ratio,
 *            which is what keeps a 9:16 reel from becoming a skyscraper.
 * The --reel-h custom property carries the height budget per breakpoint, so
 * one calc() handles any aspect ratio without a component change.
 */
function ReelFrame({
  ratio,
  onPlay,
  wide = false,
}: {
  ratio: number;
  onPlay: () => void;
  wide?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduced = useReducedMotion();
  const hasLoop = Boolean(showreel.loop || showreel.loopWebm);

  // Honour reduced motion for the ambient loop too: hold the poster frame
  // rather than autoplaying video behind the type.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduced) video.pause();
    else void video.play().catch(() => {});
  }, [reduced]);

  const sizing = wide
    ? "w-full [--reel-h:min(68vh,760px)]"
    : // Centred while stacked; flush to the right margin once it sits beside
      // the type, so the reel's edge lines up with the container the way the
      // headline's does on the left.
      "mx-auto w-full lg:mr-0 lg:ml-auto [--reel-h:54vh] sm:[--reel-h:60vh] lg:[--reel-h:min(76vh,860px)]";

  return (
    <div
      className={sizing}
      style={{ maxWidth: `calc(var(--reel-h) * ${ratio})` }}
    >
      <div
        className="grain relative w-full overflow-hidden bg-ink-2"
        style={{ aspectRatio: ratio }}
      >
        {hasLoop ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            poster={showreel.poster || undefined}
            muted
            loop
            playsInline
            autoPlay={!reduced}
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
          >
            {showreel.loopWebm ? (
              <source src={showreel.loopWebm} type="video/webm" />
            ) : null}
            {showreel.loop ? (
              <source src={showreel.loop} type="video/mp4" />
            ) : null}
          </video>
        ) : (
          <ReelPlaceholder aspectLabel={aspectLabel(ratio)} />
        )}

        {/* Scrim so the button stays legible over any footage. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/30"
        />

        <div className="absolute inset-0 z-10 flex items-end justify-between gap-3 p-4 sm:p-6">
          <button
            type="button"
            onClick={onPlay}
            className="inline-flex items-center gap-2.5 border border-white/25 bg-ink/40 px-3.5 py-2.5 text-[11px] font-medium tracking-[0.12em] text-chalk uppercase backdrop-blur-sm transition-colors hover:border-chalk hover:bg-chalk hover:text-ink sm:gap-3 sm:px-5 sm:py-3 sm:text-[12px] sm:tracking-[0.14em]"
          >
            <span
              aria-hidden="true"
              className="inline-block border-y-[5px] border-l-[8px] border-y-transparent border-l-current"
            />
            Play reel with sound
          </button>

          {showreel.runtime ? (
            <span className="label hidden text-white/60 sm:block">
              {showreel.runtime}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function HeroActions(): ReactNode {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <a
        href="#work"
        className="border border-chalk bg-chalk px-5 py-3 text-[12px] font-medium tracking-[0.14em] text-ink uppercase transition-colors hover:bg-transparent hover:text-chalk"
      >
        View Work
      </a>
      <Link
        prefetch={false}
        href="/resume"
        className="border border-line-2 px-5 py-3 text-[12px] font-medium tracking-[0.14em] text-chalk uppercase transition-colors hover:border-chalk"
      >
        View Resume
      </Link>
      <a
        href={`mailto:${profile.email}`}
        className="border border-line-2 px-5 py-3 text-[12px] font-medium tracking-[0.14em] text-chalk uppercase transition-colors hover:border-chalk"
      >
        Get in Touch
      </a>
    </div>
  );
}
