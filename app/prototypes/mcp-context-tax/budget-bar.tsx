import { cn } from "@/lib/utils";

import { formatTokens, type Totals } from "./tax";

export function BudgetBar({ totals, budgetTokens }: { totals: Totals; budgetTokens: number }) {
  const over = totals.loaded > budgetTokens;
  const scale = Math.max(budgetTokens, totals.loaded);
  const pct = (n: number) => `${(n / scale) * 100}%`;

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className={cn("text-3xl font-semibold tabular-nums", over && "text-destructive")}>
          {formatTokens(totals.loaded)}
        </span>
        <span className="text-sm text-muted-foreground">
          tokens of tool definitions · budget {formatTokens(budgetTokens)}
        </span>
      </div>

      <div className="relative mt-3 flex h-3 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-chart-2 transition-[width] duration-500 ease-(--ease-smooth)"
          style={{ width: pct(totals.loadedUsed) }}
        />
        <div
          className="h-full bg-chart-4 transition-[width] duration-500 ease-(--ease-smooth)"
          style={{ width: pct(totals.loadedUnused) }}
        />
        {over && (
          <span
            aria-hidden
            className="absolute inset-y-0 w-0.5 bg-foreground"
            style={{ left: pct(budgetTokens) }}
          />
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-2 rounded-full bg-chart-2" /> Called {formatTokens(totals.loadedUsed)}
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-2 rounded-full bg-chart-4" /> Never called{" "}
          {formatTokens(totals.loadedUnused)}
        </span>
        {over && <span className="text-destructive">over budget by {formatTokens(totals.loaded - budgetTokens)}</span>}
      </div>
    </div>
  );
}
