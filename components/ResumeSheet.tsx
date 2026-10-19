import type { ResumeData } from "@/lib/resumeData";

/**
 * The on-screen resume: a white US Letter sheet (8.5 x 11) on the dark site
 * background, aiming for one page.
 *
 * Deliberately plain and ATS-friendly: real headings in document order, no
 * columns in the experience section, no icons standing in for words, no text
 * baked into images. Everything here is selectable text.
 *
 * @media print (in globals.css) strips the shadow, margin and max-width via
 * .print-sheet so printing this page outputs the sheet alone.
 */
export function ResumeSheet({ data }: { data: ResumeData }) {
  return (
    <article
      className="print-sheet mx-auto w-full max-w-[8.5in] bg-white px-[0.7in] py-[0.5in] text-black shadow-[0_8px_60px_rgba(0,0,0,0.5)] sm:min-h-[11in]"
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      {/* Header */}
      <header className="border-b border-black/20 pb-2.5">
        <h1
          className="text-[26pt] leading-none font-extrabold tracking-[-0.02em] uppercase"
          style={{ fontFamily: "var(--font-archivo), sans-serif" }}
        >
          {data.name}
        </h1>
        <p className="mt-1.5 text-[11.5pt] font-semibold tracking-[0.02em] text-black/80">
          {data.title}
        </p>
        <p className="mt-2 text-[9pt] leading-relaxed text-black/70">
          {data.contact.join("  ·  ")}
        </p>
      </header>

      {/* Summary */}
      <ResumeSection title="Summary">
        <p className="text-[9pt] leading-[1.4] text-black/85">
          {data.summary}
        </p>
      </ResumeSection>

      {/* Experience */}
      <ResumeSection title="Experience">
        <div className="space-y-2">
          {data.roles.map((role) => (
            <div key={role.company} className="print-block">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="text-[10.5pt] font-bold">
                  {role.company}
                  <span className="font-normal text-black/70">
                    {" "}
                    &mdash; {role.role}
                  </span>
                </h3>
                <span className="text-[9pt] text-black/60">
                  {role.dates}
                  {role.location ? ` · ${role.location}` : ""}
                </span>
              </div>

              {role.bullets.length ? (
                <ul className="mt-1 space-y-[2px]">
                  {role.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="grid grid-cols-[0.6rem_1fr] text-[9pt] leading-[1.32] text-black/85"
                    >
                      <span aria-hidden="true">&bull;</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </ResumeSection>

      {/* Skills */}
      <ResumeSection title="Skills">
        <dl className="space-y-1">
          {data.skills.map((line) => (
            <div key={line.label} className="text-[9pt] leading-[1.32]">
              <dt className="inline font-bold">{line.label}: </dt>
              <dd className="inline text-black/85">{line.value}</dd>
            </div>
          ))}
        </dl>
      </ResumeSection>

      {/* Clients */}
      <ResumeSection title="Selected Clients">
        <p className="text-[9pt] leading-[1.38] text-black/85">
          {data.clients}
        </p>
      </ResumeSection>

      {/* Education */}
      <ResumeSection title="Education">
        {data.education.map((item) => (
          <div key={item.line} className="text-[9pt] leading-[1.38]">
            <p className="font-bold">{item.line}</p>
            <p className="text-black/75">{item.detail}</p>
          </div>
        ))}
      </ResumeSection>

      {/* Portfolio */}
      <ResumeSection title="Portfolio">
        <p className="text-[9pt] text-black/85">{data.portfolio}</p>
      </ResumeSection>
    </article>
  );
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-3">
      <h2
        className="mb-1 border-b border-black/15 pb-1 text-[8.5pt] font-bold tracking-[0.16em] uppercase"
        style={{ fontFamily: "var(--font-archivo), sans-serif" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
