"use client";

import type { Project } from "@/content/projects";
import { aspectLabel } from "@/content/projects";
import { LightboxShell } from "@/components/LightboxShell";
import { VideoPlayer } from "@/components/VideoPlayer";
import { CloseButton } from "@/components/CloseButton";

/**
 * The project player. The video box is sized to the project's OWN aspect
 * ratio and clamped so a 9:16 vertical never runs off the top and bottom of
 * the screen, while a 2.39:1 still fills the width.
 *
 * Prev/next walk the CURRENTLY FILTERED list, so navigating inside a
 * filtered view stays inside that view.
 */
export function Lightbox({
  projects,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  projects: Project[];
  /** -1 when nothing is open. */
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const project = index >= 0 ? projects[index] : undefined;
  const multiple = projects.length > 1;

  return (
    <LightboxShell
      open={Boolean(project)}
      onClose={onClose}
      onPrev={multiple ? onPrev : undefined}
      onNext={multiple ? onNext : undefined}
      label={project ? `${project.client} ${project.title}` : "Project"}
    >
      {project ? (
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex shrink-0 items-start justify-between gap-4 px-5 py-4 sm:px-8">
            <div className="min-w-0">
              <p className="font-display text-sm font-bold tracking-[0.12em] text-chalk uppercase sm:text-lg">
                {project.client} | {project.title}
              </p>
              <p className="label mt-1.5">
                {[
                  project.year,
                  aspectLabel(project.aspectRatio),
                  project.categories.join(" / "),
                ]
                  .filter(Boolean)
                  .join("  -  ")}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {multiple ? (
                <>
                  <NavButton direction="prev" onClick={onPrev} />
                  <span className="label hidden tabular-nums sm:inline">
                    {index + 1} / {projects.length}
                  </span>
                  <NavButton direction="next" onClick={onNext} />
                </>
              ) : null}
              <CloseButton onClose={onClose} />
            </div>
          </div>

          {/* Player, sized to the project's aspect ratio. */}
          <div className="flex min-h-0 flex-1 items-center justify-center px-5 sm:px-8">
            <div
              key={project.id}
              className="relative w-full bg-black"
              style={{
                aspectRatio: project.aspectRatio,
                // Never taller than the space left over for the player.
                maxWidth: `calc((100vh - 18rem) * ${project.aspectRatio})`,
              }}
            >
              <VideoPlayer
                source={project.video}
                title={`${project.client} - ${project.title}`}
                poster={project.poster || undefined}
                placeholderLabel={`${aspectLabel(project.aspectRatio)} - NO VIDEO SOURCE YET`}
              />
            </div>
          </div>

          {/* Metadata */}
          <div className="shrink-0 px-5 py-6 sm:px-8">
            <div className="mx-auto grid max-w-5xl gap-5 border-t border-line pt-5 sm:grid-cols-3">
              {project.description ? (
                <p className="text-sm leading-relaxed text-fog sm:col-span-3 md:col-span-1">
                  {project.description}
                </p>
              ) : null}

              <MetaBlock title="Role" items={project.role} />
              {project.tools?.length ? (
                <MetaBlock title="Tools" items={project.tools} />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </LightboxShell>
  );
}

function MetaBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="label mb-2">{title}</p>
      <ul className="flex flex-wrap gap-x-2 gap-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="border border-line-2 px-2 py-1 text-[11px] tracking-wide text-chalk uppercase"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function NavButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const prev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center border border-line-2 text-chalk transition-colors hover:border-chalk hover:bg-chalk hover:text-ink"
    >
      <span className="sr-only">{prev ? "Previous project" : "Next project"}</span>
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d={prev ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}
