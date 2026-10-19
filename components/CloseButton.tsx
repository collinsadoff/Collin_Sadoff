"use client";

/** The X used by every overlay. Square hit area, visible focus ring. */
export function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="flex h-10 w-10 shrink-0 items-center justify-center border border-line-2 text-chalk transition-colors hover:border-chalk hover:bg-chalk hover:text-ink"
    >
      <span className="sr-only">Close</span>
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M5 5l14 14M19 5L5 19" />
      </svg>
    </button>
  );
}
