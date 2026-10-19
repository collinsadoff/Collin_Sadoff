import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { ResumeSheet } from "@/components/ResumeSheet";
import { ResumeToolbar } from "@/components/ResumeToolbar";
import { getResumeData } from "@/lib/resumeData";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume for ${profile.name}, ${profile.title} based in ${profile.location}.`,
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  const data = getResumeData();

  return (
    <>
      <Nav />
      <main id="main" className="px-5 pt-24 pb-20 sm:px-8 sm:pt-28 sm:pb-28">
        <ResumeToolbar data={data} />
        <ResumeSheet data={data} />
      </main>
    </>
  );
}
