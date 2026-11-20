import { Collapse } from "@/components/playground/collapse";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { DecisionBar } from "./decision-bar";
import { EvidenceList } from "./evidence-list";
import { unmet } from "./run";
import type { Decision, GateState, GateStatus } from "./types";

const STATUS: Record<GateStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  locked: { label: "Locked", variant: "outline" },
  working: { label: "Working", variant: "secondary" },
  awaiting: { label: "Needs your decision", variant: "default" },
  passed: { label: "Passed", variant: "secondary" },
  stopped: { label: "Stopped", variant: "destructive" },
};

export function GateRow({
  index,
  name,
  gate,
  onDecide,
}: {
  index: number;
  name: string;
  gate: GateState;
  onDecide: (d: Decision) => void;
}) {
  const { label, variant } = STATUS[gate.status];
  const met = (gate.evidence?.length ?? 0) - unmet(gate);

  return (
    <section
      aria-label={`Gate ${index + 1}: ${name}`}
      className={cn(
        "rounded-lg border border-border p-3 transition-colors duration-300",
        gate.status === "awaiting" && "border-ring bg-card",
        gate.status === "locked" && "text-muted-foreground",
      )}
    >
      <div className="flex min-h-7 items-center gap-2">
        <span className="w-4 text-xs text-muted-foreground tabular-nums">{index + 1}</span>
        <h2 className="text-sm font-medium">{name}</h2>
        <Badge variant={variant} className="ml-auto">
          {label}
        </Badge>
      </div>

      <Collapse open={gate.status === "working"}>
        <div className="pt-2 pl-6">
          <div className="h-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-chart-2 transition-[width] duration-200 ease-linear"
              style={{ width: `${gate.work}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground tabular-nums">
            {gate.attempts > 0 && gate.note ? `${gate.note} · ` : ""}
            collecting evidence · {Math.round(gate.work)}%
          </p>
        </div>
      </Collapse>

      <Collapse open={gate.status === "awaiting"}>
        <div className="pt-2 pl-6">
          {gate.evidence && <EvidenceList evidence={gate.evidence} />}
          <DecisionBar unmet={unmet(gate)} onDecide={onDecide} />
        </div>
      </Collapse>

      <Collapse open={gate.status === "passed"}>
        <p className="pt-1 pl-6 text-xs text-muted-foreground tabular-nums">
          {met}/{gate.evidence?.length ?? 0} criteria met
          {gate.waived > 0 ? ` · ${gate.waived} waived` : ""}
          {gate.note ? ` · after “${gate.note}”` : ""}
        </p>
      </Collapse>
    </section>
  );
}
