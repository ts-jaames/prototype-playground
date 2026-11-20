import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { POLICIES } from "./data";
import type { Policy } from "./types";

const LABEL: Record<Policy, string> = { allow: "Allow", ask: "Ask", block: "Block" };

export function PolicyButtons({
  value,
  label,
  onChange,
}: {
  value: Policy;
  label: string;
  onChange: (next: Policy) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-3 gap-1">
      {POLICIES.map((policy) => {
        const active = value === policy;
        return (
          <Button
            key={policy}
            role="radio"
            aria-checked={active}
            size="sm"
            variant={active ? "secondary" : "ghost"}
            className={cn(
              "w-full",
              active && policy === "block" && "text-destructive",
              !active && "text-muted-foreground",
            )}
            onClick={() => onChange(policy)}
          >
            {LABEL[policy]}
          </Button>
        );
      })}
    </div>
  );
}
