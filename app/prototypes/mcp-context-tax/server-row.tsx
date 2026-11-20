"use client";

import { useState } from "react";

import { Collapse } from "@/components/playground/collapse";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { formatTokens, isUnused, sumTokens, unusedLoaded } from "./tax";
import { ToolLine } from "./tool-line";
import type { Period, Server } from "./types";

export function ServerRow({
  server,
  pruned,
  period,
  threshold,
  onToggleTool,
  onPruneUnused,
}: {
  server: Server;
  pruned: ReadonlySet<string>;
  period: Period;
  threshold: number;
  onToggleTool: (toolId: string) => void;
  onPruneUnused: (toolIds: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const loaded = server.tools.filter((t) => !pruned.has(t.id));
  const reclaimable = unusedLoaded(server, pruned, period, threshold);
  const sorted = [...server.tools].sort((a, b) => b.tokens - a.tokens);

  return (
    <div className="py-3">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full flex-col justify-center gap-2 text-left"
      >
        <span className="flex items-baseline gap-2">
          <span className="font-mono text-sm">{server.label}</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {formatTokens(sumTokens(loaded))} tok · {loaded.length}/{server.tools.length} tools
          </span>
          <span className="ml-auto text-xs text-muted-foreground">{reclaimable.length > 0 ? `${reclaimable.length} unused` : "all called"}</span>
        </span>
        <span aria-hidden className="flex h-2 gap-px">
          {server.tools.map((tool) => {
            const isPruned = pruned.has(tool.id);
            return (
              <span
                key={tool.id}
                style={{ flexGrow: tool.tokens, flexBasis: 0 }}
                className={cn(
                  "rounded-[2px] transition-colors duration-300",
                  isPruned
                    ? "bg-border"
                    : isUnused(tool, period, threshold)
                      ? "bg-chart-4"
                      : "bg-chart-2",
                )}
              />
            );
          })}
        </span>
      </button>

      <Collapse open={open}>
        <div className="pt-2">
          <Button
            size="sm"
            variant="outline"
            disabled={reclaimable.length === 0}
            onClick={() => onPruneUnused(reclaimable.map((t) => t.id))}
          >
            {reclaimable.length > 0
              ? `Prune ${reclaimable.length} unused (−${formatTokens(sumTokens(reclaimable))})`
              : "Nothing to prune"}
          </Button>
          <div className="mt-2 divide-y divide-border">
            {sorted.map((tool) => (
              <ToolLine
                key={tool.id}
                tool={tool}
                period={period}
                unused={isUnused(tool, period, threshold)}
                pruned={pruned.has(tool.id)}
                onToggle={() => onToggleTool(tool.id)}
              />
            ))}
          </div>
        </div>
      </Collapse>
    </div>
  );
}
