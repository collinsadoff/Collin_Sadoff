#!/usr/bin/env node
/**
 * set-video-urls - fill in every project's hosted video URL from one base.
 *
 * The files in "Vids/Upload Ready" are named after their project id, so once
 * they are uploaded somewhere with those names intact, every URL is just
 * <base>/<id>.mp4. This writes them all into content/projects.ts rather than
 * you pasting eighteen of them.
 *
 *   node scripts/set-video-urls.mjs https://storage.googleapis.com/my-bucket
 *   node scripts/set-video-urls.mjs https://storage.googleapis.com/my-bucket/films --dry-run
 *
 * Flags
 *   --dry-run   Print what would change, write nothing.
 *   --force     Also overwrite entries that already have a URL.
 *   --check     Request each URL and report status, Content-Type and size.
 *               Worth running once: a bucket object served as
 *               application/octet-stream instead of video/mp4 will not play
 *               in some browsers, and that is the most common setup mistake.
 *
 * It only touches `src: ""` inside a `video: { type: "mp4", ... }` block, so
 * anything already pointing at Vimeo, Bunny or Mux is left alone.
 */

import { readFile, writeFile } from "node:fs/promises";

const args = process.argv.slice(2);
const base = args.find((a) => !a.startsWith("--"));
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const check = args.includes("--check");
const FILE = "content/projects.ts";

if (!base) {
  console.error(
    "Usage: node scripts/set-video-urls.mjs <base-url> [--dry-run] [--force] [--check]\n\n" +
      "  <base-url> is everything before the filename, no trailing slash:\n" +
      "    https://storage.googleapis.com/your-bucket\n" +
      "    https://storage.googleapis.com/your-bucket/films",
  );
  process.exit(1);
}

const root = base.replace(/\/+$/, "");
let source = await readFile(FILE, "utf8");

// Walk each project block so an id is only ever paired with its own video.
const blocks = [...source.matchAll(/\{\s*\n\s*id: "([^"]+)",[\s\S]*?\n  \},/g)];
if (!blocks.length) {
  console.error(`No project entries found in ${FILE}.`);
  process.exit(1);
}

const changes = [];
for (const block of blocks) {
  const [text, id] = block;
  const m = text.match(/video: \{ type: "mp4", src: "([^"]*)" \}/);
  if (!m) continue; // hosted elsewhere, or a shape we should not rewrite
  if (m[1] && !force) continue; // already set

  const url = `${root}/${id}.mp4`;
  const updated = text.replace(
    /video: \{ type: "mp4", src: "[^"]*" \}/,
    `video: { type: "mp4", src: "${url}" }`,
  );
  changes.push({ id, url, from: text, to: updated });
}

if (!changes.length) {
  console.log(
    "Nothing to do - every mp4 entry already has a URL. Use --force to replace them.",
  );
  process.exit(0);
}

console.log(`${changes.length} project(s) -> ${root}/<id>.mp4\n`);
for (const c of changes) console.log(`  ${c.id.padEnd(34)} ${c.url}`);

if (check) {
  console.log("\nChecking each URL...\n");
  let problems = 0;
  for (const c of changes) {
    try {
      const res = await fetch(c.url, { method: "HEAD" });
      const type = res.headers.get("content-type") || "(none)";
      const len = Number(res.headers.get("content-length") || 0);
      const size = len ? `${(len / 1048576).toFixed(1)} MB` : "unknown size";
      const typeOk = type.startsWith("video/");
      if (!res.ok || !typeOk) problems++;
      console.log(
        `  ${res.ok ? "ok " : "ERR"} ${String(res.status).padEnd(4)} ` +
          `${c.id.padEnd(34)} ${type.padEnd(26)} ${size}` +
          (res.ok && !typeOk ? "   <-- not a video/* type" : ""),
      );
    } catch (err) {
      problems++;
      console.log(`  ERR      ${c.id.padEnd(34)} ${err.message}`);
    }
  }
  if (problems) {
    console.log(
      `\n${problems} URL(s) need attention. If the status is 403, the object ` +
        `is not public.\nIf the type is application/octet-stream, re-upload ` +
        `with the content type set to video/mp4.`,
    );
  } else {
    console.log("\nAll URLs reachable and served as video/*.");
  }
}

if (dryRun) {
  console.log("\nDry run - nothing written.");
  process.exit(0);
}

for (const c of changes) source = source.replace(c.from, c.to);
await writeFile(FILE, source, "utf8");
console.log(`\nWrote ${changes.length} URL(s) into ${FILE}.`);
