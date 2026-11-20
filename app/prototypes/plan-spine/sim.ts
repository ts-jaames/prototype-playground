import { NOISE, PLAN, WARMUP_MINUTES } from "./data";
import type { Projection, RunState, StepProjection, StepStatus } from "./types";

export function createRun(): RunState {
  return {
    elapsed: 0,
    current: 0,
    steps: PLAN.map((p, i) => ({
      name: p.name,
      work: p.minutes,
      planned: p.minutes,
      startedAt: i === 0 ? 0 : null,
      endedAt: null,
      progress: 0,
    })),
  };
}

/** Advance `dt` simulated minutes. A step takes work × (1 + overrun + its noise). */
export function advance(state: RunState, dt: number, overrun: number): RunState {
  if (state.current === null) return state;
  const i = state.current;
  const elapsed = state.elapsed + dt;
  const steps = state.steps.map((s) => ({ ...s }));
  const step = steps[i];
  const duration = Math.max(0.3 * step.work, step.work * (1 + overrun + NOISE[i]));
  step.progress += dt / duration;

  let current: number | null = i;
  if (step.progress >= 1) {
    step.progress = 1;
    step.endedAt = elapsed;
    current = i + 1 < steps.length ? i + 1 : null;
    if (current !== null) steps[current].startedAt = elapsed;
  }
  return { elapsed, steps, current };
}

export function initialRun(overrun: number): RunState {
  let state = createRun();
  while (state.elapsed < WARMUP_MINUTES && state.current !== null) state = advance(state, 0.5, overrun);
  return state;
}

function statusOf(state: RunState, i: number): StepStatus {
  if (state.steps[i].endedAt !== null) return "done";
  return state.current === i ? "active" : "pending";
}

/** How fast the run is really going relative to plan so far (1 = on plan). */
export function pace(state: RunState): number {
  const plannedDone = state.steps.reduce((sum, s) => {
    if (s.endedAt !== null) return sum + s.planned;
    return sum + s.planned * s.progress;
  }, 0);
  return plannedDone > 0 ? state.elapsed / plannedDone : 1;
}

export function project(state: RunState): Projection {
  const ratio = pace(state);
  const steps: StepProjection[] = [];
  let plannedStart = 0;
  let cursor = 0;

  state.steps.forEach((s, i) => {
    const status = statusOf(state, i);
    let projStart = cursor;
    let projEnd: number;
    if (status === "done") {
      projStart = s.startedAt ?? cursor;
      projEnd = s.endedAt ?? cursor;
    } else if (status === "active") {
      projStart = s.startedAt ?? cursor;
      projEnd = state.elapsed + (1 - s.progress) * s.planned * ratio;
    } else {
      projEnd = projStart + s.planned * ratio;
    }
    steps.push({
      status,
      plannedStart,
      projStart,
      projEnd,
      duration: projEnd - projStart,
      drift: projStart - plannedStart,
    });
    plannedStart += s.planned;
    cursor = projEnd;
  });

  return { steps, planEnd: plannedStart, eta: cursor, pace: ratio };
}

/** Rewrite the plan from reality: done steps take their actual time, the rest scale by pace. */
export function replan(state: RunState): RunState {
  const ratio = pace(state);
  const steps = state.steps.map((s) => {
    if (s.endedAt !== null && s.startedAt !== null) {
      return { ...s, planned: Math.max(1, s.endedAt - s.startedAt) };
    }
    return { ...s, planned: Math.max(1, s.planned * ratio) };
  });
  return { ...state, steps };
}

export function formatClock(minutesAfterStart: number, startMinute: number): string {
  const total = Math.round(startMinute + minutesAfterStart);
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

export function formatDelta(minutes: number): string {
  const rounded = Math.round(minutes);
  return `${rounded >= 0 ? "+" : "−"}${Math.abs(rounded)}m`;
}
