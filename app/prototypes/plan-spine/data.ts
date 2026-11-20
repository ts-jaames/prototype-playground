import { defineControls } from "@/components/playground/controls";

import { createRng } from "./utils";

export const NAMESPACE = "plan-spine";

export const controls = defineControls({
  overrun: { type: "slider", label: "Overrun", min: -0.3, max: 0.8, step: 0.05, default: 0.35 },
  speed: { type: "slider", label: "Speed", min: 1, max: 12, step: 1, default: 3, unit: " min/s" },
  paused: { type: "toggle", label: "Paused", default: false, randomize: false },
});

export const PLAN: { name: string; minutes: number }[] = [
  { name: "Read the brief", minutes: 4 },
  { name: "Draft the plan", minutes: 6 },
  { name: "Scaffold the harness", minutes: 8 },
  { name: "Implement core loop", minutes: 20 },
  { name: "Wire up tools", minutes: 12 },
  { name: "Run evals", minutes: 10 },
  { name: "Fix failures", minutes: 14 },
  { name: "Write the report", minutes: 6 },
];

/** Per-step randomness in pace, fixed so a run is reproducible. */
export const NOISE: number[] = (() => {
  const rng = createRng(0.58);
  return PLAN.map(() => (rng() - 0.5) * 0.5);
})();

export const TICK_MS = 250;
/** Clock time the run starts, in minutes after midnight. */
export const START_MINUTE = 9 * 60;
/** Minutes of simulated work already done on first paint, so the spine opens bent. */
export const WARMUP_MINUTES = 44;
