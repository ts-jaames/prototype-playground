import { cn } from "@/lib/utils";

import type { Evidence } from "./types";

export function EvidenceList({ evidence }: { evidence: Evidence[] }) {
  return (
    <ul className="divide-y divide-border">
      {evidence.map((e) => (
        <li key={e.label} className="flex min-h-9 items-center gap-2 py-1.5 text-sm">
          <span aria-hidden className={cn("size-2 shrink-0 rounded-full", e.met ? "bg-chart-2" : "bg-destructive")} />
          <span className="min-w-0 flex-1 truncate">{e.label}</span>
          <span className={cn("tabular-nums", !e.met && "font-medium text-destructive")}>{e.value}</span>
          <span className="w-20 text-right text-xs text-muted-foreground tabular-nums">{e.target}</span>
          <span className="sr-only">{e.met ? "met" : "missed"}</span>
        </li>
      ))}
    </ul>
  );
}
