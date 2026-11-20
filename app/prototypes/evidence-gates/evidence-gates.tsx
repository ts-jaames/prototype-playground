"use client";

import { ControlPanel, ControlsLayout, useControls } from "@/components/playground/controls";
import { Button } from "@/components/ui/button";

import { controls as schema, GATES, NAMESPACE } from "./data";
import { GateRow } from "./gate-row";
import { useRun } from "./use-run";

export function EvidenceGates() {
  const controls = useControls(NAMESPACE, schema);
  const { quality, speed, paused } = controls.values;
  const { state, decide, restart } = useRun(quality, speed, paused);

  const stopped = state.gates.find((g) => g.status === "stopped");
  const finished = state.gates.every((g) => g.status === "passed");

  return (
    <ControlsLayout panel={<ControlPanel controls={controls} />}>
      <div className="space-y-2">
        {GATES.map((gate, i) => (
          <GateRow
            key={gate.id}
            index={i}
            name={gate.name}
            gate={state.gates[i]}
            onDecide={(decision) => decide(i, decision)}
          />
        ))}
      </div>

      {(stopped || finished) && (
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">{finished ? "Run complete." : "Run stopped."}</p>
          <Button variant="outline" onClick={restart}>
            Restart
          </Button>
        </div>
      )}
    </ControlsLayout>
  );
}
