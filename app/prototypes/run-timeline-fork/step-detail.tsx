"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { INPUT_LABELS, OPTIONS } from "./data";
import type { Inputs, Step } from "./types";

type Props = {
  step: Step;
  inputs: Inputs;
  canFork: boolean;
  onFork: (value: string) => void;
};

export function StepDetail({ step, inputs, canFork, onFork }: Props) {
  const key = step.inputKey;
  const current = key ? inputs[key] : null;
  const [draft, setDraft] = useState<string | null>(current);

  return (
    <div className="flex flex-col gap-3 px-3 pb-3 pl-10">
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt className="text-muted-foreground">Args</dt>
        <dd className="font-mono break-words">{step.args}</dd>
        <dt className="text-muted-foreground">Result</dt>
        <dd className="break-words">{step.result}</dd>
      </dl>

      {key && draft ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={draft} onValueChange={setDraft}>
            <SelectTrigger className="w-full sm:flex-1" aria-label={INPUT_LABELS[key]}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OPTIONS[key].map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button disabled={draft === current || !canFork} onClick={() => onFork(draft)}>
            Fork from here
          </Button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Derived from earlier steps. Fork from step 1, 2 or 3 to change it.
        </p>
      )}
      {key && !canFork && <p className="text-xs text-muted-foreground">Run limit reached.</p>}
    </div>
  );
}
