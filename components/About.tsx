import { profile } from "@/content/profile";
import { headshot } from "@/content/media";
import { HeadshotPlaceholder } from "@/components/Placeholder";
import { Reveal } from "@/components/Reveal";

/** Two-column about: 4:5 grayscale portrait and the first-person bio. */
export function About() {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <Reveal className="lg:col-span-5">
        <figure className="relative w-full max-w-sm overflow-hidden bg-ink-2 [aspect-ratio:4/5] lg:max-w-none">
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

          {/*
            Name tag. The pronunciation is the point of it: "Sadoff" is the
            kind of surname people skip over rather than risk saying wrong,
            and a hiring manager about to pick up the phone benefits from
            being told. aria-hidden on the phonetic span keeps a screen
            reader from reading the respelling out as if it were a word.
          */}
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
            <span className="flex flex-col items-center gap-0.5 rounded-full border border-white/15 bg-ink/70 px-4 py-2 backdrop-blur-md sm:px-5">
              <span className="font-display text-sm font-bold tracking-[0.12em] text-chalk uppercase sm:text-base">
                {profile.name}
              </span>
              {profile.pronunciation ? (
                <span className="label text-[10px] text-fog" aria-hidden="true">
                  {profile.pronunciation}
                </span>
              ) : null}
            </span>
          </figcaption>
        </figure>
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
