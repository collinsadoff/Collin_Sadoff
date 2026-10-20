#!/usr/bin/env node
/**
 * make-preview - turn a full-size master into the two web assets the grid
 * needs: a short muted loop and a matching poster frame.
 *
 * Requires ffmpeg on PATH (ffmpeg.org, or `winget install Gyan.FFmpeg`).
 *
 *   node scripts/make-preview.mjs --list
 *   node scripts/make-preview.mjs "Vids/Clean Eatz.mp4"
 *   node scripts/make-preview.mjs "Vids/Clean Eatz.mp4" --start 00:00:12 --duration 6
 *   node scripts/make-preview.mjs --all
 *
 * Flags
 *   --list              Show every source file with size, resolution, duration.
 *   --all               Process every video in the input folder.
 *   --in <dir>          Source folder (default: Vids)
 *   --out <dir>         Destination (default: public/work)
 *   --start <ts>        Where the loop begins: seconds or HH:MM:SS.
 *                       Default: 25% into the clip, which usually clears
 *                       titles and black.
 *   --duration <s>      Loop length in seconds (default: 6)
 *   --max <px>          Cap on the LONG edge (default: 720)
 *   --crf <n>           Quality, lower is bigger/better (default: 26)
 *   --webm              Also write a VP9 .webm, which browsers prefer when
 *                       they support it and which is usually ~30% smaller.
 *   --jpg               Poster as .jpg instead of .webp.
 *   --name <slug>       Override the output filename.
 *   --jobs <n>          How many files to encode at once (default: 2).
 *   --force             Overwrite outputs that already exist.
 *
 * Why these settings: the loop is decorative and muted, so audio is stripped
 * entirely (not just muted - it saves bandwidth and sidesteps autoplay
 * blocking), the long edge is capped at 720 because a tile is ~380px tall on
 * the largest layout, and +faststart puts the index at the front of the file
 * so playback can begin before the whole thing arrives.
 */

import { spawn } from "node:child_process";
import { mkdir, readdir, stat, access } from "node:fs/promises";
import path from "node:path";

const VIDEO_EXT = new Set([".mp4", ".mov", ".m4v", ".mkv", ".avi"]);

/* ---------------------------------------------------------------- args --- */

function parseArgs(argv) {
  const opts = {
    list: false,
    all: false,
    in: "Vids",
    out: "public/work",
    start: null,
    duration: 6,
    max: 720,
    crf: 26,
    webm: false,
    jpg: false,
    name: null,
    jobs: 2,
    force: false,
    files: [],
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case "--list": opts.list = true; break;
      case "--all": opts.all = true; break;
      case "--webm": opts.webm = true; break;
      case "--jpg": opts.jpg = true; break;
      case "--force": opts.force = true; break;
      case "--in": opts.in = next(); break;
      case "--out": opts.out = next(); break;
      case "--start": opts.start = next(); break;
      case "--name": opts.name = next(); break;
      case "--duration": opts.duration = Number(next()); break;
      case "--max": opts.max = Number(next()); break;
      case "--crf": opts.crf = Number(next()); break;
      case "--jobs": opts.jobs = Math.max(1, Number(next())); break;
      case "-h":
      case "--help": opts.help = true; break;
      default:
        if (a.startsWith("--")) throw new Error(`Unknown flag: ${a}`);
        opts.files.push(a);
    }
  }
  return opts;
}

/* ----------------------------------------------------------- utilities --- */

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { windowsHide: true });
    let stderr = "";
    child.stderr.on("data", (d) => (stderr += d));
    let stdout = "";
    child.stdout.on("data", (d) => (stdout += d));
    child.on("error", (err) =>
      reject(
        err.code === "ENOENT"
          ? new Error(
              `${cmd} not found on PATH.\n` +
                `  Install it from https://ffmpeg.org/download.html\n` +
                `  or on Windows: winget install Gyan.FFmpeg`,
            )
          : err,
      ),
    );
    child.on("close", (code) =>
      code === 0
        ? resolve({ stdout, stderr })
        : reject(new Error(stderr.trim().split("\n").slice(-5).join("\n"))),
    );
  });
}

async function probe(file) {
  const { stdout } = await run("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height",
    "-show_entries", "format=duration",
    "-of", "json",
    file,
  ]);
  const data = JSON.parse(stdout);
  const stream = data.streams?.[0] ?? {};
  return {
    width: Number(stream.width) || 0,
    height: Number(stream.height) || 0,
    duration: Number(data.format?.duration) || 0,
  };
}

