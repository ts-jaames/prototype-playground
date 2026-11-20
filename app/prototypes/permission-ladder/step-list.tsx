import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { STEPS } from "./data";
import type { StepResult } from "./types";

type Props = {
  index: number;
  started: boolean;
  waiting: boolean;
  results: Record<number, StepResult>;
};

export function StepList({ index, started, waiting, results }: Props) {
  return (
    <ol className="flex flex-col">
      {STEPS.map((step, i) => {
        const result = results[i];
        const current = started && i === index;
        return (
          <li
            key={step.id}
            className={cn(
              "flex min-h-11 items-center justify-between gap-3 py-2",
              started && !result && !current && "text-muted-foreground opacity-60",
            )}
          >
            <span className="flex min-w-0 flex-col">
              <span className="text-sm">{step.text}</span>
              <span className="truncate font-mono text-xs text-muted-foreground">{step.toolId}</span>
            </span>
            {result ? (
              <Badge variant={result === "done" ? "secondary" : "outline"}>
                {result === "done" ? "Done" : "Skipped"}
              </Badge>
            ) : current ? (
              <Badge variant="default">{waiting ? "Needs approval" : "Working"}</Badge>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
