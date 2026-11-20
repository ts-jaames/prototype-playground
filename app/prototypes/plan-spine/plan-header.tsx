import { RotateCcwIcon, SplitIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { START_MINUTE } from "./data";
import { formatClock, formatDelta } from "./sim";
import type { Projection } from "./types";

export function PlanHeader({
  projection,
  replans,
  finished,
  onReplan,
  onRestart,
}: {
  projection: Projection;
  replans: number;
  finished: boolean;
  onReplan: () => void;
  onRestart: () => void;
}) {
  const slip = projection.eta - projection.planEnd;
  const late = slip > projection.planEnd * 0.1;

  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-semibold tabular-nums">{formatClock(projection.eta, START_MINUTE)}</span>
        <span className="text-sm text-muted-foreground">{finished ? "finished" : "ETA"}</span>
        <Badge variant={late ? "destructive" : "secondary"}>{formatDelta(slip)} vs plan</Badge>
      </div>
      <p className="mt-1 text-xs text-muted-foreground tabular-nums">
        Plan was {formatClock(projection.planEnd, START_MINUTE)} · pace {projection.pace.toFixed(2)}×
        {replans > 0 ? ` · replanned ${replans}×` : ""}
      </p>
      <div className="mt-3 flex gap-2">
        <Button variant="outline" disabled={finished || Math.abs(slip) < 1} onClick={onReplan}>
          <SplitIcon />
          <span className="hidden sm:inline">Replan from actuals</span>
          <span className="sm:hidden">Replan</span>
        </Button>
        <Button variant="ghost" onClick={onRestart}>
          <RotateCcwIcon />
          <span className="hidden sm:inline">Restart</span>
          <span className="sr-only sm:hidden">Restart</span>
        </Button>
      </div>
    </div>
  );
}
