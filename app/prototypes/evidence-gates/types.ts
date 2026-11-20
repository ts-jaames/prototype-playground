export type Criterion = {
  label: string;
  threshold: number;
  direction: "min" | "max";
  prefix?: string;
  suffix?: string;
  decimals: number;
  /** How far past the threshold generated values land. */
  spread: number;
};

export type GateDef = { id: string; name: string; criteria: Criterion[] };

export type Evidence = {
  label: string;
  value: string;
  target: string;
  met: boolean;
};

export type GateStatus = "locked" | "working" | "awaiting" | "passed" | "stopped";

export type GateState = {
  status: GateStatus;
  /** 0..100 progress toward the gate while working. */
  work: number;
  evidence: Evidence[] | null;
  /** Unmet criteria the human chose to let through. */
  waived: number;
  attempts: number;
  /** The redirect chosen at this gate, if any. */
  note: string | null;
};

export type RunState = { gates: GateState[] };

export type Decision =
  | { type: "go" }
  | { type: "redirect"; note: string }
  | { type: "stop" };
