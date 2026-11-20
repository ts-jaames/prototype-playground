import { cn } from "@/lib/utils";

import type { Cursor, Insight } from "./types";

const LABEL: Record<Insight["kind"], string> = {
  stripe: "Broken change",
  flaky: "Flaky",
  stuck: "Stuck",
};

/** What the eye would find, written down. Tapping jumps the cursor to the evidence. */
export function Insights({
  insights,
  onJump,
}: {
  insights: Insight[];
  onJump: (cursor: Cursor) => void;
}) {
  if (insights.length === 0) {
    return <p className="text-sm text-muted-foreground">No stripes. Everything looks stable.</p>;
  }
  return (
    <ul className="divide-y divide-border border-y border-border">
      {insights.map((insight) => (
        <li key={insight.text}>
          <button
            type="button"
            onClick={() => onJump(insight.cursor)}
            className="flex min-h-11 w-full items-center gap-2 text-left text-sm"
          >
            <span
              className={cn(
                "w-24 shrink-0 text-xs",
                insight.kind === "stripe" ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {LABEL[insight.kind]}
            </span>
            <span className="min-w-0 truncate">{insight.text}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
