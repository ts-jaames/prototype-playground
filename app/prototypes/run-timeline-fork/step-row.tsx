"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { Step } from "./types";

export type StepState = "done" | "running" | "pending";

type Props = {
  step: Step;
  index: number;
  state: StepState;
  cached: boolean;
  selected: boolean;
  onSelect: () => void;
};

export function StepRow({ step, index, state, cached, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-expanded={selected}
      className={cn(
        "flex min-h-11 w-full items-start gap-3 rounded-lg px-3 py-2 text-left outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-muted",
        selected ? "bg-muted" : "bg-transparent",
        state === "pending" && "opacity-50",
      )}
    >
      <span className="mt-0.5 w-4 shrink-0 text-xs text-muted-foreground tabular-nums">{index + 1}</span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs">{step.tool}</span>
          {cached && <Badge variant="outline">reused</Badge>}
          {state === "running" && <Badge variant="secondary">running</Badge>}
        </span>
        <span className="text-sm text-muted-foreground">
          {state === "done" ? step.result : state === "running" ? "Working…" : "Waiting"}
        </span>
      </span>
    </button>
  );
}
