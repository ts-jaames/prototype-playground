import type { Prototype } from "@/lib/prototypes";

export type GalleryFilter = {
  query: string;
  tags: string[];
  showHidden: boolean;
};

export function filterPrototypes(items: Prototype[], filter: GalleryFilter): Prototype[] {
  const q = filter.query.trim().toLowerCase();
  return items.filter((p) => {
    if (p.hidden && !filter.showHidden) return false;
    if (filter.tags.some((tag) => !p.tags.includes(tag))) return false;
    if (!q) return true;
    return [p.title, p.description, p.slug, ...p.tags].some((s) => s.toLowerCase().includes(q));
  });
}

export function collectTags(items: Prototype[]): string[] {
  return [...new Set(items.flatMap((p) => p.tags))].sort();
}
