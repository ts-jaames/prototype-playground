import { listPrototypeSlugs, readPrototype, type Prototype } from "./prototype-meta";

export type { Prototype, PrototypeMetadata } from "./prototype-meta";

/** Every prototype, most recently updated first. Runs at build time on the server. */
export function getAllPrototypes(): Prototype[] {
  return listPrototypeSlugs()
    .map((slug) => readPrototype(slug))
    .sort((a, b) => Date.parse(b.updatedAt || "0") - Date.parse(a.updatedAt || "0"));
}

export function getPrototype(slug: string): Prototype | null {
  return listPrototypeSlugs().includes(slug) ? readPrototype(slug) : null;
}

export function getPublicPrototypes(): Prototype[] {
  return getAllPrototypes().filter((p) => p.public);
}
