# Collin Sadoff — Portfolio & Resume

A static portfolio site built with Next.js (App Router), TypeScript and Tailwind CSS, exported as plain HTML/CSS/JS and deployed on Netlify.

Everything you will normally want to change lives in **`/content`**. You should almost never need to open a component.

```bash
npm install     # once
npm run dev     # http://localhost:3000
npm run build   # static export into ./out
```

---

## 1. Where everything lives

```
app/                    Routes and page-level metadata
  layout.tsx            Fonts, SEO defaults, JSON-LD Person schema
  page.tsx              The homepage — the order of the sections
  resume/page.tsx       /resume
  not-found.tsx         404
  opengraph-image.tsx   Generated 1200x630 social card
  apple-icon.tsx        Generated 180x180 app icon
  icon.svg              "CS" monogram favicon
  globals.css           Theme colors, type, print stylesheet
  sitemap.ts robots.ts  Generated at build time

content/                >>> EDIT THESE <<<
  profile.ts            Name, title, tagline, bio, contact details
  projects.ts           The portfolio videos
  color.ts              Before/after grade comparisons
  process.ts            "How I Work" steps, Running Post, AI note
  experience.ts         Job history (timeline + resume)
  skills.ts             Skill groups, software, gear
  clients.ts            Client names
  education.ts          Degree
  media.ts              Showreel + headshot file paths

components/             UI. Each file does one thing.
hooks/                  Justified layout, resize, in-view, media queries
lib/                    Section registry, video URL builders, resume data
scripts/
  make-preview.mjs      Master video -> web-ready loop + poster (needs ffmpeg)
  prepare-uploads.mjs   Rename + compress finished films for hosting
  upload-names.json     The rename map prepare-uploads.mjs reads
public/                 >>> DROP YOUR MEDIA HERE <<<
```

The homepage, the `/resume` page and the downloadable PDF **all read from the same `/content` files**. Change a bullet once and it updates in all three.

---

## 2. What is placeholder vs. final

| Thing | Status |
|---|---|
| All written copy (bio, summary, process, experience, skills, clients) | **Final** — your words, edit freely |
| 14 portfolio projects | **Placeholder** — real client names, invented project titles and descriptions |
| All video, posters, preview loops | **Placeholder** — generated gray tiles |
| Showreel | **Placeholder** |
| 3 color before/after pairs | **Placeholder** — generated LOG/GRADED illustrations |
| Headshot | **Placeholder** — generated 4:5 figure |
| OG social card, favicon, app icon | **Placeholder** — generated from your name, usable as-is |
| Haven Media bullets | **Placeholder** — marked `todo: true`, hidden from the live site and PDF until you write them |
| Education year | **Blank** — add it in `content/education.ts` |

Anywhere a media path is `""`, the site renders a generated gray placeholder at exactly the right size. Fill the path in and the real media takes its place with no layout shift.

---

## 3. How to add a project

Open `content/projects.ts` and copy an entry:

```ts
{
  id: "client-project",              // unique slug
  title: "Brand Film",               // shown after the pipe
  client: "Client Name",             // shown before the pipe
  categories: ["Construction"],      // one or more; shown on hover + lightbox
  aspectRatio: 16 / 9,               // MUST match the real media
  poster: "/work/client-poster.jpg", // still frame
  preview: "/work/client-loop.mp4",  // optional hover loop
  video: { type: "bunny", src: "12345/abcd-efgh" },
  year: "2025",
  role: ["Shot", "Edited", "Color", "Sound"],
  tools: ["DaVinci Resolve"],
  description: "One to three sentences.",
}
```

**Fields that matter most**

