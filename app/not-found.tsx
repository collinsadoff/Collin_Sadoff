import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Not Found",
  robots: { index: false, follow: false },
};

/** Custom 404. Static export writes this to out/404.html. */
export default function NotFound() {
  return (
    <>
      <main
        id="main"
        className="mx-auto flex min-h-[80dvh] max-w-[1800px] flex-col justify-center px-5 py-24 sm:px-8 lg:px-12"
      >
        <p className="label mb-5">Error 404</p>
        <h1 className="display-xl text-[clamp(3rem,14vw,10rem)] text-chalk">
          Off the
          <br />
          timeline
        </h1>
        <p className="mt-6 max-w-md text-lg text-fog">
          That page does not exist. The work, the resume, and everything else
          are one click away.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            prefetch={false}
            href="/"
            className="border border-chalk bg-chalk px-5 py-3 text-[12px] font-medium tracking-[0.14em] text-ink uppercase transition-colors hover:bg-transparent hover:text-chalk"
          >
            Back Home
          </Link>
          <Link
            prefetch={false}
            href="/resume"
            className="border border-line-2 px-5 py-3 text-[12px] font-medium tracking-[0.14em] text-chalk uppercase transition-colors hover:border-chalk"
          >
            View Resume
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
