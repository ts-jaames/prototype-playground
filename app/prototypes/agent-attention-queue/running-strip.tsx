import { Collapse } from "@/components/playground/collapse";

import type { Agent } from "./types";

/** The quiet half of the screen: running agents recede to one thin line each. */
export function RunningStrip({ agents }: { agents: Agent[] }) {
  const running = agents.filter((a) => a.state === "running").length;
  const finished = agents.filter((a) => a.state === "done").length;
  const stopped = agents.filter((a) => a.state === "stopped").length;

  return (
    <section aria-label="Running agents">
      <h2 className="mb-2 text-xs font-medium text-muted-foreground">Running · {running}</h2>
      <div>
        {agents.map((agent) => (
          <Collapse key={agent.id} open={agent.state === "running"}>
            <div className="py-1.5">
              <div className="flex items-baseline gap-2 text-sm">
                <span className="shrink-0">{agent.name}</span>
                <span className="min-w-0 truncate text-xs text-muted-foreground">{agent.task}</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-chart-2 transition-[width] duration-1000 ease-linear"
                  style={{ width: `${agent.progress}%` }}
                />
              </div>
            </div>
          </Collapse>
        ))}
      </div>
      {(finished > 0 || stopped > 0) && (
        <p className="mt-3 text-xs text-muted-foreground">
          {finished} done{stopped > 0 ? ` · ${stopped} stopped` : ""}
        </p>
      )}
    </section>
  );
}
