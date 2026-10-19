"use client";

import Link from "next/link";
import { useState } from "react";
import type { ResumeData } from "@/lib/resumeData";

/**
 * Toolbar above the resume sheet.
 *
 * @react-pdf/renderer is browser-only and large, so it is NOT in the page
 * bundle: the whole module graph is pulled in with a dynamic import() the
 * first time someone clicks Download. That keeps the static export's initial
 * JS small, which is what the Lighthouse performance budget cares about.
 */
export function ResumeToolbar({ data }: { data: ResumeData }) {
  const [state, setState] = useState<"idle" | "working" | "error">("idle");

  const download = async () => {
    setState("working");
    try {
      const [{ pdf }, { ResumePDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/ResumePDF"),
      ]);

      const blob = await pdf(<ResumePDF data={data} />).toBlob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Collin-Sadoff-Resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Release the blob once the browser has started the download.
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setState("idle");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="no-print mx-auto mb-6 flex w-full max-w-[8.5in] flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={download}
        disabled={state === "working"}
        className="border border-chalk bg-chalk px-5 py-3 text-[12px] font-medium tracking-[0.14em] text-ink uppercase transition-colors hover:bg-transparent hover:text-chalk disabled:cursor-wait disabled:opacity-60"
      >
        {state === "working" ? "Generating..." : "Download PDF"}
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        className="border border-line-2 px-5 py-3 text-[12px] font-medium tracking-[0.14em] text-chalk uppercase transition-colors hover:border-chalk"
      >
        Print
      </button>

      <Link
        prefetch={false}
        href="/"
        className="border border-line-2 px-5 py-3 text-[12px] font-medium tracking-[0.14em] text-chalk uppercase transition-colors hover:border-chalk"
      >
        Back to Portfolio
      </Link>

      <p aria-live="polite" className="text-sm text-fog">
        {state === "error"
          ? "Could not generate the PDF. Use Print instead, or try again."
          : ""}
      </p>
    </div>
  );
}
