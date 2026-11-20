import type { FieldId, FieldState, FieldStates, Reading } from "./types";

export const STALE_AFTER_MINUTES = 24 * 60;

export function formatAge(minutes: number): string {
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < STALE_AFTER_MINUTES) return `${Math.round(minutes / 60)}h ago`;
  return `${Math.round(minutes / STALE_AFTER_MINUTES)}d ago`;
}

export function selectedReading(state: FieldState): Reading {
  return state.readings.find((r) => r.source === state.selected) ?? state.readings[0];
}

/** True when the sources for a field return more than one distinct value. */
export function hasConflict(state: FieldState): boolean {
  return new Set(state.readings.map((r) => r.value)).size > 1;
}

export function conflictCount(states: FieldStates): number {
  return Object.values(states).filter(hasConflict).length;
}

/** The sentence the agent writes from the currently selected values. */
export function summarize(account: string, states: FieldStates): { text: string; value?: FieldId }[] {
  const v = (id: FieldId) => selectedReading(states[id]).value;
  return [
    { text: `${account} renews on ` },
    { text: v("renewal"), value: "renewal" },
    { text: " with an ARR of " },
    { text: v("arr"), value: "arr" },
    { text: ", owned by " },
    { text: v("owner"), value: "owner" },
    { text: ". Health is " },
    { text: v("health"), value: "health" },
    { text: " with " },
    { text: v("tickets"), value: "tickets" },
    { text: " open tickets." },
  ];
}
