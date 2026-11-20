import { Button } from "@/components/ui/button";

import { TOOLS } from "./data";
import type { Grants, LogEntry } from "./types";

const VERB = { allowed: "Allowed", denied: "Denied", used: "Used", revoked: "Revoked" } as const;
const SCOPE_LABEL = { once: "once", task: "for this task", always: "always", deny: "" } as const;
const label = (id: string) => TOOLS.find((t) => t.id === id)?.label ?? id;

type Props = { grants: Grants; log: LogEntry[]; onRevoke: (toolId: string) => void };

export function AuditList({ grants, log, onRevoke }: Props) {
  const active = Object.entries(grants).filter(([, g]) => g.usesLeft !== 0);

  return (
    <div className="flex flex-col gap-4">
      {active.length > 0 && (
        <section className="flex flex-col gap-1">
          <h2 className="text-xs font-medium text-muted-foreground">Active permissions</h2>
          <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card px-3">
            {active.map(([toolId, g]) => (
              <li key={toolId} className="flex min-h-11 items-center justify-between gap-2 py-1">
                <span className="text-sm">
                  {label(toolId)} <span className="text-muted-foreground">· {SCOPE_LABEL[g.scope]}</span>
                </span>
                <Button variant="ghost" onClick={() => onRevoke(toolId)} aria-label={`Revoke ${label(toolId)}`}>
                  Revoke
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-1">
        <h2 className="text-xs font-medium text-muted-foreground">Audit trail</h2>
        {log.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing yet.</p>
        ) : (
          <ol className="flex flex-col gap-1">
            {[...log].reverse().map((e) => (
              <li key={e.id} className="text-sm">
                <span className="font-medium">{VERB[e.kind]}</span> {label(e.toolId).toLowerCase()}
                {e.scope && e.scope !== "deny" && e.kind === "allowed" ? ` ${SCOPE_LABEL[e.scope]}` : ""}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
