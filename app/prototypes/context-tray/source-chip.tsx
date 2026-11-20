"use client";

import { Button } from "@/components/ui/button";

import { CLAIMS } from "./data";
import type { Source } from "./types";

type Props = { source: Source; on: boolean; onToggle: () => void };

export function SourceChip({ source, on, onToggle }: Props) {
  const count = CLAIMS.filter((c) => c.source === source.id).length;
  return (
    <Button
      variant={on ? "default" : "outline"}
      aria-pressed={on}
      onClick={onToggle}
      className="h-auto min-h-11 flex-col items-start gap-0 py-1.5"
    >
      <span>{source.label}</span>
      <span className="font-mono text-[0.65rem] font-normal opacity-70">
        {on ? `${count} claims` : "off"}
      </span>
    </Button>
  );
}
