"use client";

import { useState } from "react";

import { Collapse } from "@/components/playground/collapse";
import { ControlPanel, ControlsLayout, useControls } from "@/components/playground/controls";
import { Badge } from "@/components/ui/badge";

import { AskCard } from "./ask-card";
import { controls as schema, NAMESPACE } from "./data";
import { RunningStrip } from "./running-strip";
import { sortedAsks } from "./simulation";
import type { Resolution } from "./types";
import { useQueue } from "./use-queue";

export function AttentionQueue() {
  const controls = useControls(NAMESPACE, schema);
  const { paused, ...rest } = controls.values;
  const { state, resolve } = useQueue(rest, paused);
  // Asks animate closed first; the agent only resumes once the card has left.
  const [leaving, setLeaving] = useState<Record<string, Resolution>>({});

  const asks = sortedAsks(state.agents, state.tick, rest.sort);

  return (
    <ControlsLayout panel={<ControlPanel controls={controls} />}>
      <section aria-label="Needs you">
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-sm font-medium">Needs you</h2>
          <Badge variant={asks.length > 0 ? "default" : "secondary"}>{asks.length}</Badge>
        </div>

        {asks.map((agent) => (
          <AskCard
            key={agent.ask!.id}
            agent={agent}
            tick={state.tick}
            leaving={agent.id in leaving}
            onResolve={(resolution) => setLeaving((l) => ({ ...l, [agent.id]: resolution }))}
            onExited={() => {
              const resolution = leaving[agent.id];
              if (resolution) resolve(agent.id, resolution);
              setLeaving((l) => {
                const next = { ...l };
                delete next[agent.id];
                return next;
              });
            }}
          />
        ))}

        <Collapse open={asks.length === 0}>
          <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            Nothing needs you.
          </p>
        </Collapse>
      </section>

      <RunningStrip agents={state.agents} />
    </ControlsLayout>
  );
}
