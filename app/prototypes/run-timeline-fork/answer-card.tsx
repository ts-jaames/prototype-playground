import { Badge } from "@/components/ui/badge";

import type { Run } from "./types";

export function AnswerCard({ run, parent, ready }: { run: Run; parent: Run | undefined; ready: boolean }) {
  const changed = parent ? parent.answer.key !== run.answer.key : false;

  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">Answer</p>
        {ready && parent && <Badge variant={changed ? "default" : "outline"}>{changed ? "Changed" : "Same result"}</Badge>}
      </div>
      {ready ? (
        <>
          <p className="text-base font-medium">{run.answer.headline}</p>
          <p className="text-sm text-muted-foreground">{run.answer.detail}</p>
          {parent && changed && (
            <p className="text-xs text-muted-foreground line-through">{parent.answer.headline}</p>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Scrub to the end to see the answer.</p>
      )}
    </div>
  );
}