- **`aspectRatio`** is a number, written as a division so it stays readable: `16/9`, `9/16`, `1`, `4/5`, `2.39`. The justified grid sizes every tile from this, so a wrong value makes the row look off. Vertical videos are expected and sit naturally beside horizontal ones.
- **`categories`** must come from this list, exactly: `Real Estate`, `Construction`, `Events`, `Public Figures`, `Fitness`, `Medical`. A project can be in several. They are context, not navigation: there is no category filter, so these only appear on tile hover and in the lightbox.
- **`video.type`** picks the player:

  | type | what `src` holds | example |
  |---|---|---|
  | `vimeo` | video id | `"76979871"` |
  | `youtube` | video id | `"dQw4w9WgXcQ"` |
  | `bunny` | `libraryId/videoId` | `"12345/abcd-efgh"` |
  | `mux` | playback id | `"a1b2c3d4"` |
  | `cloudflare` | `customerCode/videoUid` | `"f3x1/9e8d7c"` |
  | `mp4` | full URL | `"https://storage.googleapis.com/.../film.mp4"` |

  A full URL pasted from the provider also works for the iframe types — it is used as-is.

Grid order is array order, so put your strongest work at the top.

**To add a category** (say, "Nonprofit"): add it to the `CATEGORIES` array at the top of `content/projects.ts`, and the type follows from that one line.

---

## 4. Where to drop your real media

Create these folders under `public/` and reference them with a leading slash (`/work/...`):

| What | Put it in | Set it in |
|---|---|---|
| Showreel loop + poster | `public/media/` | `content/media.ts` → `showreel.loop`, `.loopWebm`, `.poster` |
| Showreel **shape** | — | `content/media.ts` → `showreel.aspectRatio` (see below) |
| Full showreel | hosted (Bunny/Vimeo/Mux) | `content/media.ts` → `showreel.full` |
| Project posters | `public/work/` | `poster` on each project |
| Project preview loops | `public/work/` | `preview` on each project |
| Full project videos | hosted | `video` on each project |
| Color before/after frames | `public/color/` | `content/color.ts` → `before`, `after` |
| Headshot | `public/media/` | `content/media.ts` → `headshot.src` |
| Social card (optional) | `app/opengraph-image.png` | delete `app/opengraph-image.tsx` and Next uses the file |

### Vertical vs. wide showreel

`showreel.aspectRatio` in `content/media.ts` is one number that changes the whole hero layout:

- **`9 / 16`** (the current setting) — vertical-first. The reel stands beside your name, sized to the viewport height and flush to the right margin. This is the right choice when most of your finished work is social/Instagram: on a near-black page with no frame around the video, a vertical reel reads as a column of image rather than as a widescreen video with bars either side. It also keeps your name and the reel on screen together, which a full-width 16:9 band can't do.
- **`16 / 9`** — the classic full-width band across the top with the name block underneath.
- **`1`** — square, uses the vertical layout.

Change the number, nothing else. The hero, the placeholder label and the lightbox all follow it.

**If you want a wide reel out of vertical footage**, don't crop — recut. The generic fix (one vertical centred on a blurred copy of itself) looks like an apology for the format. A triptych, where two or three verticals live in frame at once and cut on beat, reads as a deliberate choice and doubles as a craft demo. Worth having regardless, since plenty of employers still ask for "your reel" and expect a 16:9 file.

### Recommended specs

**Preview loops (the hover previews in the grid)**
- 5–8 seconds, seamless loop
- 720p or smaller — they display at roughly 380px tall
- H.264 MP4, plus an optional WebM for smaller files
- **No audio track at all** (not just muted — strip it; it saves bandwidth and avoids autoplay blocks)
- Target 1–3 MB each. These load on scroll, so size discipline is what keeps the grid fast.

**Posters**
- WebP or JPG, around 1600px on the long edge
- Export from the same frame the loop starts on, so there is no visible jump on hover

**Showreel background loop**
- 10–30 seconds, no audio, 1080p max, 3–6 MB
- The full reel with sound is hosted, not in `public/`

**Color frames**
- Matched stills from the *same frame of the same shot* — one ungraded/log, one final
- Same resolution, ~1600px wide, WebP or JPG

