import { cn } from "@/lib/utils";

import { ROW_H } from "./spine";
import { formatDelta } from "./sim";
import type { StepProjection, StepRun } from "./types";

export function StepLabel({ step, projection }: { step: StepRun; projection: StepProjection }) {
  const { status, duration } = projection;
  const delta = duration - step.planned;
  const late = delta > step.planned * 0.1;
  const early = delta < -step.planned * 0.1;

  return (
    <div style={{ height: ROW_H }} className="flex flex-col justify-center pl-[116px]">
      <p className={cn("text-sm", status === "active" ? "font-medium" : status === "pending" && "text-muted-foreground")}>
        {step.name}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
        {status === "active" && `${Math.round(step.progress * 100)}% · `}
        plan {Math.round(step.planned)}m · {status === "done" ? "took" : "proj"} {Math.round(duration)}m{" "}
        <span className={cn(late && "text-destructive", early && "text-chart-2")}>{formatDelta(delta)}</span>
      </p>
    </div>
  );
}
