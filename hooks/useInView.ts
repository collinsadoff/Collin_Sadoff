"use client";

import { useEffect, useRef, useState } from "react";

/**
 * IntersectionObserver wrapper used for two things:
 *   1. lazily loading and playing tile preview loops only while visible, and
 *   2. gating the "play on mobile" behaviour on the portfolio grid.
 *
 * `once: true` latches true and disconnects - that is the mode to use for
 * reveal animations so content never animates back out.
 */
export function useInView<T extends HTMLElement>(options?: {
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}) {
  const { rootMargin = "0px", threshold = 0, once = false } = options ?? {};
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No IO (very old browser, some test envs): show content rather than hide.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return { ref, inView };
}
