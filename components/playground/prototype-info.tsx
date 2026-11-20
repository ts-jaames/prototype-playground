"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext } from "react";

export type PrototypeInfo = { title: string; description: string };

const PrototypeInfoContext = createContext<Record<string, PrototypeInfo>>({});

/** Makes title + description from metadata.json available to shared chrome. */
export function PrototypeInfoProvider({
  prototypes,
  children,
}: {
  prototypes: Record<string, PrototypeInfo>;
  children: React.ReactNode;
}) {
  return <PrototypeInfoContext value={prototypes}>{children}</PrototypeInfoContext>;
}

/** Info for the prototype at the current URL (/prototypes/<slug> or /p/<slug>). */
export function usePrototypeInfo(): PrototypeInfo | null {
  const prototypes = useContext(PrototypeInfoContext);
  const slug = usePathname().split("/")[2] ?? "";
  return prototypes[slug] ?? null;
}
