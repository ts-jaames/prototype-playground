import { defineControls } from "@/components/playground/controls";

import type { AgentState, Params } from "./types";

export const NAMESPACE = "ambient-state-field";

export const controls = defineControls({
  count: { type: "slider", label: "Particles", min: 60, max: 400, step: 10, default: 220 },
  trail: { type: "slider", label: "Trail", min: 0, max: 95, step: 5, default: 70, unit: "%" },
  intensity: { type: "slider", label: "Intensity", min: 0.4, max: 2, step: 0.1, default: 1 },
});

export const STATES: { id: AgentState; label: string; caption: string }[] = [
  { id: "idle", label: "Idle", caption: "Waiting. Slow drift, nothing in motion." },
  { id: "searching", label: "Searching", caption: "Looking across sources. Wide, wandering movement." },
  { id: "converging", label: "Converging", caption: "Narrowing in. Everything pulls toward one answer." },
  { id: "uncertain", label: "Uncertain", caption: "Two competing answers. The field splits and shakes." },
  { id: "done", label: "Done", caption: "Settled. A calm ring and almost no motion." },
];

export const STATE_PARAMS: Record<AgentState, Params> = {
  idle: { flow: 0.5, pull: 0, swirl: 0, ringR: 0.3, jitter: 0.02, split: 0, spread: 0, alpha: 0.55, damp: 0.95 },
  searching: { flow: 1.6, pull: 0, swirl: 0, ringR: 0.3, jitter: 0.05, split: 0, spread: 0.6, alpha: 0.75, damp: 0.96 },
  converging: { flow: 0.5, pull: 1, swirl: 0.6, ringR: 0.16, jitter: 0.03, split: 0, spread: 0, alpha: 0.85, damp: 0.93 },
  uncertain: { flow: 0.8, pull: 0.7, swirl: 0.2, ringR: 0.1, jitter: 1, split: 1, spread: 0, alpha: 0.75, damp: 0.92 },
  done: { flow: 0.12, pull: 1, swirl: 0.3, ringR: 0.26, jitter: 0, split: 0, spread: 0, alpha: 1, damp: 0.9 },
};

/** A scripted agent run for the demo button. */
export const DEMO: { state: AgentState; ms: number; note: string }[] = [
  { state: "searching", ms: 3200, note: "calendar.get_freebusy, directory.list_members" },
  { state: "converging", ms: 2800, note: "schedule.rank_days" },
  { state: "uncertain", ms: 3200, note: "two days tie, venue conflict" },
  { state: "converging", ms: 2400, note: "venues.search" },
  { state: "done", ms: 3000, note: "Thu Dec 17 at The Loft" },
];

export const BLEND = 0.035;
export const WARMUP_STEPS = 300;
export const NOISE_SCALE = 0.004;
export const CURL_EPS = 2;
export const CURL_GAIN = 40;
