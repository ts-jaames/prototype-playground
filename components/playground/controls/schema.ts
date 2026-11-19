// Pure schema helpers: no React, safe to unit test.

export const COLOR_TOKENS = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "primary",
  "foreground",
] as const;
export type ColorToken = (typeof COLOR_TOKENS)[number];

type Base = {
  label: string;
  /** Set false to keep this control out of Randomize (e.g. a pause toggle). */
  randomize?: boolean;
};

export type SliderControl = Base & {
  type: "slider";
  min: number;
  max: number;
  step?: number;
  default: number;
  /** Optional suffix shown after the value, e.g. "px" or "%". */
  unit?: string;
};
export type ToggleControl = Base & { type: "toggle"; default: boolean };
export type SelectControl<V extends string = string> = Base & {
  type: "select";
  options: readonly { value: V; label: string }[];
  default: V;
};
export type ColorControl = Base & {
  type: "color";
  default: ColorToken;
  options?: readonly ColorToken[];
};

export type Control = SliderControl | ToggleControl | SelectControl | ColorControl;
export type ControlSchema = Record<string, Control>;

export type ControlValues<S extends ControlSchema> = {
  -readonly [K in keyof S]: S[K] extends SliderControl
    ? number
    : S[K] extends ToggleControl
      ? boolean
      : S[K] extends SelectControl<infer V>
        ? V
        : S[K] extends ColorControl
          ? ColorToken
          : never;
};

/** Identity helper that keeps literal types for select options. */
export function defineControls<const S extends ControlSchema>(schema: S): S {
  return schema;
}

export function colorOptions(control: ColorControl): readonly ColorToken[] {
  return control.options ?? COLOR_TOKENS.slice(0, 5);
}

export function defaultValues<S extends ControlSchema>(schema: S): ControlValues<S> {
  const out: Record<string, unknown> = {};
  for (const [key, control] of Object.entries(schema)) out[key] = control.default;
  return out as ControlValues<S>;
}

function roundToStep(value: number, control: SliderControl): number {
  const step = control.step ?? 1;
  const snapped = Math.round((value - control.min) / step) * step + control.min;
  const decimals = (String(step).split(".")[1] ?? "").length;
  return Number(Math.min(control.max, Math.max(control.min, snapped)).toFixed(decimals));
}

function isValid(control: Control, value: unknown): boolean {
  switch (control.type) {
    case "slider":
      return typeof value === "number" && Number.isFinite(value);
    case "toggle":
      return typeof value === "boolean";
    case "select":
      return control.options.some((o) => o.value === value);
    case "color":
      return colorOptions(control).includes(value as ColorToken);
  }
}

/** Merge untrusted input (e.g. localStorage) over defaults, dropping anything invalid. */
export function sanitizeValues<S extends ControlSchema>(schema: S, raw: unknown): ControlValues<S> {
  const input = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [key, control] of Object.entries(schema)) {
    const value = input[key];
    if (!isValid(control, value)) out[key] = control.default;
    else out[key] = control.type === "slider" ? roundToStep(value as number, control) : value;
  }
  return out as ControlValues<S>;
}

export function randomValues<S extends ControlSchema>(
  schema: S,
  current: ControlValues<S>,
  random: () => number = Math.random,
): ControlValues<S> {
  const out: Record<string, unknown> = { ...current };
  const pick = <T,>(items: readonly T[]) => items[Math.floor(random() * items.length)];
  for (const [key, control] of Object.entries(schema)) {
    if (control.randomize === false) continue;
    switch (control.type) {
      case "slider":
        out[key] = roundToStep(control.min + random() * (control.max - control.min), control);
        break;
      case "toggle":
        out[key] = random() < 0.5;
        break;
      case "select":
        out[key] = pick(control.options).value;
        break;
      case "color":
        out[key] = pick(colorOptions(control));
        break;
    }
  }
  return out as ControlValues<S>;
}
