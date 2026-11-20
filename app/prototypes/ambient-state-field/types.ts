import type { ControlValues } from "@/components/playground/controls";

import type { controls } from "./data";

export type FieldSettings = ControlValues<typeof controls>;

export type Noise2D = (x: number, y: number) => number;

export type AgentState = "idle" | "searching" | "converging" | "uncertain" | "done";

/** Everything that makes one state feel different from another. All values blend smoothly between states. */
export type Params = {
  /** Strength of the wandering noise flow. */
  flow: number;
  /** How strongly dots are pulled toward a ring around their center. */
  pull: number;
  /** Tangential push, so the ring turns. */
  swirl: number;
  /** Ring radius as a fraction of the canvas's shorter side. */
  ringR: number;
  /** Random shaking. */
  jitter: number;
  /** 0 = one center, 1 = two competing centers (two hypotheses). */
  split: number;
  /** Outward drift from the middle, used while searching. */
  spread: number;
  alpha: number;
  /** Velocity kept each frame; lower settles faster. */
  damp: number;
};

export type Dot = { x: number; y: number; vx: number; vy: number; group: 0 | 1 };
