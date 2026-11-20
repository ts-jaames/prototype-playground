import { Badge } from "@/components/ui/badge";

import { PolicyButtons } from "./policy-buttons";
import { Sparkline } from "./sparkline";
import type { Policy, ToolDef, ToolStats } from "./types";

export function ToolRow({
  tool,
  stats,
  policy,
  onPolicy,
}: {
  tool: ToolDef;
  stats: ToolStats;
  policy: Policy;
  onPolicy: (next: Policy) => void;
}) {
  return (
    <div className="space-y-2 py-3">
      <div className="flex items-center gap-2">
        <span className="min-w-0 truncate font-mono text-sm">{tool.name}</span>
        <Badge variant={tool.risk === "destructive" ? "destructive" : "outline"}>{tool.risk}</Badge>
        <span className="ml-auto flex items-center gap-2 text-muted-foreground">
          <Sparkline values={stats.buckets} className="text-chart-2" />
          <span className="w-14 text-right text-xs tabular-nums">
            {stats.total}
            {stats.errors > 0 && <span className="text-destructive"> · {stats.errors}e</span>}
          </span>
        </span>
      </div>
      <PolicyButtons value={policy} label={`${tool.name} policy`} onChange={onPolicy} />
    </div>
  );
}
