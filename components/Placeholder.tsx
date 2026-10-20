/**
 * Generated placeholder media. Everything here is drawn in CSS/SVG - no
 * external images, no network request, no stock photography. Each one renders
 * wherever a content file still has an empty media path, so the layout is
 * exactly the size it will be once real media is dropped in.
 */

type PlaceholderProps = {
  /** Monospace caption, e.g. "16:9 - PLACEHOLDER". */
  label?: string;
  /** Slightly lighter/darker variants so adjacent tiles aren't identical. */
  tone?: 0 | 1 | 2 | 3;
  className?: string;
};

const TONES = ["#161616", "#1b1b1b", "#131313", "#1f1f1f"] as const;

/**
 * A neutral gray block with faint frame lines and an optional centered
 * monospace label. Fills its parent, so the parent owns the aspect ratio.
 */
export function MediaPlaceholder({
  label,
  tone = 0,
  className = "",
}: PlaceholderProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ backgroundColor: TONES[tone] }}
    >
      {/* Faint diagonal hatch so a gray block still reads as "no media yet". */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 10px)",
        }}
      />
      {/* Frame lines - the crop-mark detail, kept very quiet. */}
      <div className="absolute inset-3 border border-white/[0.06]" />
      {label ? (
        <span className="label absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-white/55">
          {label}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Portrait placeholder for the About headshot: a soft grayscale gradient with
 * an abstract figure, so the column has real visual weight before the real
 * photo lands.
 */
export function HeadshotPlaceholder({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      role="img"
      aria-label="Headshot placeholder"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="hs-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f1f1f" />
          <stop offset="100%" stopColor="#101010" />
        </linearGradient>
        <linearGradient id="hs-fig" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="100%" stopColor="#262626" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#hs-bg)" />
      <circle cx="200" cy="195" r="68" fill="url(#hs-fig)" />
      <path
        d="M200 282c-73 0-126 44-136 108-2 12 0 110 0 110h272s2-98 0-110c-10-64-63-108-136-108z"
        fill="url(#hs-fig)"
      />
      <rect
        x="14"
        y="14"
        width="372"
        height="472"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.07"
      />
      <text
        x="200"
        y="468"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="13"
        letterSpacing="2.4"
        fill="#ffffff"
        fillOpacity="0.3"
      >
        HEADSHOT 4:5
      </text>
    </svg>
  );
}

/**
 * The hero showreel placeholder: a dark field with a faint moving-image feel
 * (frame lines + a timecode strip) sized 16:9 by its parent.
 */
export function ReelPlaceholder({
  className = "",
  aspectLabel = "16:9",
}: {
  className?: string;
  aspectLabel?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden bg-ink-2 ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 15%, #232323 0%, #0e0e0e 60%, #090909 100%)",
        }}
      />
      {/* Academy-leader style frame lines. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-px w-full bg-white/[0.05]" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-full w-px bg-white/[0.05]" />
      </div>
      <div className="absolute inset-6 border border-white/[0.06] sm:inset-10" />
      <span className="label absolute bottom-5 left-5 text-white/45">
        SHOWREEL &mdash; PLACEHOLDER
      </span>
      <span className="label absolute right-5 bottom-5 text-white/45">
        {aspectLabel}
      </span>
    </div>
  );
}

/**
 * The LOG / GRADED placeholder pair for the color section. `graded` swaps the
 * flat, washed-out log look for a contrasty, cooler final-grade look so the
 * slider demonstrates itself with no media.
 */
export function ColorPlaceholder({
  graded,
  className = "",
}: {
  graded: boolean;
  className?: string;
}) {
  const id = graded ? "grade-after" : "grade-before";
  return (
    <svg
      viewBox="0 0 1600 900"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          {graded ? (
            <>
              <stop offset="0%" stopColor="#dcdcdc" />
              <stop offset="100%" stopColor="#8c8c8c" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#8e8e8e" />
              <stop offset="100%" stopColor="#787878" />
            </>
          )}
        </linearGradient>
        <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
          {graded ? (
            <>
              <stop offset="0%" stopColor="#4a4a4a" />
              <stop offset="100%" stopColor="#0d0d0d" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#6e6e6e" />
              <stop offset="100%" stopColor="#5a5a5a" />
            </>
          )}
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${id}-sky)`} />
      <rect y="520" width="1600" height="380" fill={`url(#${id}-ground)`} />
      {/* A skyline so the two sides have identifiable shared content. */}
      <g fill={graded ? "#1a1a1a" : "#656565"}>
        <rect x="120" y="330" width="170" height="200" />
        <rect x="320" y="400" width="130" height="130" />
        <rect x="490" y="270" width="200" height="260" />
        <rect x="730" y="370" width="150" height="160" />
        <rect x="920" y="300" width="180" height="230" />
        <rect x="1140" y="420" width="140" height="110" />
        <rect x="1320" y="350" width="170" height="180" />
      </g>
      <circle
        cx="1180"
        cy="200"
        r={graded ? 62 : 58}
        fill={graded ? "#ffffff" : "#9a9a9a"}
        opacity={graded ? 0.9 : 0.5}
      />
    </svg>
  );
}
