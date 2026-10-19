"use client";

import { CATEGORIES, countByCategory, type Category } from "@/content/projects";

/**
 * Category filters above the grid. Rendered as a radio group so screen
 * readers announce "3 of 7 selected" rather than seven unrelated buttons.
 */
export function FilterBar({
  active,
  onChange,
}: {
  active: Category | "All";
  onChange: (next: Category | "All") => void;
}) {
  const options: (Category | "All")[] = ["All", ...CATEGORIES];

  return (
    <div
      role="radiogroup"
      aria-label="Filter work by category"
      className="-mx-5 mb-8 flex snap-x gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
    >
      {options.map((option) => {
        const selected = option === active;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            className={`flex shrink-0 snap-start items-center gap-2 border px-3.5 py-2 text-[11px] font-medium tracking-[0.12em] uppercase transition-colors sm:px-4 ${
              selected
                ? "border-chalk bg-chalk text-ink"
                : "border-line-2 text-fog hover:border-fog hover:text-chalk"
            }`}
          >
            {option}
            <span
              className={`font-mono text-[10px] ${
                selected ? "text-ink/70" : "text-fog-2"
              }`}
            >
              {countByCategory(option)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