**Full videos — host them, don't put them in `public/`**
- **Bunny Stream, Mux, or Cloudflare Stream** are the recommendations: all three do adaptive streaming, so viewers on a weak connection get a lower bitrate instead of a buffering spinner.
- **Vimeo** works the same way and is the easiest if you already have a Pro account.
- **Direct MP4 from Google Cloud Storage** is supported and works fine, but it does *not* adapt to connection speed — everyone downloads the same file. Use it for short pieces, not a 4-minute brand film.
- Whichever you pick, keep the files out of this repo. Netlify is not a video host.

### Keep masters out of the project folder

Raw footage and full-quality renders must never be committed. GitHub rejects any single file over 100MB and caps repositories around 5GB, so a folder of masters will fail the push outright — and because this repo is public, anything that *does* land there is permanently in the history.

`.gitignore` already excludes `Vids/`, and `.mp4` / `.mov` / `.braw` / `.r3d` anywhere outside `public/` (web-ready loops under `public/` are small and *are* committed). Tailwind's class scanner is told to skip those folders too: it reads every file in the project to find class names, and a multi-gigabyte video — or one still being written by an export — will slow the dev server down or crash it with a file-lock error.

The safe workflow:

1. Keep masters **outside** this project folder entirely — a separate drive or folder.
2. Compress a short preview loop (5–8s, ≤720p, no audio, 1–3MB) into `public/work/` — `scripts/make-preview.mjs` does this, see below.
3. Upload the full video to Bunny/Vimeo/Mux/Cloudflare and reference the id in `content/projects.ts`.

### Making preview loops: `scripts/make-preview.mjs`

