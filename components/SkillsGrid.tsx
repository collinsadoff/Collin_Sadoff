import { skillGroups, software } from "@/content/skills";
import { Reveal } from "@/components/Reveal";

/** Grouped skill columns and the software list. No bars, no percentages. */
export function SkillsGrid() {
  return (
    <div className="space-y-14">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {skillGroups.map((group, index) => (
          <Reveal key={group.title} delay={Math.min(index * 0.06, 0.2)}>
            <h3 className="label border-b border-line pb-3 text-fog">
              {group.title}
            </h3>
            <ul className="mt-5 space-y-2.5">
              {group.items.map((item) => (
                <li key={item} className="text-base text-chalk">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <h3 className="label border-b border-line pb-3 text-fog">Software</h3>
        <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {software.map((item) => (
            <li
              key={item.name}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line/60 pb-3"
            >
              <span className="text-base text-chalk">{item.name}</span>
              {item.years ? (
                <span className="label text-fog">{item.years}</span>
              ) : null}
              {item.detail ? (
                <span className="w-full text-sm text-fog-2">{item.detail}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </Reveal>

    </div>
  );
}
