import {
  aiNote,
  editorCoaching,
  processSteps,
  runningPost,
  type ProcessBlock,
} from "@/content/process";
import { Reveal } from "@/components/Reveal";

/**
 * How I Work: the numbered post pipeline, then the post-supervision block and
 * the AI note. Step numbers are generated from array position.
 */
export function Process() {
  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
      <ol className="lg:col-span-7">
        {processSteps.map((step, index) => (
          <Reveal
            as="li"
            key={step.title}
            delay={Math.min(index * 0.04, 0.2)}
            className="group relative grid grid-cols-[auto_1fr] gap-5 border-t border-line py-6 sm:gap-8"
          >
            <span className="label pt-1 tabular-nums" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display text-lg font-bold tracking-[0.06em] text-chalk uppercase sm:text-xl">
                {step.title}
              </h3>
              <p className="mt-2 max-w-prose leading-relaxed text-fog">
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>

      <div className="space-y-10 lg:col-span-5">
        <BlockCard block={editorCoaching} />
        <BlockCard block={runningPost} delay={0.06} />

        <Reveal className="border border-line p-6 sm:p-8" delay={0.12}>
          <h3 className="font-display text-lg font-bold tracking-[0.06em] text-chalk uppercase">
            {aiNote.title}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-fog">{aiNote.body}</p>
        </Reveal>
      </div>
    </div>
  );
}

/** A bordered card of dashed bullets. Shared by every ProcessBlock. */
function BlockCard({
  block,
  delay = 0,
}: {
  block: ProcessBlock;
  delay?: number;
}) {
  return (
    <Reveal className="border border-line p-6 sm:p-8" delay={delay}>
      <h3 className="font-display text-lg font-bold tracking-[0.06em] text-chalk uppercase">
        {block.title}
      </h3>
      <ul className="mt-5 space-y-4">
        {block.bullets.map((bullet) => (
          <li
            key={bullet}
            className="grid grid-cols-[auto_1fr] gap-3 text-sm leading-relaxed text-fog"
          >
            <span aria-hidden="true" className="pt-2 text-fog-2">
              <span className="block h-px w-3 bg-current" />
            </span>
            {bullet}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
