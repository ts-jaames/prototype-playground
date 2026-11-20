"use client";

import { useState } from "react";

import { Collapse } from "@/components/playground/collapse";
import { cn } from "@/lib/utils";

import { ScoreBars } from "./score-bars";
import type { Classified } from "./types";

export function FlipRow({ item, passBar }: { item: Classified; passBar: number }) {
  const [open, setOpen] = useState(false);
  const good = item.kind === "fix";
  const delta = `${item.delta > 0 ? "+" : "−"}${Math.abs(item.delta).toFixed(2)}`;

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full flex-col gap-2 py-2.5 text-left"
      >
        <span className="flex items-baseline gap-2">
          <span className="min-w-0 truncate font-mono text-sm">{item.name}</span>
          <span className="shrink-0 text-xs text-muted-foreground">{item.suite}</span>
          <span
            className={cn(
              "ml-auto shrink-0 text-sm font-medium tabular-nums",
              good ? "text-chart-2" : item.kind === "regression" ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {delta}
          </span>
        </span>
        <ScoreBars baseline={item.baseline} candidate={item.candidate} passBar={passBar} tone={good ? "good" : "bad"} />
      </button>
      <Collapse open={open}>
        <p className="pb-3 font-mono text-xs text-muted-foreground">
          {item.baseline.toFixed(2)} → {item.candidate.toFixed(2)} · {item.note}
        </p>
      </Collapse>
    </div>
  );
}
