import { Collapse } from "@/components/playground/collapse";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { TOOL_BY_ID } from "./data";
import type { Call, CallStatus } from "./types";

const DOT: Record<CallStatus, string> = {
  ok: "bg-chart-2",
  error: "bg-destructive",
  pending: "bg-chart-4",
  blocked: "bg-muted-foreground",
  denied: "bg-muted-foreground",
};

export function LiveFeed({
  calls,
  onDecide,
}: {
  calls: Call[];
  onDecide: (callId: number, approve: boolean) => void;
}) {
  return (
    <section aria-label="Live calls">
      <h2 className="mb-1 text-xs font-medium text-muted-foreground">Live</h2>
      <ul>
        {calls.map((call) => {
          const tool = TOOL_BY_ID[call.toolId];
          return (
            <li key={call.id}>
              <Collapse>
                <div className="flex items-center gap-2 py-1.5">
                  <span aria-hidden className={cn("size-2 shrink-0 rounded-full", DOT[call.status])} />
                  <span className="min-w-0 truncate font-mono text-xs">
                    <span className="text-muted-foreground">{tool.server}.</span>
                    {tool.name}
                  </span>
                  {call.status === "pending" ? (
                    <span className="ml-auto flex shrink-0 gap-1">
                      <Button size="xs" onClick={() => onDecide(call.id, true)}>
                        Approve
                      </Button>
                      <Button size="xs" variant="outline" onClick={() => onDecide(call.id, false)}>
                        Deny
                      </Button>
                    </span>
                  ) : (
                    <span className="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums">
                      {call.status === "blocked" || call.status === "denied"
                        ? call.status
                        : `${call.ms}ms`}
                    </span>
                  )}
                </div>
              </Collapse>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
