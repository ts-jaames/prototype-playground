import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { FAIL_LINES, PASS_LINES } from "./data";
import { failures, transitions } from "./analysis";
import type { CaseRow, Cursor } from "./types";

export function DetailPanel({
  rows,
  runs,
  cursor,
  onCursor,
}: {
  rows: CaseRow[];
  runs: number;
  cursor: Cursor;
  onCursor: (cursor: Cursor) => void;
}) {
  const index = Math.max(0, rows.findIndex((r) => r.id === cursor.caseId));
  const row = rows[index];
  const pass = row.results[cursor.run];
  const lines = pass ? PASS_LINES : FAIL_LINES;
  const line = lines[(index * 7 + cursor.run) % lines.length];

  const moveCase = (d: number) => {
    const next = Math.min(rows.length - 1, Math.max(0, index + d));
    onCursor({ caseId: rows[next].id, run: cursor.run });
  };
  const moveRun = (d: number) => onCursor({ caseId: row.id, run: Math.min(runs - 1, Math.max(0, cursor.run + d)) });

  return (
    <div className="rounded-lg border border-border bg-card p-3 text-card-foreground">
      <div className="flex items-center gap-2">
        <span className="min-w-0 truncate font-mono text-sm">{row.id}</span>
        <Badge variant={pass ? "secondary" : "destructive"}>
          Run {cursor.run + 1} · {pass ? "pass" : "fail"}
        </Badge>
      </div>
      <p className="mt-1.5 font-mono text-xs text-muted-foreground">{line}</p>
      <p className="mt-1 text-xs text-muted-foreground tabular-nums">
        Failed {failures(row)}/{runs} runs · {transitions(row)} flips
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="icon" variant="outline" aria-label="Previous case" onClick={() => moveCase(-1)}>
          <ChevronUpIcon />
        </Button>
        <Button size="icon" variant="outline" aria-label="Next case" onClick={() => moveCase(1)}>
          <ChevronDownIcon />
        </Button>
        <Button size="icon" variant="outline" aria-label="Previous run" onClick={() => moveRun(-1)}>
          <ChevronLeftIcon />
        </Button>
        <Button size="icon" variant="outline" aria-label="Next run" onClick={() => moveRun(1)}>
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}
