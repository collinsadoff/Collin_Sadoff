import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { About } from "@/components/About";
import { Process } from "@/components/Process";
import { Timeline } from "@/components/Timeline";
import { SkillsGrid } from "@/components/SkillsGrid";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import type { ReactNode } from "react";

/** Shared section wrapper: consistent gutters, rhythm and max width. */
function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section
      id={id}
      className="mx-auto max-w-[1800px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      {children}
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Nav />

      <main id="main">
        <Hero />

        <Section id="work">
          <SectionHeader
            id="work"
            label="Work"
            line="Commercial, social, and event work across East Tennessee and beyond. Click any tile to play."
          />
          <PortfolioGrid />
        </Section>

        <Section id="about">
          <SectionHeader id="about" label="About" />
          <About />
        </Section>

        <Section id="process">
          <SectionHeader
            id="process"
            label="How I Work"
            line="The pipeline I run, whether it is my own project or a team's."
          />
          <Process />
        </Section>

        <Section id="experience">
          <SectionHeader id="experience" label="Experience" />
          <Timeline />
        </Section>

        <Section id="skills">
          <SectionHeader id="skills" label="Skills & Tools" />
          <SkillsGrid />
        </Section>

        <Section id="contact">
          <SectionHeader id="contact" label="Contact" />
          <Contact />
        </Section>
      </main>

      <Footer />
    </>
  );
}