Turns a master into the two files a tile needs — a short muted loop and a matching poster — at the right size and settings. Needs [ffmpeg](https://ffmpeg.org/download.html) on your PATH (`winget install Gyan.FFmpeg` on Windows).

```bash
node scripts/make-preview.mjs --list
```

```bash
node scripts/make-preview.mjs "Vids/Clean Eatz.mp4"
```

That writes `public/work/clean-eatz.mp4` (~400KB) and `public/work/clean-eatz.webp`, then prints a ready-to-paste `content/projects.ts` entry with `aspectRatio` already filled in from the real dimensions — so the grid matches the media instead of you guessing.

**The flag you'll actually use is `--start`.** By default it grabs 6 seconds from 25% into the clip, which usually clears titles and black but won't always be your best 6 seconds:

```bash
node scripts/make-preview.mjs "Vids/Clean Eatz.mp4" --start 00:00:14 --duration 6 --force
```

Other flags: `--all` (everything in `Vids/`), `--out`, `--max` (long-edge cap, default 720), `--crf` (quality — raise to 28–30 for smaller files), `--webm` (also emit VP9, usually ~30% smaller), `--jpg` (poster as JPG instead of WebP), `--name`, `--jobs`, `--force`.

What it does for you, so you don't have to remember it:

- strips the audio track entirely rather than just muting it — saves bandwidth and avoids autoplay blocking
- caps the long edge at 720px, since a tile is only ~380px tall even on the widest layout
- `+faststart`, so playback can begin before the file finishes downloading
- pulls the poster from the **same frame the loop starts on**, so hovering a tile doesn't visibly jump

It won't pick a seamless loop point for you — that's an editorial call. If a loop pops on repeat, move `--start` or trim `--duration` until the first and last frames sit closer together.

### Preparing full films for hosting: `scripts/prepare-uploads.mjs`

The other half of the job. `make-preview.mjs` builds the short loop that lives in `public/`; this one builds the **full film** you upload to Google Cloud Storage, Bunny, Vimeo or wherever — renamed, compressed, and never touching your originals.

```bash
node scripts/prepare-uploads.mjs --dry-run
```

```bash
node scripts/prepare-uploads.mjs
```

Reads `scripts/upload-names.json`, which maps each source filename to the name you want, and writes compressed copies into `Vids/Upload Ready/` plus a `MANIFEST.md` recording old → new. Source files are only ever read.

Names in that map are lowercase with hyphens and no spaces, parentheses or apostrophes, because they become public URLs — anything else has to be percent-encoded and looks broken when shared.

Each entry carries a `sure` flag. `false` means the name came from looking at sample frames rather than from evidence, and should be checked before publishing. Edit the JSON and re-run with `--force` to rebuild.

Settings: H.264 CRF 23, long edge capped at 1920 so vertical stays a true 1080×1920, `+faststart`, and **audio kept** at AAC 128k. That last one is the deliberate difference from the preview loops, which strip audio entirely — these are the full pieces and the mix is part of the work.

Flags: `--in`, `--out`, `--map`, `--crf` (raise to 26 to roughly halve file size), `--preset`, `--max`, `--jobs`, `--dry-run`, `--force`.

---

## 5. Deploying to Netlify

**First deploy**

1. Push this folder to a GitHub repository.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Netlify reads `netlify.toml`, so the build command (`npm run build`) and publish directory (`out`) are already set. Don't override them.
4. Deploy. You get a `random-name.netlify.app` URL.

**Connecting collinsadoff.com**

1. Netlify → **Domain management → Add a domain** → `collinsadoff.com`.
2. Easiest path: point your registrar's nameservers at Netlify DNS (Netlify shows you the four to use). DNS changes take anywhere from minutes to a day.
3. Prefer to keep DNS at your registrar? Add an `A` record for `@` pointing to Netlify's load balancer IP and a `CNAME` for `www` pointing to your `.netlify.app` subdomain — Netlify shows the exact values.
4. Netlify provisions the HTTPS certificate automatically once DNS resolves. Set `collinsadoff.com` as the primary domain so `www` redirects to it.

Nothing in the code needs changing — `content/profile.ts` already has the production URL, which drives `metadataBase`, the sitemap and the JSON-LD.

**Every deploy after that:** push to your main branch. Netlify rebuilds.

---

## 6. The resume

- `/resume` renders a white US Letter sheet on the dark background.
- **Download PDF** builds a real text-based PDF with `@react-pdf/renderer` — selectable, searchable, readable by applicant tracking systems. The library is loaded only when the button is clicked, so it costs nothing on page load.
- **Print** uses a print stylesheet that strips the nav, toolbar and dark background, leaving just the sheet.
- The PDF filename is `Collin-Sadoff-Resume.pdf` (set in `components/ResumeToolbar.tsx`).

The resume is built to fit one page. If you add several bullets it will spill onto a second — trim bullets or tighten `content/profile.ts`'s summary to pull it back.

### Finishing the TODOs

In `content/experience.ts`, the two Haven Media bullets are marked `todo: true`. They are **filtered out everywhere** — homepage timeline, resume page, and PDF — so nothing unfinished is ever published. When you write the real text, delete the `todo: true` line and the bullet goes live.

Also add your graduation year in `content/education.ts` (leave it `""` and the year is simply omitted).

---

## 7. Design notes

- **Color**: black, white and grays only. No accent color anywhere — the work supplies the color. The palette is four grays defined at the top of `app/globals.css`; change them there and the whole site follows.
- **Type**: Archivo for headings, Inter for body, JetBrains Mono for metadata labels. All self-hosted at build time by `next/font`, so there is no external request and no font-swap shift.
- **Motion**: fade-and-rise reveals on scroll, hover states on tiles. Every one of them checks `prefers-reduced-motion` and renders the final state instantly when it is set.
- **Section numbers** are timecode (`01:00:00:00 — WORK`), generated from the section's position in `lib/sections.ts`. Add a section there and it gets its number, its nav link and its anchor automatically.
- **The grid** is a custom justified-rows layout (`hooks/useJustifiedLayout.ts`). Items in a row share one height, widths stay proportional to aspect ratio, and the row fills the container exactly. It measures with `ResizeObserver`, so it reflows on any container change, not just window resizes. Target row heights are 380px desktop / 280px tablet / 200px mobile; the last row holds the target height instead of stretching.
