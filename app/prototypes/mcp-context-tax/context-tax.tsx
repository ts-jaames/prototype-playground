"use client";

import { useState } from "react";

import { ControlPanel, ControlsLayout, useControls } from "@/components/playground/controls";
import { Button } from "@/components/ui/button";

import { BudgetBar } from "./budget-bar";
import { controls as schema, NAMESPACE, SERVERS } from "./data";
import { ServerRow } from "./server-row";
import { formatTokens, totals as computeTotals, unusedLoaded } from "./tax";

export function ContextTax() {
  const controls = useControls(NAMESPACE, schema);
  const { period, budget, threshold } = controls.values;
  const [pruned, setPruned] = useState<ReadonlySet<string>>(new Set());

  const totals = computeTotals(SERVERS, pruned, period, threshold);
  const allUnused = SERVERS.flatMap((s) => unusedLoaded(s, pruned, period, threshold).map((t) => t.id));

  const toggle = (id: string) =>
    setPruned((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const pruneMany = (ids: string[]) => setPruned((prev) => new Set([...prev, ...ids]));

  return (
    <ControlsLayout panel={<ControlPanel controls={controls} />}>
      <BudgetBar totals={totals} budgetTokens={budget * 1000} />

      <div className="flex flex-wrap gap-2">
        <Button disabled={allUnused.length === 0} onClick={() => pruneMany(allUnused)}>
          {allUnused.length > 0
            ? `Prune all unused (−${formatTokens(totals.reclaimable)})`
            : "No unused tools"}
        </Button>
        <Button variant="outline" disabled={pruned.size === 0} onClick={() => setPruned(new Set())}>
          Restore all
        </Button>
      </div>

      <div className="divide-y divide-border">
        {SERVERS.map((server) => (
          <ServerRow
            key={server.id}
            server={server}
            pruned={pruned}
            period={period}
            threshold={threshold}
            onToggleTool={toggle}
            onPruneUnused={pruneMany}
          />
        ))}
      </div>
    </ControlsLayout>
  );
}
