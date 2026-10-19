import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

/**
 * Placeholder Open Graph card, generated at build time into the static export
 * (no external image, no design tool round-trip). Black field, white type,
 * same look as the site.
 *
 * To replace it with real artwork later: delete this file and drop a
 * 1200x630 image at app/opengraph-image.png - Next picks it up automatically.
 */
export const dynamic = "force-static";

export const alt = `${profile.name} - ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#737373",
          }}
        >
          {profile.location}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 112,
              fontWeight: 800,
              letterSpacing: -3,
              textTransform: "uppercase",
              color: "#f5f5f5",
              lineHeight: 1,
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 36,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#a3a3a3",
            }}
          >
            {profile.title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #262626",
            paddingTop: 28,
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#737373",
          }}
        >
          <div style={{ display: "flex" }}>{profile.domain}</div>
          <div style={{ display: "flex" }}>Reel / Resume</div>
        </div>
      </div>
    ),
    size,
  );
}
