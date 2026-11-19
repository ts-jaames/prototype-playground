"use client";

import { RotateCcwIcon, ShuffleIcon } from "lucide-react";
import { useId } from "react";

import { Button } from "@/components/ui/button";

import { ControlField } from "./control-field";
import type { ControlSchema } from "./schema";
import type { ControlsApi } from "./use-controls";

export function ControlPanel<S extends ControlSchema>({
  controls,
  children,
}: {
  controls: ControlsApi<S>;
  /** Extra prototype-specific actions rendered above Reset / Randomize. */
  children?: React.ReactNode;
}) {
  const baseId = useId();
  const { schema, values, set, reset, randomize } = controls;

  return (
    <div className="flex flex-col gap-5">
      {Object.entries(schema).map(([key, control]) => (
        <ControlField
          key={key}
          id={`${baseId}-${key}`}
          control={control}
          value={values[key]}
          onChange={(value) => set(key, value as never)}
        />
      ))}
      {children}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={reset}>
          <RotateCcwIcon />
          Reset
        </Button>
        <Button onClick={randomize}>
          <ShuffleIcon />
          Randomize
        </Button>
      </div>
    </div>
  );
}
