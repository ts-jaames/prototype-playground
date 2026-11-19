import type { ComponentType } from "react";

/** Loads the default export of app/prototypes/<slug>/page.tsx. */
export async function loadPrototypePage(slug: string): Promise<ComponentType> {
  const mod = (await import(`@/app/prototypes/${slug}/page`)) as { default: ComponentType };
  return mod.default;
}
