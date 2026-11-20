export type SourceId = "salesforce" | "zendesk" | "notes" | "slack" | "pricing";

export type Source = { id: SourceId; label: string; tool: string };

/** One sentence the agent can write, and the evidence it leans on. */
export type Claim = {
  id: string;
  source: SourceId;
  text: string;
  /** -2 argues against renewing, +2 argues for it. */
  lean: -2 | -1 | 1 | 2;
};

export type VerdictLabel = "Lean renew" | "Mixed" | "Lean hold" | "Not enough context";

export type Verdict = { label: VerdictLabel; score: number; claims: number };
