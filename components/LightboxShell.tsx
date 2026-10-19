"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * The full-screen overlay used by both the reel player and the project
 * lightbox. It owns the behaviour that is easy to get wrong:
 *
 *   - scroll lock on <body>, restored exactly as it was on close
 *   - Escape to close, and optional arrow-key navigation
 *   - a focus trap, with focus returned to whatever opened it
 *   - backdrop click to close, without swallowing clicks on the content
 */
export function LightboxShell({
  open,
  onClose,
  onPrev,
  onNext,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  /** Accessible name for the dialog. */
  label: string;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;

    // Lock scroll without the page jumping as the scrollbar disappears.
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowLeft" && onPrev) {
        event.preventDefault();
        onPrev();
        return;
      }
      if (event.key === "ArrowRight" && onNext) {
        event.preventDefault();
        onNext();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), iframe, video[controls], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panelRef.current?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      document.removeEventListener("keydown", onKeyDown);
      restoreFocusTo.current?.focus?.();
    };
  }, [open, onClose, onPrev, onNext]);

  // Move focus into the dialog once it has rendered.
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="no-print fixed inset-0 z-[70] flex flex-col bg-ink/97 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onMouseDown={(event) => {
            // Only a press that starts AND ends on the backdrop closes it, so
            // a drag that ends outside the player doesn't dismiss by accident.
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <div ref={panelRef} className="contents">
            {children}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
