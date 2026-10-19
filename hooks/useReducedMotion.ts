"use client";

import { useEffect, useState } from "react";

/**
 * Live prefers-reduced-motion. Starts false so server and first client render
 * agree, then updates on mount and whenever the OS setting changes mid-session.
 *
 * Every animated component in this app reads this and renders the final,
 * at-rest state instead of animating when it is true.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
