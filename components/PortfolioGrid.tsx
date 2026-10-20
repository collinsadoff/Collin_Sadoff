"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { projects } from "@/content/projects";
import { VideoTile } from "@/components/VideoTile";
import { Lightbox } from "@/components/Lightbox";
import { useElementWidth } from "@/hooks/useElementWidth";
import { useHashScrollCorrection } from "@/hooks/useHashScrollCorrection";
import { useJustifiedLayout } from "@/hooks/useJustifiedLayout";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Gutter between tiles, in px. Matches the reference layout's thin gaps. */
const GUTTER = 11;

/**
 * The Work section: a justified-rows grid of mixed-aspect-ratio videos with a
 * lightbox player.
 *
 * There is deliberately no category filter. At a curated ~15 pieces the whole
 * grid is visible in a screen and a half, so sorting by industry would be
 * navigation for its own sake - and the people this site is aimed at are
 * judging craft, not shopping by vertical. Each project still carries its
 * `categories`, which show on tile hover and in the lightbox.
 *
 * Running order is therefore the only curation tool: the array order in
 * content/projects.ts is the order on screen, so the strongest work goes
 * first, and categories read better interleaved than grouped.
 *
 * Layout is computed from the measured container width rather than from CSS
 * breakpoints, so it re-flows correctly inside any container at any zoom.
 */
export function PortfolioGrid() {
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const reduced = useReducedMotion();

  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isTablet = useMediaQuery("(min-width: 768px)");
  const targetRowHeight = isDesktop ? 380 : isTablet ? 280 : 200;

  const [openId, setOpenId] = useState<string | null>(null);

  const { rows, totalHeight } = useJustifiedLayout(
    projects,
    width,
    targetRowHeight,
    GUTTER,
  );

  // This grid is the only block on the page whose height the markup cannot
  // predict, so a #hash deep link is re-applied once it has measured itself.
  useHashScrollCorrection(width > 0 && totalHeight > 0);

  const openIndex = projects.findIndex((p) => p.id === openId);

  const go = useCallback(
    (delta: number) => {
      if (openIndex < 0 || !projects.length) return;
      const next = (openIndex + delta + projects.length) % projects.length;
      setOpenId(projects[next].id);
    },
    [openIndex],
  );

  return (
    <>
      {/* Reserve the computed height so the page doesn't jolt as it resolves. */}
      <div ref={ref} style={{ minHeight: totalHeight || undefined }}>
        {width === 0 ? (
          // First paint, before measurement: a quiet skeleton at target height.
          <div
            className="w-full animate-pulse bg-ink-2"
            style={{ height: targetRowHeight }}
          />
        ) : (
          <motion.div className="flex flex-col" style={{ gap: GUTTER }}>
            <AnimatePresence initial={false}>
              {rows.map((row, rowIndex) => (
                <motion.div
                  key={`row-${rowIndex}`}
                  className="flex"
                  style={{ gap: GUTTER }}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: reduced ? 0 : Math.min(rowIndex * 0.05, 0.25),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {row.items.map((placed) => (
                    <VideoTile
                      key={placed.item.id}
                      project={placed.item}
                      width={placed.width}
                      height={placed.height}
                      index={placed.index}
                      onOpen={() => setOpenId(placed.item.id)}
                    />
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {projects.length === 0 ? (
          <p className="py-16 text-center text-fog">
            No projects yet. Add one in content/projects.ts.
          </p>
        ) : null}
      </div>

      <Lightbox
        projects={projects}
        index={openIndex}
        onClose={() => setOpenId(null)}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
      />
    </>
  );
}
