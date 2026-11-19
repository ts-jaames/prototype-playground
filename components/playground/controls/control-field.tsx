"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import { colorOptions, type ColorToken, type Control } from "./schema";

// Static class names so Tailwind generates them.
const SWATCH: Record<ColorToken, string> = {
  "chart-1": "bg-chart-1",
  "chart-2": "bg-chart-2",
  "chart-3": "bg-chart-3",
  "chart-4": "bg-chart-4",
  "chart-5": "bg-chart-5",
  primary: "bg-primary",
  foreground: "bg-foreground",
};

type Props = {
  id: string;
  control: Control;
  value: unknown;
  onChange: (value: unknown) => void;
};

export function ControlField({ id, control, value, onChange }: Props) {
  switch (control.type) {
    case "slider":
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <Label htmlFor={id}>{control.label}</Label>
            <span className="text-muted-foreground tabular-nums">
              {value as number}
              {control.unit}
            </span>
          </div>
          <Slider
            id={id}
            className="h-11 sm:h-7"
            min={control.min}
            max={control.max}
            step={control.step ?? 1}
            value={[value as number]}
            onValueChange={([v]) => onChange(v)}
            aria-label={control.label}
          />
        </div>
      );

    case "toggle":
      return (
        <Label htmlFor={id} className="flex h-11 items-center justify-between sm:h-8">
          {control.label}
          <Switch id={id} checked={value as boolean} onCheckedChange={onChange} />
        </Label>
      );

    case "select":
      return (
        <div className="flex flex-col gap-2">
          <Label htmlFor={id}>{control.label}</Label>
          <Select value={value as string} onValueChange={onChange}>
            <SelectTrigger id={id} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {control.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case "color":
      return (
        <div className="flex flex-col gap-2">
          <Label id={id}>{control.label}</Label>
          <div role="radiogroup" aria-labelledby={id} className="flex flex-wrap gap-1">
            {colorOptions(control).map((token) => (
              <button
                key={token}
                type="button"
                role="radio"
                aria-checked={value === token}
                aria-label={token}
                onClick={() => onChange(token)}
                className="flex size-11 items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:size-8"
              >
                <span
                  className={cn(
                    "size-7 rounded-full ring-offset-2 ring-offset-background transition-shadow duration-200 sm:size-6",
                    SWATCH[token],
                    value === token && "ring-2 ring-foreground",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      );
  }
}
