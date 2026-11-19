// Plain Node module (no "@/" imports, no JSX) so scripts in scripts/ can import it
// directly with `node scripts/*.mts`.
import fs from "node:fs";
import path from "node:path";

export type PrototypeMetadata = {
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  hidden: boolean;
  public: boolean;
};

export type Prototype = PrototypeMetadata & {
  slug: string;
  thumbnails: { light: string; dark: string } | null;
  og: { image: string; video: string | null } | null;
};

export const PROTOTYPES_DIR = path.join("app", "prototypes");
export const THUMBNAILS_DIR = path.join("public", "thumbnails");
export const OG_DIR = path.join("public", "og");

export const thumbnailFile = (slug: string, theme: "light" | "dark") =>
  `${slug}-${theme}.jpg`;

/** Folder names under app/prototypes that are real prototypes. */
export function listPrototypeSlugs(root = process.cwd()): string[] {
  const dir = path.join(root, PROTOTYPES_DIR);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^[a-z0-9][a-z0-9-]*$/.test(entry.name))
    .filter((entry) => fs.existsSync(path.join(dir, entry.name, "page.tsx")))
    .map((entry) => entry.name)
    .sort();
}

/** Returns the parsed metadata plus a list of problems (empty when valid). */
export function parseMetadata(raw: unknown): {
  metadata: PrototypeMetadata;
  errors: string[];
} {
  const errors: string[] = [];
  const obj = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;

  const str = (key: string) => {
    if (typeof obj[key] !== "string" || !(obj[key] as string).trim()) {
      errors.push(`"${key}" must be a non-empty string`);
      return "";
    }
    return obj[key] as string;
  };
  const bool = (key: string) => {
    if (typeof obj[key] !== "boolean") errors.push(`"${key}" must be true or false`);
    return obj[key] === true;
  };

  const tags = Array.isArray(obj.tags) && obj.tags.every((t) => typeof t === "string")
    ? (obj.tags as string[])
    : (errors.push(`"tags" must be an array of strings`), []);

  const metadata: PrototypeMetadata = {
    title: str("title"),
    description: str("description"),
    tags,
    createdAt: str("createdAt"),
    updatedAt: str("updatedAt"),
    hidden: bool("hidden"),
    public: bool("public"),
  };

  if (metadata.createdAt && !/^\d{4}-\d{2}-\d{2}$/.test(metadata.createdAt)) {
    errors.push(`"createdAt" must be YYYY-MM-DD`);
  }
  if (metadata.updatedAt && Number.isNaN(Date.parse(metadata.updatedAt))) {
    errors.push(`"updatedAt" must be an ISO timestamp`);
  }

  return { metadata, errors };
}

export function readPrototype(slug: string, root = process.cwd()): Prototype {
  const metaPath = path.join(root, PROTOTYPES_DIR, slug, "metadata.json");
  let raw: unknown = {};
  try {
    raw = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  } catch {
    raw = {};
  }
  const { metadata } = parseMetadata(raw);

  const light = thumbnailFile(slug, "light");
  const dark = thumbnailFile(slug, "dark");
  const hasThumbs =
    fs.existsSync(path.join(root, THUMBNAILS_DIR, light)) &&
    fs.existsSync(path.join(root, THUMBNAILS_DIR, dark));

  const ogImage = fs.existsSync(path.join(root, OG_DIR, `${slug}.png`));
  const ogVideo = fs.existsSync(path.join(root, OG_DIR, `${slug}.mp4`));

  return {
    ...metadata,
    title: metadata.title || slug,
    slug,
    thumbnails: hasThumbs
      ? { light: `/thumbnails/${light}`, dark: `/thumbnails/${dark}` }
      : null,
    og: ogImage
      ? { image: `/og/${slug}.png`, video: ogVideo ? `/og/${slug}.mp4` : null }
      : null,
  };
}
