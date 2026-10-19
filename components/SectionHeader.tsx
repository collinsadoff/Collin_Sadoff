import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { timecodeFor } from "@/lib/sections";

/**
 * The shared section header: a timecode-styled section number above a big
 * uppercase heading, with an optional supporting line.
 *
 * The timecode is decorative typography, not content, so it is hidden from
 * assistive tech - the heading alone carries the meaning.
 */
export function SectionHeader({
  id,
  label,
  line,
  children,
}: {
  id: string;
  label: string;
  line?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Reveal as="header" className="mb-10 sm:mb-14">
      <div className="flex items-center gap-4">
        <span className="label text-fog-2" aria-hidden="true">
          {timecodeFor(id)}
        </span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
      </div>

      <h2 className="display-xl mt-5 text-[clamp(2.25rem,7vw,4.5rem)] text-chalk">
        {label}
      </h2>

      {line ? (
        <p className="mt-4 max-w-2xl text-base text-fog sm:text-lg">{line}</p>
      ) : null}

      {children}
    </Reveal>
  );
}
