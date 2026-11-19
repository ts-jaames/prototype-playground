// Captures share assets for PUBLIC prototypes into public/og/: <slug>.png (og:image)
// and <slug>.mp4 (og:video), both 1200x630, from the public /p/<slug> route.
//
//   npm run og -- --slug flow-field   # one or several (repeat or comma-separate)
//   npm run og                        # every public prototype
//   npm run og -- --missing           # public prototypes without both assets
//   npm run og -- --no-build ...      # reuse the existing .next build
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import ffmpegPath from "ffmpeg-static";
import { chromium } from "playwright";

import { listPrototypeSlugs, OG_DIR, readPrototype } from "../lib/prototype-meta.ts";
import { build, forceTheme, HIDE_FOR_OG_CSS, parseArgs, startServer } from "./_shared.mts";

const SIZE = { width: 1200, height: 630 };
const LEAD_IN_S = 1.5; // trimmed from the start of the video (page load)
const CLIP_S = 6;

const args = parseArgs();
const publicSlugs = listPrototypeSlugs().filter((slug) => readPrototype(slug).public);

const notPublic = args.slugs.filter((s) => !publicSlugs.includes(s));
if (notPublic.length) {
  console.error(
    `Not public: ${notPublic.join(", ")}. Set "public": true in metadata.json first (only when the owner asked).`,
  );
  process.exit(1);
}

let targets = args.slugs.length ? args.slugs : publicSlugs;
if (args.missing) {
  targets = targets.filter((slug) => {
    const og = readPrototype(slug).og;
    return !og || !og.video;
  });
}
if (targets.length === 0) {
  console.log("Nothing to capture.");
  process.exit(0);
}
if (!ffmpegPath) throw new Error("ffmpeg-static has no binary for this platform");

console.log(`Capturing OG assets: ${targets.join(", ")}`);
if (args.build) build();

fs.mkdirSync(OG_DIR, { recursive: true });
const server = await startServer(args.port);
const browser = await chromium.launch();

try {
  for (const slug of targets) {
    const videoDir = fs.mkdtempSync(path.join(os.tmpdir(), `og-${slug}-`));
    const context = await browser.newContext({
      viewport: SIZE,
      colorScheme: "dark",
      recordVideo: { dir: videoDir, size: SIZE },
    });
    await forceTheme(context, "dark");
    const page = await context.newPage();
    const res = await page.goto(`${server.url}/p/${slug}`, { waitUntil: "networkidle" });
    if (!res?.ok()) throw new Error(`/p/${slug} returned ${res?.status()}`);
    await page.addStyleTag({ content: HIDE_FOR_OG_CSS });

    await page.waitForTimeout(LEAD_IN_S * 1000);
    const image = path.join(OG_DIR, `${slug}.png`);
    await page.screenshot({ path: image });
    console.log(`  ✓ ${image}`);

    await page.waitForTimeout(CLIP_S * 1000);
    const video = page.video();
    await context.close();
    const webm = await video!.path();

    const mp4 = path.join(OG_DIR, `${slug}.mp4`);
    const result = spawnSync(
      ffmpegPath,
      [
        "-y", "-loglevel", "error",
        "-ss", String(LEAD_IN_S), "-t", String(CLIP_S), "-i", webm,
        "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "slow", "-crf", "26",
        "-movflags", "+faststart", mp4,
      ],
      { stdio: "inherit" },
    );
    if (result.status !== 0) throw new Error(`ffmpeg failed for ${slug}`);
    fs.rmSync(videoDir, { recursive: true, force: true });
    console.log(`  ✓ ${mp4}`);
  }
} finally {
  await browser.close();
  server.stop();
}

console.log("\nDone. Check the image and video before committing.");
