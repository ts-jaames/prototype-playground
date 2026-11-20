import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { Period, Tool } from "./types";

export function ToolLine({
  tool,
  period,
  unused,
  pruned,
  onToggle,
}: {
  tool: Tool;
  period: Period;
  unused: boolean;
  pruned: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className={cn("min-w-0 flex-1", pruned && "opacity-50")}>
        <p className="truncate font-mono text-sm">{tool.name}</p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {tool.tokens} tok · {tool.calls[period]} calls
          {unused && !pruned && <span className="text-chart-4"> · never called</span>}
        </p>
      </div>
      <Button size="sm" variant={pruned ? "outline" : "secondary"} aria-pressed={pruned} onClick={onToggle}>
        {pruned ? "Pruned" : "Loaded"}
      </Button>
    </div>
  );
}
