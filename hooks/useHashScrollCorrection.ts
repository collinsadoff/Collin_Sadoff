"use client";

import { useEffect, useRef } from "react";

/** How long to keep re-asserting the scroll position, in ms. */
const WINDOW_MS = 1200;

/** Keys that mean "I am scrolling this page myself". */
const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);
/** Target is "arrived" when its top is within this many px of the scroll port. */
const TOLERANCE = 120;

/**
 * Re-applies a deep link's #hash once the page has finished sizing itself.
 *
 * Why this is needed: the browser jumps to #section while parsing the HTML,
 * before React hydrates and before the justified grid has measured its
 * container. The grid is the one block whose height is not knowable from the
 * markup alone, so when it resolves, everything below it moves and the
 * original jump is left pointing at the wrong place - you land in a gap.
 *
 * Why it retries rather than scrolling once: hydration and the router can both
 * reset scroll position after we correct it, so a single scroll silently loses.
 * This re-checks for a short window and re-asserts until the target is actually
 * at the top, then stops.
 *
 * The visitor always wins: any real scroll of their own cancels the correction
 * immediately and permanently.
 */
export function useHashScrollCorrection(settled: boolean) {
  const done = useRef(false);

  useEffect(() => {
    if (!settled || done.current) return;

    const hash = window.location.hash;
    if (hash.length < 2) {
      done.current = true;
      return;
    }

    let target: Element | null;
    try {
      target = document.querySelector(hash);
    } catch {
      // A hash that isn't a valid selector (e.g. "#1") - nothing to do.
      done.current = true;
      return;
    }
    if (!target) {
      done.current = true;
      return;
    }

    const startedAt = performance.now();
    let cancelled = false;
    let frame = 0;

    // Cancel on real user INPUT, not on scroll position changes. Hydration and
    // the router both reset scroll during this window, and a scroll-delta
    // check cannot tell that apart from a person scrolling - it just loses the
    // race and gives up. Input events are unambiguous.
    const stop = () => {
      cancelled = true;
      done.current = true;
      teardown();
    };
    const onKey = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) stop();
    };

    const teardown = () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(frame);
    };

    const tick = () => {
      if (cancelled) return;

      const top = target!.getBoundingClientRect().top;
      const arrived = Math.abs(top) <= TOLERANCE;
      const expired = performance.now() - startedAt > WINDOW_MS;

      if (arrived && expired) {
        done.current = true;
        teardown();
        return;
      }

      // Keep re-asserting for the whole window even once we have arrived:
      // a late reset would otherwise land the visitor back at the top with no
      // explanation. Re-scrolling an already-correct page is a no-op.
      if (!arrived) {
        // "instant", NOT "auto": `auto` defers to the CSS scroll-behavior,
        // which is smooth on this site - so each tick would start a fresh
        // animation that fights the previous one and never settles. "instant"
        // also reads better here, since this corrects a jump that already
        // happened and animating it would look like an unexplained lurch.
        target!.scrollIntoView({ behavior: "instant", block: "start" });
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", onKey);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      teardown();
    };
  }, [settled]);
}
