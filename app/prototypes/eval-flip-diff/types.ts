export type EvalCase = {
  id: string;
  name: string;
  suite: string;
  baseline: number;
  candidate: number;
  note: string;
};

export type FlipKind = "regression" | "fix" | "noise" | "unchanged";

export type Classified = EvalCase & { kind: FlipKind; delta: number };
