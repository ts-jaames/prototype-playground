import { cn } from "@/lib/utils";

import type { summarize } from "./cases";

type Summary = ReturnType<typeof summarize>;

const pct = (n: number) => `${Math.round(n * 100)}%`;

export function FlipSummary({ summary }: { summary: Summary }) {
  return (
    <div>
      <div className="flex items-baseline gap-5">
        <span className={cn("text-3xl font-semibold tabular-nums", summary.regressions > 0 && "text-destructive")}>
          {summary.regressions}
          <span className="ml-1.5 text-sm font-normal text-muted-foreground">regressions</span>
        </span>
        <span className="text-3xl font-semibold text-chart-2 tabular-nums">
          {summary.fixes}
          <span className="ml-1.5 text-sm font-normal text-muted-foreground">fixes</span>
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground tabular-nums">
        Pass rate {pct(summary.baselinePass)} → {pct(summary.candidatePass)} · {summary.unchanged} unchanged ·{" "}
        {summary.noise} below noise floor
      </p>
    </div>
  );
}
