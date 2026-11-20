"use client";

import { ControlPanel, ControlsLayout, useControls } from "@/components/playground/controls";

import { controls as schema, FEED_SIZE, NAMESPACE, SERVERS } from "./data";
import { LiveFeed } from "./live-feed";
import { feedCalls, toolStats } from "./simulation";
import { ToolRow } from "./tool-row";
import { useLedger } from "./use-ledger";
import { usePolicy } from "./use-policy";

export function CallLedger() {
  const controls = useControls(NAMESPACE, schema);
  const { paused, callRate, errorRate } = controls.values;
  const { policy, setToolPolicy } = usePolicy();
  const { state, decide } = useLedger(policy, { callRate, errorRate }, paused);
  const stats = toolStats(state.calls, state.tick);

  return (
    <ControlsLayout panel={<ControlPanel controls={controls} />}>
      <LiveFeed calls={feedCalls(state.calls, FEED_SIZE)} onDecide={decide} />

      {SERVERS.map((server) => (
        <section key={server.id} aria-label={server.label}>
          <h2 className="border-b border-border pb-1 font-mono text-xs font-medium text-muted-foreground">
            {server.label}
          </h2>
          <div className="divide-y divide-border">
            {server.tools.map((tool) => (
              <ToolRow
                key={tool.id}
                tool={tool}
                stats={stats[tool.id]}
                policy={policy[tool.id]}
                onPolicy={(next) => setToolPolicy(tool.id, next)}
              />
            ))}
          </div>
        </section>
      ))}
    </ControlsLayout>
  );
}
