import { profile } from "@/content/profile";
import { headshot } from "@/content/media";
import { HeadshotPlaceholder } from "@/components/Placeholder";
import { Reveal } from "@/components/Reveal";

/** Two-column about: 4:5 grayscale portrait and the first-person bio. */
export function About() {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <Reveal className="lg:col-span-5">
        <div className="relative w-full max-w-sm overflow-hidden bg-ink-2 [aspect-ratio:4/5] lg:max-w-none">
          {headshot.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={headshot.src}
              alt={headshot.alt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover grayscale"
            />
          ) : (
            <HeadshotPlaceholder className="absolute inset-0 h-full w-full" />
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 border border-white/[0.07]"
          />
        </div>
      </Reveal>

      <Reveal className="lg:col-span-7" delay={0.08}>
        <div className="space-y-5">
          {profile.bio.map((paragraph, index) => (
            <p
              key={index}
              className={`leading-relaxed ${
                index === 0
                  ? "text-lg text-chalk sm:text-xl"
                  : "text-base text-fog sm:text-lg"
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <ul className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-6">
          {profile.quickFacts.map((fact, index) => (
            <li key={fact} className="label flex items-center gap-3">
              {index > 0 ? (
                <span aria-hidden="true" className="text-line-2">
                  /
                </span>
              ) : null}
              {fact}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
