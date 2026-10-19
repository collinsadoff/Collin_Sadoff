"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { profile } from "@/content/profile";
import { showreel } from "@/content/media";
import { ReelPlaceholder } from "@/components/Placeholder";
import { ReelLightbox } from "@/components/ReelLightbox";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Hero: a full-width 16:9 showreel that plays muted and looping as a
 * background preview, with the name block beneath it and a button that opens
 * the reel with sound in the lightbox.
 *
 * The 16:9 box is reserved by aspect-ratio before any media loads, so nothing
 * on the page shifts when the reel arrives.
 */
export function Hero() {
  const [reelOpen, setReelOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduced = useReducedMotion();
  const hasLoop = Boolean(showreel.loop || showreel.loopWebm);

  // Honour reduced motion for the ambient background loop too: hold the
  // poster frame rather than autoplaying video behind the type.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduced) video.pause();
    else void video.play().catch(() => {});
  }, [reduced]);

  const fade = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section
      id="top"
      aria-labelledby="hero-name"
      className="relative pt-16 sm:pt-20"
    >
      <div className="mx-auto max-w-[1800px] px-5 sm:px-8 lg:px-12">
        {/* Reel. 16:9 reserves the box before any media loads; the max-height
            keeps a full-width reel from pushing the name block off-screen on
            short or very wide displays - it crops rather than letterboxes. */}
        <div className="grain relative max-h-[min(68vh,760px)] w-full overflow-hidden bg-ink-2 [aspect-ratio:16/9]">
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
            <ReelPlaceholder />
          )}

          {/* Scrim so the button and labels stay legible over any footage. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/30"
          />

          <div className="absolute inset-0 z-10 flex items-end justify-between gap-4 p-5 sm:p-8">
            <button
              type="button"
              onClick={() => setReelOpen(true)}
              className="group inline-flex items-center gap-3 border border-white/25 bg-ink/40 px-4 py-2.5 text-[12px] font-medium tracking-[0.14em] text-chalk uppercase backdrop-blur-sm transition-colors hover:border-chalk hover:bg-chalk hover:text-ink sm:px-5 sm:py-3"
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

        {/* Name block */}
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

            <div className="flex flex-wrap gap-3">
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
          </motion.div>
        </div>
      </div>

      <ReelLightbox open={reelOpen} onClose={() => setReelOpen(false)} />
    </section>
  );
}
