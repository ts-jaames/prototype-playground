import type { ControlValues } from "@/components/playground/controls";

import type { controls } from "./data";

export type FlowSettings = ControlValues<typeof controls>;

export type Pattern = FlowSettings["pattern"];

export type Particle = {
  x: number;
  y: number;
  /** Previous position, so each frame draws a short segment. */
  px: number;
  py: number;
  age: number;
  life: number;
};

export type Noise2D = (x: number, y: number) => number;
