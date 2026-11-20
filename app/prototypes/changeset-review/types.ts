export type ChangeSource = "Calendar" | "Gmail" | "Tasks";

/** One edit the agent wants to make through an MCP tool. */
export type Change = {
  id: string;
  source: ChangeSource;
  /** MCP tool that would run if accepted. */
  tool: string;
  title: string;
  /** Current state; null when the change creates something new. */
  before: string | null;
  after: string;
  reason: string;
};

export type Decision = "accepted" | "rejected";
/** `applied` is set by the apply step, only for accepted changes. */
export type ChangeStatus = Decision | "applied";
