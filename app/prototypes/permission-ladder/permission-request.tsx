"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { RISK_LABELS, RUNGS } from "./data";
import { isOffered } from "./rules";
import type { Scope, Tool } from "./types";

type Props = { tool: Tool; stepText: string; onChoose: (scope: Scope) => void };

export function PermissionRequest({ tool, stepText, onChoose }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary bg-card p-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">{tool.label}</p>
          <Badge variant={tool.risk === "read" ? "secondary" : "outline"}>{RISK_LABELS[tool.risk]}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">To: {stepText.toLowerCase()}</p>
        <p className="font-mono text-xs text-muted-foreground">{tool.id}</p>
      </div>

      <ul className="flex flex-col gap-1.5">
        {RUNGS.map((r) => {
          const offered = isOffered(tool.risk, r.scope);
          return (
            <li key={r.scope}>
              <button
                type="button"
                disabled={!offered}
                onClick={() => onChoose(r.scope)}
                className={cn(
                  "flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                  offered ? "border-border active:bg-muted" : "border-transparent opacity-40",
                  r.scope === "deny" && "text-muted-foreground",
                )}
              >
                <span className="font-medium">{r.label}</span>
                <span className="text-xs text-muted-foreground">
                  {offered ? r.hint : tool.risk === "send" ? "Sending always asks" : "Not offered for changes"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