const slugify = (name) =>
  path
    .basename(name, path.extname(name))
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const human = (bytes) =>
  bytes > 1024 ** 3
    ? `${(bytes / 1024 ** 3).toFixed(2)} GB`
    : bytes > 1024 ** 2
      ? `${(bytes / 1024 ** 2).toFixed(1)} MB`
      : `${Math.round(bytes / 1024)} KB`;

const clock = (s) => {
  if (!s) return "?";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

const exists = (p) => access(p).then(() => true, () => false);

/**
 * Nearest tidy aspect ratio, written the way content/projects.ts wants it.
 * Snapping matters: a 1080x1920 master is exactly 9/16, but an odd crop can
 * land on 0.5624, and a tile whose declared ratio disagrees with its media
 * makes the justified row drift.
 */
function aspectExpr(width, height) {
  if (!width || !height) return { expr: "16 / 9", label: "16:9" };
  const ratio = width / height;
  const known = [
    [16 / 9, "16 / 9", "16:9"],
    [9 / 16, "9 / 16", "9:16"],
    [1, "1", "1:1"],
    [4 / 5, "4 / 5", "4:5"],
    [5 / 4, "5 / 4", "5:4"],
    [4 / 3, "4 / 3", "4:3"],
    [3 / 4, "3 / 4", "3:4"],
    [2.39, "2.39", "2.39:1"],
    [2 / 3, "2 / 3", "2:3"],
    [3 / 2, "3 / 2", "3:2"],
  ];
  const hit = known.find(([r]) => Math.abs(r - ratio) < 0.02);
  return hit
    ? { expr: hit[1], label: hit[2] }
    : { expr: ratio.toFixed(4), label: `${ratio.toFixed(2)}:1` };
}

/* ------------------------------------------------------------ encoding --- */

/** Fit inside max x max, preserving aspect, forcing even dimensions (H.264). */
const scaleFilter = (max) =>
  `scale=${max}:${max}:force_original_aspect_ratio=decrease,` +
  `scale=trunc(iw/2)*2:trunc(ih/2)*2`;

async function makePreview(source, opts) {
  const info = await probe(source);
  const slug = opts.name || slugify(source);
  const outDir = opts.out;

  const start =
    opts.start ?? (info.duration ? (info.duration * 0.25).toFixed(2) : "0");

  const mp4 = path.join(outDir, `${slug}.mp4`);
  const webm = path.join(outDir, `${slug}.webm`);
  const poster = path.join(outDir, `${slug}.${opts.jpg ? "jpg" : "webp"}`);

  if (!opts.force && (await exists(mp4))) {
    return { slug, skipped: true, mp4, poster, info };
  }

  const vf = scaleFilter(opts.max);

  // H.264 loop. -ss before -i so ffmpeg seeks instead of decoding from zero,
  // which matters a lot when the source is a gigabyte-plus master.
  await run("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y",
    "-ss", String(start),
    "-t", String(opts.duration),
    "-i", source,
    "-an",                        // no audio track at all
    "-vf", vf,
    "-c:v", "libx264",
    "-profile:v", "main",
    "-crf", String(opts.crf),
    "-preset", "slow",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    mp4,
  ]);

  if (opts.webm) {
    await run("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y",
      "-ss", String(start),
      "-t", String(opts.duration),
      "-i", source,
      "-an",
      "-vf", vf,
      "-c:v", "libvpx-vp9",
      "-crf", String(opts.crf + 6),
      "-b:v", "0",
      "-row-mt", "1",
      "-deadline", "good",
      webm,
    ]);
  }

  // Poster from the SAME frame the loop starts on, so hovering a tile does
  // not visibly jump as the video takes over from the still.
  await run("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y",
    "-ss", String(start),
    "-i", source,
    "-frames:v", "1",
    "-vf", `scale=1600:1600:force_original_aspect_ratio=decrease`,
    ...(opts.jpg ? ["-q:v", "4"] : ["-quality", "82"]),
    poster,
  ]);

  const sizes = {
    mp4: (await stat(mp4)).size,
    poster: (await stat(poster)).size,
    webm: opts.webm && (await exists(webm)) ? (await stat(webm)).size : null,
  };

  return { slug, skipped: false, mp4, webm, poster, info, sizes, start };
}

