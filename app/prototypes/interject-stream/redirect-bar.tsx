import { Button } from "@/components/ui/button";

import { DIRECTIVES } from "./data";
import type { Directive } from "./types";

type Props = { onChoose: (d: Directive) => void; onCancel: () => void };

export function RedirectBar({ onChoose, onCancel }: Props) {
  return (
    <div className="sticky bottom-[max(1rem,env(safe-area-inset-bottom))] z-10 flex animate-in flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-lg duration-300 fade-in slide-in-from-bottom-2">
      <p className="text-xs text-muted-foreground">Paused. Redirect from here:</p>
      <div className="flex flex-wrap gap-2">
        {DIRECTIVES.map((d) => (
          <Button key={d.id} variant="outline" onClick={() => onChoose(d.id)}>
            {d.label}
          </Button>
        ))}
        <Button variant="ghost" onClick={onCancel}>
          Keep going
        </Button>
      </div>
    </div>
  );
}
