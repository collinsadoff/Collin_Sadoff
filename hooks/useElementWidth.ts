"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * useLayoutEffect on the client, useEffect on the server. Measuring in a
 * layout effect means the width is known BEFORE the browser paints, so the
 * grid never shows a wrong-size frame and never shifts the page under itself.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Tracks an element's content-box width with ResizeObserver so the justified
 * grid can re-flow on any container change, not just window resizes
 * (scrollbar appearing, sidebar, zoom, font load).
 *
 * Returns 0 until the element is measured; render a reserved-height skeleton
 * in that first frame to avoid layout shift.
 */
export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  const measure = useCallback((node: T) => {
    setWidth(node.getBoundingClientRect().width);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    measure(node);

    if (typeof ResizeObserver === "undefined") {
      const onResize = () => measure(node);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const next =
          entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
        setWidth((prev) => (Math.abs(prev - next) > 0.5 ? next : prev));
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [measure]);

  return { ref, width };
}
