#!/usr/bin/env node
/**
 * prepare-uploads - rename and compress finished films into a clean folder
 * ready to drop into Google Cloud Storage (or any host).
 *
 * It never touches the source files. Everything is written to a new folder,
 * so the originals stay exactly where they are.
 *
 *   node scripts/prepare-uploads.mjs
 *   node scripts/prepare-uploads.mjs --dry-run
 *   node scripts/prepare-uploads.mjs --crf 21 --force
 *
 * Flags
 *   --in <dir>      Source folder (default: "Vids/Portfolio Work")
 *   --out <dir>     Destination  (default: "Vids/Upload Ready")
 *   --map <file>    Rename map   (default: scripts/upload-names.json)
 *   --crf <n>       Quality, lower is better and bigger (default: 23)
 *   --preset <p>    x264 preset (default: medium)
 *   --max <px>      Cap on the long edge (default: 1920)
 *   --dry-run       Print what would happen, encode nothing.
 *   --force         Re-encode files that are already in the output folder.
 *
 * What it does to each file, and why:
 *   - re-encodes to H.264 at a sane bitrate. These are delivery masters;
 *     a 363MB 30-second clip is ~100x larger than it needs to be on the web,
 *     and on a flat host like GCS every viewer downloads all of it.
 *   - KEEPS the audio, re-encoded to AAC 128k. This is the opposite of the
 *     preview loops, which strip it: these are the full pieces, and the mix
 *     is part of the work being shown.
 *   - +faststart, so playback starts before the file finishes downloading.
 *   - leaves the resolution alone up to 1920 on the long edge, so vertical
 *     stays 1080x1920 rather than being downscaled to a phone-sized frame.
 *   - writes MANIFEST.md listing old name, new name, and the size saved.
 */

import { spawn } from "node:child_process";
import { mkdir, readdir, readFile, writeFile, stat, access } from "node:fs/promises";
import path from "node:path";

function parseArgs(argv) {
  const o = {
    in: "Vids/Portfolio Work",
    out: "Vids/Upload Ready",
    map: "scripts/upload-names.json",
    crf: 23,
    preset: "medium",
    max: 1920,
    dryRun: false,
    force: false,
    jobs: 2,
  };
  for (let i = 0; i < argv.length; i++) {
    const next = () => argv[++i];
    switch (argv[i]) {
      case "--in": o.in = next(); break;
      case "--out": o.out = next(); break;
      case "--map": o.map = next(); break;
      case "--crf": o.crf = Number(next()); break;
      case "--preset": o.preset = next(); break;
      case "--max": o.max = Number(next()); break;
      case "--jobs": o.jobs = Math.max(1, Number(next())); break;
      case "--dry-run": o.dryRun = true; break;
      case "--force": o.force = true; break;
      case "-h":
      case "--help": o.help = true; break;
      default:
        if (argv[i].startsWith("--")) throw new Error(`Unknown flag: ${argv[i]}`);
    }
  }
  return o;
}

const run = (cmd, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { windowsHide: true });
    let stderr = "";
    child.stderr.on("data", (d) => (stderr += d));
    let stdout = "";
    child.stdout.on("data", (d) => (stdout += d));
    child.on("error", (e) =>
      reject(
        e.code === "ENOENT"
          ? new Error(`${cmd} not found on PATH. Install ffmpeg first.`)
          : e,
      ),
    );
    child.on("close", (code) =>
      code === 0
        ? resolve({ stdout, stderr })
        : reject(new Error(stderr.trim().split("\n").slice(-4).join("\n"))),
    );
  });

async function probe(file) {
  const { stdout } = await run("ffprobe", [
    "-v", "error",
    "-show_entries", "stream=codec_type,width,height",
    "-show_entries", "format=duration",
    "-of", "json",
    file,
  ]);
  const d = JSON.parse(stdout);
  const v = (d.streams || []).find((s) => s.codec_type === "video") || {};
  return {
    width: Number(v.width) || 0,
    height: Number(v.height) || 0,
    duration: Number(d.format?.duration) || 0,
    hasAudio: (d.streams || []).some((s) => s.codec_type === "audio"),
  };
}

const human = (b) =>
  b >= 1024 ** 3
    ? `${(b / 1024 ** 3).toFixed(2)} GB`
    : b >= 1024 ** 2
      ? `${(b / 1024 ** 2).toFixed(1)} MB`
      : `${Math.round(b / 1024)} KB`;

const exists = (p) => access(p).then(() => true, () => false);

