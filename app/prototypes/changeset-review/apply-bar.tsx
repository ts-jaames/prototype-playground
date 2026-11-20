"use client";

import { Button } from "@/components/ui/button";

type Props = {
  accepted: number;
  rejected: number;
  pending: number;
  applying: boolean;
  done: boolean;
  onApply: () => void;
  onReset: () => void;
};

export function ApplyBar({ accepted, rejected, pending, applying, done, onApply, onReset }: Props) {
  return (
    <div className="sticky bottom-[max(1rem,env(safe-area-inset-bottom))] z-10 flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-lg">
      <p className="text-sm text-muted-foreground tabular-nums">
        {done
          ? `${accepted} applied · ${rejected} skipped`
          : `${accepted} accepted · ${rejected} rejected · ${pending} pending`}
      </p>
      {done ? (
        <Button variant="outline" onClick={onReset}>
          Start over
        </Button>
      ) : (
        <Button disabled={accepted === 0 || applying} onClick={onApply}>
          {applying ? "Applying…" : `Apply ${accepted}`}
        </Button>
      )}
    </div>
  );
}
