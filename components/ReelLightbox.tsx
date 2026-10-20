"use client";

import { showreel } from "@/content/media";
import { profile } from "@/content/profile";
import { aspectLabel } from "@/content/projects";
import { LightboxShell } from "@/components/LightboxShell";
import { VideoPlayer } from "@/components/VideoPlayer";
import { CloseButton } from "@/components/CloseButton";

/** The hero's "Play reel with sound" target: the full reel, 16:9, unmuted. */
export function ReelLightbox({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <LightboxShell open={open} onClose={onClose} label="Showreel">
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold tracking-[0.14em] text-chalk uppercase sm:text-base">
            {profile.name} &mdash; {showreel.title}
          </p>
          {showreel.runtime ? (
            <p className="label mt-1">{showreel.runtime}</p>
          ) : null}
        </div>
        <CloseButton onClose={onClose} />
      </div>

      <div className="flex flex-1 items-center justify-center px-5 pb-8 sm:px-8">
        {/* Sized from the reel's own ratio, so a 9:16 reel fills the height
            instead of being letterboxed into a widescreen box. */}
        <div
          className="relative w-full bg-black"
          style={{
            aspectRatio: showreel.aspectRatio,
            maxWidth: `calc((100vh - 12rem) * ${showreel.aspectRatio})`,
          }}
        >
          <VideoPlayer
            source={showreel.full}
            title={`${profile.name} showreel`}
            poster={showreel.poster || undefined}
            placeholderLabel={`${aspectLabel(showreel.aspectRatio)} - NO SOURCE YET`}
          />
        </div>
      </div>
    </LightboxShell>
  );
}
