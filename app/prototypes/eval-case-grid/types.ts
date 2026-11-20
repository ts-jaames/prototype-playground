export type CaseRow = {
  id: string;
  /** true = pass, indexed by run. */
  results: boolean[];
};

export type Cursor = { caseId: string; run: number };

export type Insight = {
  kind: "stripe" | "flaky" | "stuck";
  text: string;
  cursor: Cursor;
};

export type Scenario = "mixed" | "regression" | "flaky";
export type SortKey = "name" | "failures" | "flakiness";
