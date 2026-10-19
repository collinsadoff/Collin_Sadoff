"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  categoryFromSlug,
  categorySlug,
  projects as allProjects,
  type Category,
  type Project,
} from "@/content/projects";
import { FilterBar } from "@/components/FilterBar";
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
 * The Work section: a justified-rows grid of mixed-aspect-ratio videos, a
 * category filter synced to ?category=, and a lightbox player.
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

  const [active, setActive] = useState<Category | "All">("All");
  const [openId, setOpenId] = useState<string | null>(null);

  // Read ?category= on mount so a shared link opens pre-filtered.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setActive(categoryFromSlug(params.get("category")));
  }, []);

  // Write the filter back to the URL without adding history entries.
  const changeCategory = useCallback((next: Category | "All") => {
    setActive(next);
    const url = new URL(window.location.href);
    if (next === "All") url.searchParams.delete("category");
    else url.searchParams.set("category", categorySlug(next));
    window.history.replaceState(null, "", `${url.pathname}${url.search}#work`);
  }, []);

  const filtered: Project[] = useMemo(
    () =>
      active === "All"
        ? allProjects
        : allProjects.filter((p) => p.categories.includes(active)),
    [active],
  );

  const { rows, totalHeight } = useJustifiedLayout(
    filtered,
    width,
    targetRowHeight,
    GUTTER,
  );

  // This grid is the only block on the page whose height the markup cannot
  // predict, so a #hash deep link is re-applied once it has measured itself.
  useHashScrollCorrection(width > 0 && totalHeight > 0);

  const openIndex = filtered.findIndex((p) => p.id === openId);

  const go = useCallback(
    (delta: number) => {
      if (openIndex < 0 || !filtered.length) return;
      const next = (openIndex + delta + filtered.length) % filtered.length;
      setOpenId(filtered[next].id);
    },
    [openIndex, filtered],
  );

  return (
    <>
      <FilterBar active={active} onChange={changeCategory} />

      {/* Reserve the computed height so filtering doesn't jolt the page. */}
      <div ref={ref} style={{ minHeight: totalHeight || undefined }}>
        {width === 0 ? (
          // First paint, before measurement: a quiet skeleton at target height.
          <div
            className="w-full animate-pulse bg-ink-2"
            style={{ height: targetRowHeight }}
          />
        ) : (
          <motion.div
            layout={!reduced}
            className="flex flex-col"
            style={{ gap: GUTTER }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {rows.map((row, rowIndex) => (
                <motion.div
                  key={`${active}-row-${rowIndex}`}
                  layout={!reduced}
                  className="flex"
                  style={{ gap: GUTTER }}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 1 } : { opacity: 0 }}
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

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-fog">
            No projects in this category yet.
          </p>
        ) : null}
      </div>

      <p className="label mt-6" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        {active === "All" ? "" : ` in ${active}`}
      </p>

      <Lightbox
        projects={filtered}
        index={openIndex}
        onClose={() => setOpenId(null)}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
      />
    </>
  );
}
