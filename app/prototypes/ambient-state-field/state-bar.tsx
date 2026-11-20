"use client";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { STATES } from "./data";
import type { AgentState } from "./types";

type Props = {
  state: AgentState;
  demoRunning: boolean;
  onState: (s: AgentState) => void;
  onDemo: () => void;
};

export function StateBar({ state, demoRunning, onState, onDemo }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup
        type="single"
        value={state}
        onValueChange={(v) => v && onState(v as AgentState)}
        className="flex-wrap"
        aria-label="Agent state"
      >
        {STATES.map((s) => (
          <ToggleGroupItem key={s.id} value={s.id} variant="outline" className="min-h-11">
            {s.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Button className="self-start" onClick={onDemo} disabled={demoRunning}>
        {demoRunning ? "Running…" : "Run demo"}
      </Button>
    </div>
  );
}
