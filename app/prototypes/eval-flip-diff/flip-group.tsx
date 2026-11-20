"use client";

import { useState } from "react";

import { Collapse } from "@/components/playground/collapse";

import { FlipRow } from "./flip-row";
import type { Classified } from "./types";

/** A group that shows its rows; `collapsedByDefault` groups show only a count until tapped. */
export function FlipGroup({
  title,
  items,
  passBar,
  collapsedByDefault = false,
}: {
  title: string;
  items: Classified[];
  passBar: number;
  collapsedByDefault?: boolean;
}) {
  const [open, setOpen] = useState(!collapsedByDefault);
  if (items.length === 0) return null;

  return (
    <section aria-label={title}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center gap-2 border-b border-border text-left text-xs font-medium text-muted-foreground"
      >
        {title} · {items.length}
        <span className="ml-auto">{open ? "Hide" : "Show"}</span>
      </button>
      <Collapse open={open}>
        <div className="divide-y divide-border">
          {items.map((item) => (
            <FlipRow key={item.id} item={item} passBar={passBar} />
          ))}
        </div>
      </Collapse>
    </section>
  );
}
