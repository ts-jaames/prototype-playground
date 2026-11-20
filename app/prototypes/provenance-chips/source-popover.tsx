"use client";

import { CheckIcon, RefreshCwIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { SOURCE_LABELS } from "./data";
import { formatAge, STALE_AFTER_MINUTES } from "./format";
import type { FieldState, SourceId } from "./types";

type Props = {
  state: FieldState;
  refreshing: boolean;
  onSelect: (source: SourceId) => void;
  onRequery: () => void;
};

export function SourcePopover({ state, refreshing, onSelect, onRequery }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col gap-1">
        {state.readings.map((r) => {
          const selected = r.source === state.selected;
          return (
            <li key={r.source}>
              <button
                type="button"
                onClick={() => onSelect(r.source)}
                aria-pressed={selected}
                className={cn(
                  "flex min-h-11 w-full items-start gap-2 rounded-lg px-2 py-2 text-left outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-muted",
                  selected && "bg-muted",
                )}
              >
                <CheckIcon className={cn("mt-0.5 size-4 shrink-0", !selected && "invisible")} />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-medium">{r.value}</span>
                    <span className="text-xs text-muted-foreground">{SOURCE_LABELS[r.source]}</span>
                  </span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="truncate font-mono">{r.tool}</span>
                    <span className="shrink-0">{formatAge(r.minutesAgo)}</span>
                    {r.minutesAgo >= STALE_AFTER_MINUTES && <Badge variant="destructive">stale</Badge>}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <Button variant="outline" disabled={refreshing} onClick={onRequery}>
        <RefreshCwIcon className={cn(refreshing && "animate-spin motion-reduce:animate-none")} />
        {refreshing ? "Re-querying…" : "Re-query selected source"}
      </Button>
    </div>
  );
}