async function pool(items, limit, task) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const n = i++;
        out[n] = await task(items[n], n);
      }
    }),
  );
  return out;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    console.log(
      `prepare-uploads - rename and compress finished films for hosting.\n\n` +
        `  node scripts/prepare-uploads.mjs [--dry-run] [flags]\n\n` +
        `  --in <dir>      source folder      (default: "Vids/Portfolio Work")\n` +
        `  --out <dir>     destination        (default: "Vids/Upload Ready")\n` +
        `  --map <file>    rename map         (default: scripts/upload-names.json)\n` +
        `  --crf <n>       quality, lower = bigger/better (default: 23)\n` +
        `  --preset <p>    x264 preset        (default: medium)\n` +
        `  --max <px>      long-edge cap      (default: 1920)\n` +
        `  --jobs <n>      parallel encodes   (default: 2)\n` +
        `  --dry-run       print the plan, encode nothing\n` +
        `  --force         re-encode files already in the output folder\n\n` +
        `Source files are never modified.`,
    );
    return;
  }

  const raw = JSON.parse(await readFile(opts.map, "utf8"));
  const map = Object.fromEntries(
    Object.entries(raw).filter(([k]) => !k.startsWith("_")),
  );

  const present = (await readdir(opts.in)).filter((f) => /\.(mp4|mov)$/i.test(f));
  const missing = present.filter((f) => !map[f]);
  const stale = Object.keys(map).filter((f) => !present.includes(f));

  if (missing.length) {
    console.log(
      `\n${missing.length} file(s) in the source folder are not in the map ` +
        `and will be skipped:\n` +
        missing.map((f) => `    ${f}`).join("\n") +
        `\n  Add them to ${opts.map} to include them.\n`,
    );
  }
  if (stale.length) {
    console.log(
      `${stale.length} map entr(ies) have no matching file and are ignored:\n` +
        stale.map((f) => `    ${f}`).join("\n") +
        "\n",
    );
  }

  const todo = present.filter((f) => map[f]);
  if (!todo.length) {
    console.log("Nothing to do.");
    return;
  }

  const unsure = todo.filter((f) => map[f].sure === false);
  if (unsure.length) {
    console.log(
      `NOTE: ${unsure.length} of ${todo.length} names are my guess from sample\n` +
        `frames, not confirmed. Check these in ${opts.map} before you publish:\n` +
        unsure.map((f) => `    ${map[f].name}   <- ${f}`).join("\n") +
        "\n",
    );
  }

  if (opts.dryRun) {
    console.log(`Dry run - ${todo.length} file(s) would be written to ${opts.out}/\n`);
    for (const f of todo) {
      const info = await probe(path.join(opts.in, f));
      const st = await stat(path.join(opts.in, f));
      console.log(
        `  ${f.padEnd(16)} -> ${map[f].name}.mp4`.padEnd(58) +
          `${String(info.width)}x${info.height}  ${human(st.size)}`,
      );
    }
    return;
  }

  await mkdir(opts.out, { recursive: true });
  console.log(
    `Encoding ${todo.length} file(s) -> ${opts.out}/\n` +
      `  H.264 crf ${opts.crf} preset ${opts.preset}, long edge <= ${opts.max}, AAC 128k, faststart\n`,
  );

  const results = await pool(todo, opts.jobs, async (file) => {
    const src = path.join(opts.in, file);
    const dstName = `${map[file].name}.mp4`;
    const dst = path.join(opts.out, dstName);

    if (!opts.force && (await exists(dst))) {
      console.log(`  skip  ${dstName}  (exists - use --force to redo)`);
      return { file, dstName, skipped: true };
    }

    try {
      const info = await probe(src);
      const before = (await stat(src)).size;

      const args = [
        "-hide_banner", "-loglevel", "error", "-y",
        "-i", src,
        "-vf",
        `scale=${opts.max}:${opts.max}:force_original_aspect_ratio=decrease,` +
          `scale=trunc(iw/2)*2:trunc(ih/2)*2`,
        "-c:v", "libx264",
        "-crf", String(opts.crf),
        "-preset", opts.preset,
        "-profile:v", "high",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
      ];
      // Keep the mix - it is part of the work. No audio stream, no -c:a.
      if (info.hasAudio) args.push("-c:a", "aac", "-b:a", "128k", "-ac", "2");
      else args.push("-an");
      args.push(dst);

      await run("ffmpeg", args);

      const after = (await stat(dst)).size;
      const pct = Math.round((1 - after / before) * 100);
      console.log(
        `  ok    ${dstName.padEnd(34)} ${human(before).padStart(9)} -> ` +
          `${human(after).padStart(9)}  (-${pct}%)`,
      );
      return { file, dstName, before, after, info, skipped: false };
    } catch (err) {
      console.error(`  FAIL  ${file}\n          ${err.message}`);
      return { file, dstName, error: String(err.message) };
    }
  });

  const ok = results.filter((r) => r && !r.error && !r.skipped);
  const before = ok.reduce((s, r) => s + r.before, 0);
  const after = ok.reduce((s, r) => s + r.after, 0);

  if (ok.length) {
    console.log(
      `\n${ok.length} encoded.  ${human(before)} -> ${human(after)}` +
        `  (-${Math.round((1 - after / before) * 100)}%)`,
    );
  }

  // A manifest so the old -> new mapping is never lost.
  const lines = [
    "# Upload Ready",
    "",
    "Renamed, web-compressed copies of the films in `Portfolio Work/`.",
    "Originals are untouched.",
    "",
    "Generated by `scripts/prepare-uploads.mjs`. Names come from",
    "`scripts/upload-names.json` - edit that file and re-run with `--force`",
    "to change them.",
    "",
    "| New name | Was | Size | Confirmed |",
    "| --- | --- | --- | --- |",
    ...results
      .filter((r) => r && !r.error)
      .map((r) => {
        const m = map[r.file];
        const size = r.after ? human(r.after) : "-";
        const sure = m.sure ? "yes" : "**check this**";
        return `| \`${r.dstName}\` | \`${r.file}\` | ${size} | ${sure} |`;
      }),
    "",
    "## Notes",
    "",
    ...results
      .filter((r) => r && !r.error && map[r.file].note)
      .map((r) => `- **${r.dstName}** - ${map[r.file].note}`),
    "",
  ];
  await writeFile(path.join(opts.out, "MANIFEST.md"), lines.join("\n"), "utf8");
  console.log(`Wrote ${path.join(opts.out, "MANIFEST.md")}`);
}

main().catch((e) => {
  console.error(`\n${e.message}`);
  process.exit(1);
});
