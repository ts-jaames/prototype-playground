export type StepRun = {
  name: string;
  /** Original planned minutes. Pace and noise are applied to this, and it never changes. */
  work: number;
  /** Current plan in minutes; Replan rewrites it. */
  planned: number;
  startedAt: number | null;
  endedAt: number | null;
  /** 0..1 for the active step. */
  progress: number;
};

export type RunState = {
  /** Minutes since the run started. */
  elapsed: number;
  steps: StepRun[];
  /** Index of the active step, or null when the run has finished. */
  current: number | null;
};

export type StepStatus = "done" | "active" | "pending";

export type StepProjection = {
  status: StepStatus;
  plannedStart: number;
  projStart: number;
  projEnd: number;
  /** Projected duration in minutes (actual for done steps). */
  duration: number;
  /** projStart − plannedStart: how far this step's start has slipped from plan. */
  drift: number;
};

export type Projection = {
  steps: StepProjection[];
  planEnd: number;
  eta: number;
  pace: number;
};
