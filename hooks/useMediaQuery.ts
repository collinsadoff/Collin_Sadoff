"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe media query. Returns `false` on the server and on the first client
 * render, then the real value - so markup matches on hydration.
 *
 * Used for the grid's responsive target row height and for the
 * hover-vs-in-view preview behaviour.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const list = window.matchMedia(query);
    setMatches(list.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True on devices whose primary input can hover - i.e. real mouse pointers. */
export function useHasHover(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
