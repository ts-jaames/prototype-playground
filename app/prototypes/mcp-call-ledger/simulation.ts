import { ALL_TOOLS, BUCKETS, defaultPolicy, MAX_CALLS, RISK_WEIGHT, TOOL_BY_ID } from "./data";
import type { Call, CallStatus, LedgerState, Policy, PolicyMap, ToolStats } from "./types";
import { createRng, type Rng } from "./utils";

const TOTAL_WEIGHT = ALL_TOOLS.reduce((sum, t) => sum + RISK_WEIGHT[t.risk], 0);

function pickTool(rng: Rng) {
  let roll = rng() * TOTAL_WEIGHT;
  for (const t of ALL_TOOLS) {
    roll -= RISK_WEIGHT[t.risk];
    if (roll <= 0) return t;
  }
  return ALL_TOOLS[0];
}

function outcome(policy: Policy, errorRate: number, rng: Rng): CallStatus {
  if (policy === "block") return "blocked";
  if (policy === "ask") return "pending";
  return rng() * 100 < errorRate ? "error" : "ok";
}

/** Advance one tick: zero or more new calls, each judged by the tool's current policy. */
export function stepLedger(
  state: LedgerState,
  policy: PolicyMap,
  opts: { callRate: number; errorRate: number },
  rng: Rng,
): LedgerState {
  const tick = state.tick + 1;
  const count = Math.floor(opts.callRate / 4) + (rng() < (opts.callRate % 4) / 4 ? 1 : 0);
  const added: Call[] = [];
  let nextId = state.nextId;
  for (let i = 0; i < count; i++) {
    const tool = pickTool(rng);
    const base = tool.risk === "read" ? 40 : tool.risk === "write" ? 140 : 90;
    added.push({
      id: nextId++,
      toolId: tool.id,
      status: outcome(policy[tool.id] ?? "allow", opts.errorRate, rng),
      ms: Math.round(base + rng() * base * 2),
      at: tick,
    });
  }
  return { tick, nextId, calls: [...added.reverse(), ...state.calls].slice(0, MAX_CALLS) };
}

/** Approve or deny a pending call. */
export function decideCall(
  state: LedgerState,
  callId: number,
  approve: boolean,
  errorRate: number,
  rng: Rng,
): LedgerState {
  const calls = state.calls.map((c): Call => {
    if (c.id !== callId || c.status !== "pending") return c;
    if (!approve) return { ...c, status: "denied" };
    return { ...c, status: rng() * 100 < errorRate ? "error" : "ok" };
  });
  return { ...state, calls };
}

export function toolStats(calls: Call[], tick: number): Record<string, ToolStats> {
  const out: Record<string, ToolStats> = {};
  for (const t of ALL_TOOLS) out[t.id] = { total: 0, errors: 0, blocked: 0, buckets: Array(BUCKETS).fill(0) };
  for (const c of calls) {
    const s = out[c.toolId];
    if (!s) continue;
    s.total += 1;
    if (c.status === "error") s.errors += 1;
    if (c.status === "blocked" || c.status === "denied") s.blocked += 1;
    const age = tick - c.at;
    if (age >= 0 && age < BUCKETS) s.buckets[BUCKETS - 1 - age] += 1;
  }
  return out;
}

/** Pending calls always show; the rest of the feed is the most recent settled calls. */
export function feedCalls(calls: Call[], size: number): Call[] {
  const pending = calls.filter((c) => c.status === "pending");
  const settled = calls.filter((c) => c.status !== "pending").slice(0, size);
  return [...pending, ...settled].sort((a, b) => b.id - a.id);
}

export function seedLedger(): LedgerState {
  const rng = createRng(0.42);
  let state: LedgerState = { tick: 0, calls: [], nextId: 1 };
  const policy = defaultPolicy();
  for (let i = 0; i < 14; i++) state = stepLedger(state, policy, { callRate: 5, errorRate: 8 }, rng);
  return state;
}

export function toolName(id: string): string {
  return TOOL_BY_ID[id]?.name ?? id;
}
