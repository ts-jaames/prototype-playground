import { defineControls } from "@/components/playground/controls";

import type { GateDef } from "./types";

export const NAMESPACE = "evidence-gates";

export const controls = defineControls({
  quality: { type: "slider", label: "Evidence quality", min: 0, max: 100, step: 5, default: 55, unit: "%" },
  speed: { type: "slider", label: "Speed", min: 1, max: 5, step: 1, default: 2 },
  paused: { type: "toggle", label: "Paused", default: false, randomize: false },
});

export const TICK_MS = 200;
/** Progress points per tick at speed 1. */
export const WORK_PER_TICK = 1.25;
/** Where a redirected gate resumes. */
export const REDIRECT_RESUME = 45;

export const REDIRECT_OPTIONS = ["Re-run with more samples", "Tighten the scope"];

export const GATES: GateDef[] = [
  {
    id: "plan",
    name: "Plan",
    criteria: [
      { label: "Steps with a test", threshold: 90, direction: "min", suffix: "%", decimals: 0, spread: 8 },
      { label: "Open questions", threshold: 2, direction: "max", decimals: 0, spread: 3 },
      { label: "Estimated cost", threshold: 5, direction: "max", prefix: "$", decimals: 2, spread: 2 },
    ],
  },
  {
    id: "prototype",
    name: "Prototype",
    criteria: [
      { label: "Smoke flows passing", threshold: 83, direction: "min", suffix: "%", decimals: 0, spread: 17 },
      { label: "Typecheck errors", threshold: 0, direction: "max", decimals: 0, spread: 4 },
      { label: "Diff size", threshold: 600, direction: "max", suffix: " lines", decimals: 0, spread: 300 },
    ],
  },
  {
    id: "evals",
    name: "Evals",
    criteria: [
      { label: "Pass rate", threshold: 85, direction: "min", suffix: "%", decimals: 0, spread: 10 },
      { label: "Regressions vs baseline", threshold: 1, direction: "max", decimals: 0, spread: 4 },
      { label: "p95 latency", threshold: 4, direction: "max", suffix: "s", decimals: 1, spread: 2 },
    ],
  },
  {
    id: "release",
    name: "Release",
    criteria: [
      { label: "Cost per run", threshold: 0.4, direction: "max", prefix: "$", decimals: 2, spread: 0.3 },
      { label: "Unreviewed tool scopes", threshold: 0, direction: "max", decimals: 0, spread: 3 },
      { label: "Rollback tested", threshold: 1, direction: "min", decimals: 0, spread: 1 },
    ],
  },
];
