"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { Reveal } from "@/components/Reveal";

/** Contact block: big heading, the three ways to reach you, two CTAs. */
export function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context, permissions): the mailto link
      // beside this button still works, so fail quietly.
    }
  };

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <Reveal className="lg:col-span-7">
        <p className="display-xl text-[clamp(2.25rem,7vw,5rem)] text-chalk">
          Let&rsquo;s make
          <br />
          something good.
        </p>
      </Reveal>

      <Reveal className="lg:col-span-5" delay={0.08}>
        <dl className="space-y-6">
          <div>
            <dt className="label mb-2">Email</dt>
            <dd className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="text-lg text-chalk underline decoration-line-2 underline-offset-4 transition-colors hover:decoration-chalk sm:text-xl"
              >
                {profile.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="border border-line-2 px-2.5 py-1.5 text-[10px] font-medium tracking-[0.14em] text-fog uppercase transition-colors hover:border-chalk hover:text-chalk"
              >
                {copied ? "Copied" : "Copy"}
              </button>
              <span aria-live="polite" className="sr-only">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </dd>
          </div>

          <div>
            <dt className="label mb-2">Phone</dt>
            <dd>
              <a
                href={`tel:${profile.phoneHref}`}
                className="text-lg text-chalk underline decoration-line-2 underline-offset-4 transition-colors hover:decoration-chalk sm:text-xl"
              >
                {profile.phone}
              </a>
            </dd>
          </div>

          <div>
            <dt className="label mb-2">Location</dt>
            <dd className="text-lg text-chalk sm:text-xl">{profile.location}</dd>
          </div>
        </dl>

        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="border border-chalk bg-chalk px-5 py-3 text-[12px] font-medium tracking-[0.14em] text-ink uppercase transition-colors hover:bg-transparent hover:text-chalk"
          >
            Email Me
          </a>
          <Link
            prefetch={false}
            href="/resume"
            className="border border-line-2 px-5 py-3 text-[12px] font-medium tracking-[0.14em] text-chalk uppercase transition-colors hover:border-chalk"
          >
            Download Resume (PDF)
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
