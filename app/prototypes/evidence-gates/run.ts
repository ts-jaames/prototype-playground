import { GATES, REDIRECT_RESUME } from "./data";
import type { Criterion, Decision, Evidence, GateState, RunState } from "./types";
import type { Rng } from "./utils";

function fmt(c: Criterion, value: number): string {
  return `${c.prefix ?? ""}${value.toFixed(c.decimals)}${c.suffix ?? ""}`;
}

function evidenceFor(c: Criterion, pass: boolean, rng: Rng): Evidence {
  const margin = rng() * c.spread;
  const miss = (0.3 + rng() * 0.7) * c.spread;
  const sign = c.direction === "min" ? 1 : -1;
  let value = c.threshold + sign * (pass ? margin : -miss);
  if (c.direction === "max" && pass) value = Math.max(0, value);
  if (c.decimals === 0 && !pass) value = sign > 0 ? Math.floor(value) : Math.ceil(value);
  if (c.decimals === 0 && !pass && value === c.threshold) value += -sign;
  value = Number(value.toFixed(c.decimals));
  const met = c.direction === "min" ? value >= c.threshold : value <= c.threshold;
  return {
    label: c.label,
    value: fmt(c, value),
    target: `${c.direction === "min" ? "≥" : "≤"} ${fmt(c, c.threshold)}`,
    met,
  };
}

/** Each criterion passes with probability `quality` (+30 points per redirect), unless forced. */
export function makeEvidence(
  gateIndex: number,
  quality: number,
  attempts: number,
  rng: Rng,
  forced?: boolean[],
): Evidence[] {
  const p = Math.min(0.98, quality / 100 + attempts * 0.3);
  return GATES[gateIndex].criteria.map((c, i) => evidenceFor(c, forced ? forced[i] : rng() < p, rng));
}

const blank = (): GateState => ({ status: "locked", work: 0, evidence: null, waived: 0, attempts: 0, note: null });

export function createRun(): RunState {
  return { gates: GATES.map((_, i) => ({ ...blank(), status: i === 0 ? "working" : "locked" })) };
}

/** A populated first paint: gate 1 passed, gate 2 waiting on a human with one miss. */
export function initialRun(rng: Rng): RunState {
  const state = createRun();
  const gates = state.gates.map((g) => ({ ...g }));
  gates[0] = { ...gates[0], status: "passed", work: 100, evidence: makeEvidence(0, 100, 0, rng, [true, true, true]) };
  gates[1] = { ...gates[1], status: "awaiting", work: 100, evidence: makeEvidence(1, 0, 0, rng, [true, false, true]) };
  return { gates };
}

export function tick(state: RunState, dt: number, quality: number, rng: Rng): RunState {
  const i = state.gates.findIndex((g) => g.status === "working");
  if (i === -1) return state;
  const gates = state.gates.map((g) => ({ ...g }));
  const gate = gates[i];
  gate.work = Math.min(100, gate.work + dt);
  if (gate.work >= 100) {
    gate.status = "awaiting";
    gate.evidence = makeEvidence(i, quality, gate.attempts, rng);
  }
  return { gates };
}

export function unmet(gate: GateState): number {
  return gate.evidence?.filter((e) => !e.met).length ?? 0;
}

/** `go` with unmet criteria is allowed here; the UI makes the human confirm it first. */
export function decide(state: RunState, index: number, decision: Decision): RunState {
  const gates = state.gates.map((g) => ({ ...g }));
  const gate = gates[index];
  if (!gate || gate.status !== "awaiting") return state;

  switch (decision.type) {
    case "go":
      gate.status = "passed";
      gate.waived = unmet(gate);
      if (gates[index + 1]) gates[index + 1].status = "working";
      break;
    case "redirect":
      gate.status = "working";
      gate.work = REDIRECT_RESUME;
      gate.attempts += 1;
      gate.note = decision.note;
      break;
    case "stop":
      gate.status = "stopped";
      break;
  }
  return { gates };
}
