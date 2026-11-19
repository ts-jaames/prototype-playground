// Captures small light + dark screenshots of prototypes into public/thumbnails/.
//
//   npm run thumbnails                       # all prototypes
//   npm run thumbnails -- --slug flow-field  # one (repeat --slug or comma-separate for several)
//   npm run thumbnails -- --missing          # only prototypes without both thumbnails
//   npm run thumbnails -- --no-build ...     # reuse the existing .next build
import fs from "node:fs";
import path from "node:path";

import { chromium } from "playwright";

import {
  listPrototypeSlugs,
  readPrototype,
  THUMBNAILS_DIR,
  thumbnailFile,
} from "../lib/prototype-meta.ts";
import { build, forceTheme, HIDE_CHROME_CSS, login, parseArgs, startServer } from "./_shared.mts";

const VIEWPORT = { width: 1280, height: 800 };
const SCALE = 0.5; // saved images are 640x400
const SETTLE_MS = 2000;

const args = parseArgs();
const all = listPrototypeSlugs();

const unknown = args.slugs.filter((s) => !all.includes(s));
if (unknown.length) {
  console.error(`Unknown prototype(s): ${unknown.join(", ")}\nKnown: ${all.join(", ")}`);
  process.exit(1);
}

let targets = args.slugs.length ? args.slugs : all;
if (args.missing) targets = targets.filter((slug) => !readPrototype(slug).thumbnails);

if (targets.length === 0) {
  console.log("Nothing to capture.");
  process.exit(0);
}

console.log(`Capturing: ${targets.join(", ")}`);
if (args.build) build();

fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
const server = await startServer(args.port);
const browser = await chromium.launch();

try {
  for (const theme of ["dark", "light"] as const) {
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: SCALE,
      colorScheme: theme,
      reducedMotion: "no-preference",
    });
    await forceTheme(context, theme);
    await login(context, server);
    const page = await context.newPage();

    for (const slug of targets) {
      const res = await page.goto(`${server.url}/prototypes/${slug}`, { waitUntil: "networkidle" });
      if (!res?.ok()) throw new Error(`/prototypes/${slug} returned ${res?.status()}`);
      await page.addStyleTag({ content: HIDE_CHROME_CSS });
      await page.waitForTimeout(SETTLE_MS);
      const file = path.join(THUMBNAILS_DIR, thumbnailFile(slug, theme));
      await page.screenshot({ path: file, type: "jpeg", quality: 80 });
      console.log(`  ✓ ${file}`);
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.stop();
}

console.log("\nDone. Open the images and check them before committing.");
