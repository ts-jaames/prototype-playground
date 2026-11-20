import { ASK_TEMPLATES, MAX_PENDING_ASKS, MIN_ACTIVE_AGENTS, TASK_POOL } from "./data";
import type { Agent, QueueSettings, QueueState, Resolution } from "./types";
import type { Rng } from "./utils";

/** Advance every running agent one tick; maybe raise asks; revive finished agents. */
export function stepQueue(
  state: QueueState,
  opts: Pick<QueueSettings, "askRate" | "speed">,
  rng: Rng,
): QueueState {
  const tick = state.tick + 1;
  let nextAskId = state.nextAskId;
  let pending = state.agents.filter((a) => a.ask).length;

  let agents: Agent[] = state.agents.map((agent) => {
    if (agent.state !== "running") return agent;
    const progress = agent.progress + rng() * 3.2 * opts.speed;
    if (progress >= 100) return { ...agent, progress: 100, state: "done" };
    if (pending < MAX_PENDING_ASKS && rng() < opts.askRate * 0.004 * opts.speed) {
      pending += 1;
      const template = ASK_TEMPLATES[Math.floor(rng() * ASK_TEMPLATES.length)];
      return {
        ...agent,
        progress,
        state: "asking",
        ask: { ...template, id: `ask-${nextAskId++}`, raisedAt: tick },
      };
    }
    return { ...agent, progress };
  });

  let taskCursor = state.taskCursor;
  const active = agents.filter((a) => a.state === "running" || a.state === "asking").length;
  if (active < MIN_ACTIVE_AGENTS) {
    const idle = agents.find((a) => a.state === "done" || a.state === "stopped");
    if (idle) {
      const task = TASK_POOL[taskCursor % TASK_POOL.length];
      taskCursor += 1;
      agents = agents.map((a) =>
        a.id === idle.id ? { ...a, task, progress: 0, state: "running", ask: null } : a,
      );
    }
  }

  return { tick, agents, nextAskId, taskCursor };
}

export function resolveAsk(state: QueueState, agentId: string, resolution: Resolution): QueueState {
  const agents = state.agents.map((agent): Agent => {
    if (agent.id !== agentId || !agent.ask) return agent;
    switch (resolution.type) {
      case "approve":
        return { ...agent, state: "running", ask: null, progress: Math.min(99, agent.progress + 3) };
      case "redirect":
        return { ...agent, state: "running", ask: null, progress: Math.max(0, agent.progress - 8) };
      case "stop":
        return { ...agent, state: "stopped", ask: null };
    }
  });
  return { ...state, agents };
}

/** Higher = more pressing. Urgency base plus a slow climb as the ask ages. */
export function askScore(agent: Agent, tick: number): number {
  if (!agent.ask) return 0;
  return agent.ask.urgency + (tick - agent.ask.raisedAt) / 6;
}

export function sortedAsks(agents: Agent[], tick: number, sort: QueueSettings["sort"]): Agent[] {
  const asking = agents.filter((a) => a.ask);
  return asking.sort((a, b) =>
    sort === "oldest"
      ? a.ask!.raisedAt - b.ask!.raisedAt
      : askScore(b, tick) - askScore(a, tick),
  );
}
