import { cn } from "@/lib/utils";

/** Baseline over candidate, with a tick at the pass bar. */
export function ScoreBars({
  baseline,
  candidate,
  passBar,
  tone,
}: {
  baseline: number;
  candidate: number;
  passBar: number;
  tone: "good" | "bad";
}) {
  return (
    <div aria-hidden className="relative w-full space-y-1">
      <div className="h-1 rounded-full bg-muted">
        <div className="h-full rounded-full bg-muted-foreground/50" style={{ width: `${baseline * 100}%` }} />
      </div>
      <div className="h-1 rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", tone === "good" ? "bg-chart-2" : "bg-destructive")}
          style={{ width: `${candidate * 100}%` }}
        />
      </div>
      <span className="absolute inset-y-0 w-px bg-foreground/60" style={{ left: `${passBar * 100}%` }} />
    </div>
  );
}
