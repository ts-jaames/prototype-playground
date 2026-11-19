// Checks every prototype against the mechanical rules in AGENTS.md.
// Errors fail the run (exit 1); warnings are printed but pass.
//
//   npm run validate
import fs from "node:fs";
import path from "node:path";

import {
  listPrototypeSlugs,
  parseMetadata,
  PROTOTYPES_DIR,
  readPrototype,
} from "../lib/prototype-meta.ts";

const REQUIRED_SECTIONS = [
  "What It Does",
  "Architecture",
  "Key Dependencies",
  "Component Tree",
  "Error Handling",
  "File Structure",
];
const PAGE_WARN_LINES = 60;
const PAGE_MAX_LINES = 100;
const FILE_WARN_LINES = 300;

const PALETTE =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const HARDCODED_COLOR = new RegExp(
  [
    `\\b(?:bg|text|border|fill|stroke|ring|from|via|to|outline|shadow|decoration|divide|accent|caret|placeholder)-(?:black|white|(?:${PALETTE})-\\d{2,3})\\b`,
    `["'\`]#[0-9a-fA-F]{3,8}["'\`]`,
    `\\b(?:rgb|rgba|hsl|hsla)\\(\\s*\\d`,
  ].join("|"),
);
const FORCED_DARK = /className=["'`][^"'`]*\bdark\b(?![:-])|classList\.(?:add|toggle)\(\s*["']dark["']/;
const AI_SDK = /from ["'](?:@anthropic-ai\/sdk|openai|ai|@ai-sdk\/[^"']+|@google\/genai)["']/;

type Issue = { level: "error" | "warn"; message: string };

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function checkPrototype(slug: string): Issue[] {
  const issues: Issue[] = [];
  const error = (message: string) => issues.push({ level: "error", message });
  const warn = (message: string) => issues.push({ level: "warn", message });
  const dir = path.join(PROTOTYPES_DIR, slug);

  // metadata.json
  const metaPath = path.join(dir, "metadata.json");
  if (!fs.existsSync(metaPath)) error("missing metadata.json");
  else {
    try {
      const { errors } = parseMetadata(JSON.parse(fs.readFileSync(metaPath, "utf8")));
      errors.forEach((e) => error(`metadata.json: ${e}`));
    } catch {
      error("metadata.json is not valid JSON");
    }
  }

  // Source files (prototype folder + its API routes)
  const apiDirs = [path.join("app", "api", slug), path.join("app", "api", "public", slug)];
  const sources = [...walk(dir), ...apiDirs.flatMap(walk)].filter((f) => /\.(tsx?|css)$/.test(f));
  let usesAi = false;

  for (const file of sources) {
    const text = fs.readFileSync(file, "utf8");
    const lines = text.split("\n");
    const rel = path.relative(dir, file);

    if (AI_SDK.test(text)) usesAi = true;
    if (lines.length > FILE_WARN_LINES) warn(`${rel} is ${lines.length} lines; split it up`);

    lines.forEach((line, i) => {
      const at = `${rel}:${i + 1}`;
      if (HARDCODED_COLOR.test(line)) error(`${at} hardcoded color; use design tokens: ${line.trim()}`);
      if (FORCED_DARK.test(line)) error(`${at} hardcoded "dark" class; the theme is global`);
      const imp = line.match(/from ["']([^"']+)["']/)?.[1];
      if (imp?.startsWith("@/app/prototypes/") && !imp.startsWith(`@/app/prototypes/${slug}/`)) {
        error(`${at} imports another prototype (${imp}); prototypes must be self-contained`);
      }
      if (imp?.startsWith(".") && file.startsWith(dir)) {
        const target = path.resolve(path.dirname(file), imp);
        if (!target.startsWith(path.resolve(dir))) {
          error(`${at} imports outside the prototype folder (${imp}); use "@/components/..." or move it in`);
        }
      }
    });

    if (/\blocalStorage\s*[.[]/.test(text) && !/\btry\s*\{/.test(text)) {
      error(`${rel} uses localStorage without try/catch`);
    }
  }

  // page.tsx stays thin
  const pagePath = path.join(dir, "page.tsx");
  const pageLines = fs.readFileSync(pagePath, "utf8").trimEnd().split("\n").length;
  if (pageLines > PAGE_MAX_LINES) error(`page.tsx is ${pageLines} lines; keep it ~${PAGE_WARN_LINES} and split out components`);
  else if (pageLines > PAGE_WARN_LINES) warn(`page.tsx is ${pageLines} lines; aim for ~${PAGE_WARN_LINES}`);

  // HOW_IT_WORKS.md
  const docPath = path.join(dir, "HOW_IT_WORKS.md");
  if (!fs.existsSync(docPath)) error("missing HOW_IT_WORKS.md");
  else {
    const doc = fs.readFileSync(docPath, "utf8");
    const headings = [...doc.matchAll(/^#{2,3}\s+(.+)$/gm)].map((m) => m[1].trim().toLowerCase());
    const has = (name: string) => headings.some((h) => h.startsWith(name.toLowerCase()));
    REQUIRED_SECTIONS.filter((s) => !has(s)).forEach((s) => error(`HOW_IT_WORKS.md missing "## ${s}"`));
    if (!has("Frontend") && !has("API")) error(`HOW_IT_WORKS.md needs "## Frontend" and/or "## API"`);
    if (usesAi && !has("AI Usage")) error(`HOW_IT_WORKS.md missing "## AI Usage" (a model SDK is imported)`);
  }

  // Assets
  const proto = readPrototype(slug);
  if (!proto.thumbnails) warn(`no thumbnails; run: npm run thumbnails -- --slug ${slug}`);
  if (proto.public && (!proto.og || !proto.og.video)) {
    error(`public but missing public/og/${slug}.png and/or .mp4; run: npm run og -- --slug ${slug}`);
  }

  return issues;
}

const slugs = listPrototypeSlugs();
let errors = 0;
let warnings = 0;

for (const slug of slugs) {
  const issues = checkPrototype(slug);
  errors += issues.filter((i) => i.level === "error").length;
  warnings += issues.filter((i) => i.level === "warn").length;
  console.log(`${issues.some((i) => i.level === "error") ? "✗" : "✓"} ${slug}`);
  for (const issue of issues) console.log(`    ${issue.level === "error" ? "error" : "warn "}  ${issue.message}`);
}

// Stray folders that look like prototypes but have no page.tsx
for (const entry of fs.readdirSync(PROTOTYPES_DIR, { withFileTypes: true })) {
  if (entry.isDirectory() && !entry.name.startsWith("[") && !slugs.includes(entry.name)) {
    console.log(`✗ ${entry.name}\n    error  folder has no page.tsx or the name isn't lowercase-kebab-case`);
    errors++;
  }
}

console.log(`\n${slugs.length} prototype(s), ${errors} error(s), ${warnings} warning(s)`);
process.exit(errors > 0 ? 1 : 0);
