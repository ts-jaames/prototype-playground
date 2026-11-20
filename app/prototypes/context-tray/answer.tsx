"use client";

import { Collapse } from "@/components/playground/collapse";
import { Badge } from "@/components/ui/badge";

import { CLAIMS, SOURCES } from "./data";
import type { SourceId, Verdict } from "./types";

type Props = { active: ReadonlySet<SourceId>; verdict: Verdict };

const LABELS = Object.fromEntries(SOURCES.map((s) => [s.id, s.label]));

export function Answer({ active, verdict }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-muted-foreground">Verdict</p>
          <p key={verdict.label} className="animate-in text-base font-medium duration-300 fade-in">
            {verdict.label}
          </p>
        </div>
        <Badge variant="secondary" className="tabular-nums">
          {verdict.claims} claims
        </Badge>
      </div>

      <ul className="flex flex-col">
        {SOURCES.flatMap((s) => CLAIMS.filter((c) => c.source === s.id)).map((claim) => {
          const open = active.has(claim.source);
          return (
            <li key={claim.id}>
              <Collapse open={open}>
                <div inert={!open} className="flex flex-col gap-0.5 py-2">
                  <p className="text-sm">{claim.text}</p>
                  <p className="text-xs text-muted-foreground">{LABELS[claim.source]}</p>
                </div>
              </Collapse>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
