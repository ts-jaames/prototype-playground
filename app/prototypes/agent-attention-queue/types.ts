export type AskKind = "approve" | "choose" | "unblock";

export type Ask = {
  id: string;
  kind: AskKind;
  text: string;
  detail: string;
  /** approve: redirect choices. choose / unblock: the answers themselves. */
  options: string[];
  urgency: 1 | 2 | 3;
  /** Tick at which the ask was raised (may be negative for seeded asks). */
  raisedAt: number;
};

export type AskTemplate = Omit<Ask, "id" | "raisedAt">;

export type AgentState = "running" | "asking" | "done" | "stopped";

export type Agent = {
  id: string;
  name: string;
  task: string;
  progress: number;
  state: AgentState;
  ask: Ask | null;
};

export type Resolution =
  | { type: "approve" }
  | { type: "stop" }
  | { type: "redirect"; note: string };

export type QueueState = {
  tick: number;
  agents: Agent[];
  nextAskId: number;
  taskCursor: number;
};

export type QueueSettings = {
  askRate: number;
  speed: number;
  sort: "urgency" | "oldest";
};
