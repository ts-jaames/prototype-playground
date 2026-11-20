"use client";

import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { SOURCE_LABELS } from "./data";
import { formatAge, hasConflict, selectedReading, STALE_AFTER_MINUTES } from "./format";
import { SourcePopover } from "./source-popover";
import type { FieldDef, FieldState, SourceId } from "./types";

type Props = {
  def: FieldDef;
  state: FieldState;
  refreshing: boolean;
  onSelect: (source: SourceId) => void;
  onRequery: () => void;
};

export function FieldRow({ def, state, refreshing, onSelect, onRequery }: Props) {
  const reading = selectedReading(state);
  const stale = reading.minutesAgo >= STALE_AFTER_MINUTES;
  const conflict = hasConflict(state);

  return (
    <div className="flex min-h-11 items-center justify-between gap-3 py-1">
      <div className="flex min-w-0 flex-col">
        <span className="text-xs text-muted-foreground">{def.label}</span>
        <span className="text-base font-medium tabular-nums">{reading.value}</span>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`${def.label} sources`}
            className="flex min-h-11 max-w-[60%] shrink-0 items-center gap-1.5 rounded-lg px-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-muted"
          >
            {conflict && <Badge variant="outline">differs</Badge>}
            <Badge variant={stale ? "destructive" : "secondary"} className="max-w-full">
              <span className="truncate">
                {SOURCE_LABELS[reading.source]} · {formatAge(reading.minutesAgo)}
              </span>
            </Badge>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[min(22rem,calc(100vw-2rem))]">
          <SourcePopover state={state} refreshing={refreshing} onSelect={onSelect} onRequery={onRequery} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
