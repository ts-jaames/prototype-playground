export type TeamId = "design" | "product" | "all";
export type WindowId = "1w" | "2w" | "4w";
export type Quorum = "60" | "80" | "100";

/** The inputs a run depends on. Each is owned by one step. */
export type Inputs = { team: TeamId; window: WindowId; quorum: Quorum };
export type InputKey = keyof Inputs;

export type Step = {
  id: string;
  /** MCP tool the agent called. */
  tool: string;
  args: string;
  result: string;
  /** The input this step owns; null when the step only derives from earlier ones. */
  inputKey: InputKey | null;
};

export type Answer = {
  /** Stable key used to compare results across runs. */
  key: string;
  headline: string;
  detail: string;
};

export type Run = {
  id: string;
  label: string;
  parentId: string | null;
  /** Index of the step the fork started from; steps before it are reused. */
  forkStep: number | null;
  inputs: Inputs;
  steps: Step[];
  answer: Answer;
};
