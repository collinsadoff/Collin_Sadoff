"use client";

import { showreel } from "@/content/media";
import { profile } from "@/content/profile";
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
        <div
          className="relative w-full max-w-[min(100%,calc((100vh-12rem)*16/9))] bg-black [aspect-ratio:16/9]"
        >
          <VideoPlayer
            source={showreel.full}
            title={`${profile.name} showreel`}
            poster={showreel.poster || undefined}
            placeholderLabel="SHOWREEL - NO SOURCE YET"
          />
        </div>
      </div>
    </LightboxShell>
  );
}
