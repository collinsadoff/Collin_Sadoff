"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "@/content/profile";
import { navSections } from "@/lib/sections";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Sticky global nav. Transparent over the hero, then blurs and picks up a
 * hairline once the page scrolls. On small screens the links collapse into a
 * full-screen overlay menu with a focus trap and scroll lock.
 */
export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  const panelRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  // Anchors only resolve on the homepage; from /resume they need a full path.
  const href = useCallback(
    (id: string) => (isHome ? `#${id}` : `/#${id}`),
    [isHome],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the overlay when the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Scroll lock + Escape + focus trap while the overlay is open.
  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Move focus into the panel so keyboard users start inside it.
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-none focus:bg-chalk focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
      >
        Skip to content
      </a>

      <header
        className={`no-print fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open
            ? "border-b border-line bg-ink/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-[1800px] items-center justify-between px-5 sm:h-20 sm:px-8 lg:px-12"
        >
          {/* prefetch is off on every internal Link in this app: with two
              static pages it saves nothing, and Next 16's static export writes
              the nested route's prefetch payload to a path the client does not
              request, which would log a 404 on every page view. */}
          <Link
            prefetch={false}
            href="/"
            className="font-display text-sm font-extrabold tracking-[0.18em] text-chalk uppercase sm:text-base"
          >
            {profile.name}
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            <ul className="flex items-center gap-7">
              {navSections.map((section) => (
                <li key={section.id}>
                  <a
                    href={href(section.id)}
                    className="text-[13px] font-medium tracking-wide text-fog uppercase transition-colors hover:text-chalk"
                  >
                    {section.nav}
                  </a>
                </li>
              ))}
            </ul>
            <Link
              prefetch={false}
              href="/resume"
              className="border border-line-2 px-4 py-2 text-[12px] font-medium tracking-[0.14em] text-chalk uppercase transition-colors hover:border-chalk hover:bg-chalk hover:text-ink"
            >
              View Resume
            </Link>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="relative z-50 flex h-10 w-10 items-center justify-center lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="flex w-6 flex-col gap-[5px]">
              <span
                className={`h-px w-full bg-chalk transition-transform duration-300 ${
                  open ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-full bg-chalk transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-px w-full bg-chalk transition-transform duration-300 ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="no-print fixed inset-0 z-40 flex flex-col justify-center bg-ink px-6 lg:hidden"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="flex flex-col gap-1">
              {navSections.map((section, index) => (
                <motion.li
                  key={section.id}
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: reduced ? 0 : 0.04 * index,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <a
                    href={href(section.id)}
                    onClick={() => setOpen(false)}
                    className="display-xl block py-2 text-[clamp(2rem,10vw,3.5rem)] text-chalk"
                  >
                    {section.nav}
                  </a>
                </motion.li>
              ))}
            </ul>

            <Link
              prefetch={false}
              href="/resume"
              onClick={() => setOpen(false)}
              className="mt-10 inline-block w-fit border border-line-2 px-6 py-3 text-[12px] font-medium tracking-[0.14em] text-chalk uppercase"
            >
              View Resume
            </Link>

            <p className="label mt-10">{profile.location}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
