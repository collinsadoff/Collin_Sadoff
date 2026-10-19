import { experience, publishedBullets } from "@/content/experience";
import { Reveal } from "@/components/Reveal";

/**
 * Vertical experience timeline, newest first.
 *
 * Bullets marked `todo` in content/experience.ts are filtered out here, so an
 * unfinished placeholder never reaches the page.
 */
export function Timeline() {
  return (
    <ol className="relative">
      {/* The spine. Decorative, so hidden from assistive tech. */}
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[5px] hidden w-px bg-line sm:block"
      />

      {experience.map((job, index) => {
        const bullets = publishedBullets(job);
        return (
          <Reveal
            as="li"
            key={job.id}
            delay={Math.min(index * 0.06, 0.2)}
            className="relative pb-12 last:pb-0 sm:pl-10"
          >
            <span
              aria-hidden="true"
              className="absolute top-2 left-0 hidden h-[11px] w-[11px] rounded-full border border-fog-2 bg-ink sm:block"
            />

            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <h3 className="font-display text-xl font-bold tracking-[0.04em] text-chalk uppercase sm:text-2xl">
                {job.company}
              </h3>
              <span className="label shrink-0 tabular-nums">{job.dates}</span>
            </div>

            <p className="mt-1 text-base text-fog">
              {job.role}
              {job.location ? (
                <span className="text-fog-2"> / {job.location}</span>
              ) : null}
            </p>

            {bullets.length ? (
              <ul className="mt-5 space-y-3">
                {bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="grid max-w-3xl grid-cols-[auto_1fr] gap-3 text-sm leading-relaxed text-fog sm:text-base"
                  >
                    <span aria-hidden="true" className="pt-2.5 text-fog-2">
                      <span className="block h-px w-3 bg-current" />
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </Reveal>
        );
      })}
    </ol>
  );
}