/* ---------------------------------------------------------------- main --- */

async function listSources(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    throw new Error(`Input folder not found: ${dir}`);
  }
  return entries
    .filter((e) => e.isFile() && VIDEO_EXT.has(path.extname(e.name).toLowerCase()))
    .map((e) => path.join(dir, e.name))
    .sort();
}

/** Run `task` over `items` with at most `limit` in flight. */
async function pool(items, limit, task) {
  const results = [];
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await task(items[index], index).catch((err) => ({
        error: err,
        source: items[index],
      }));
    }
  });
  await Promise.all(workers);
  return results;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    console.log(
      "Usage: node scripts/make-preview.mjs [files...] [--all] [--list] [flags]\n" +
        "See the comment at the top of this file for every flag.",
    );
    return;
  }

  if (opts.list) {
    const sources = await listSources(opts.in);
    if (!sources.length) {
      console.log(`No video files in ${opts.in}/`);
      return;
    }
    console.log(`${sources.length} file(s) in ${opts.in}/\n`);
    for (const file of sources) {
      const [info, st] = await Promise.all([
        probe(file).catch(() => ({ width: 0, height: 0, duration: 0 })),
        stat(file),
      ]);
      const shape =
        info.width && info.height
          ? info.width > info.height
            ? "landscape"
            : info.width < info.height
              ? "VERTICAL "
              : "square   "
          : "?        ";
      console.log(
        `  ${shape} ${String(info.width).padStart(4)}x${String(info.height).padEnd(4)}` +
          ` ${clock(info.duration).padStart(6)}  ${human(st.size).padStart(9)}  ${path.basename(file)}`,
      );
    }
    return;
  }

  let sources = opts.files;
  if (opts.all) sources = await listSources(opts.in);

  if (!sources.length) {
    console.log(
      "Nothing to do. Pass a file, or --all, or --list to see what is available.",
    );
    return;
  }

  await mkdir(opts.out, { recursive: true });

  console.log(
    `Encoding ${sources.length} file(s) -> ${opts.out}/  ` +
      `(${opts.duration}s, long edge ${opts.max}px, crf ${opts.crf}, no audio)\n`,
  );

  const results = await pool(sources, opts.jobs, async (source) => {
    const label = path.basename(source);
    try {
      const result = await makePreview(source, opts);
      if (result.skipped) {
        console.log(`  skip  ${label}  (already built - use --force to redo)`);
      } else {
        const extra = result.sizes.webm
          ? ` + ${human(result.sizes.webm)} webm`
          : "";
        console.log(
          `  ok    ${label}\n` +
            `          -> ${result.slug}.mp4  ${human(result.sizes.mp4)}${extra}` +
            `  poster ${human(result.sizes.poster)}`,
        );
      }
      return result;
    } catch (err) {
      console.error(`  FAIL  ${label}\n          ${err.message}`);
      return { error: err, source };
    }
  });

  const ok = results.filter((r) => r && !r.error && !r.skipped);
  if (!ok.length) return;

  // Paste-ready entries, with aspectRatio derived from the real dimensions so
  // the justified grid matches the media instead of guessing.
  console.log(
    `\n${"-".repeat(70)}\nAdd to content/projects.ts (edit titles, clients and categories):\n`,
  );
  for (const r of ok) {
    const { expr } = aspectExpr(r.info.width, r.info.height);
    const posterExt = path.extname(r.poster);
    console.log(`  {
    id: ${JSON.stringify(r.slug)},
    title: "TODO",
    client: "TODO",
    categories: ["Construction"],
    aspectRatio: ${expr},
    poster: "/work/${r.slug}${posterExt}",
    preview: "/work/${r.slug}.mp4",
    video: { type: "mp4", src: "" },
    year: "${new Date().getFullYear()}",
    role: ["Shot", "Edited", "Color"],
  },`);
  }

  const oversized = ok.filter((r) => r.sizes.mp4 > 3 * 1024 * 1024);
  if (oversized.length) {
    console.log(
      `\nNote: ${oversized.length} loop(s) came out over 3MB. Raise --crf ` +
        `(try 28-30) or lower --max to shrink them.`,
    );
  }
}

main().catch((err) => {
  console.error(`\n${err.message}`);
  process.exit(1);
});
