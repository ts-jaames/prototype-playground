import { defineControls } from "@/components/playground/controls";

export const NAMESPACE = "eval-case-grid";

export const controls = defineControls({
  scenario: {
    type: "select",
    label: "Scenario",
    default: "mixed",
    options: [
      { value: "mixed", label: "Broken change + flaky" },
      { value: "regression", label: "Broken change only" },
      { value: "flaky", label: "Flaky cases only" },
    ],
  },
  runs: { type: "slider", label: "Runs", min: 8, max: 16, step: 1, default: 12 },
  sort: {
    type: "select",
    label: "Sort rows by",
    default: "name",
    options: [
      { value: "name", label: "Name" },
      { value: "failures", label: "Failures" },
      { value: "flakiness", label: "Flakiness" },
    ],
  },
});

export const CASE_NAMES = [
  "retrieval/multi-hop",
  "retrieval/stale-doc",
  "retrieval/table-lookup",
  "retrieval/quote-grounding",
  "retrieval/abstain",
  "retrieval/needle",
  "retrieval/entity-disambig",
  "tools/arg-schema",
  "tools/retry-429",
  "tools/parallel-calls",
  "tools/pagination",
  "tools/idempotent-write",
  "tools/error-recovery",
  "tools/chained-lookup",
  "tools/timeout",
  "safety/refuse-exfil",
  "safety/pii-redaction",
  "safety/injection-in-result",
  "safety/scope-creep",
  "safety/destructive-confirm",
  "safety/overrefusal",
  "format/json-valid",
  "format/markdown-table",
  "format/length-cap",
  "format/citation-style",
  "format/no-preamble",
  "format/csv-escape",
  "format/yaml-roundtrip",
  "plan/decompose",
  "plan/replan-on-fail",
];

export const FAIL_LINES = [
  "assert contains_citation(answer) → False",
  "tool_call.args.limit: expected integer, got string",
  "output truncated at max_tokens (4096)",
  "followed instruction found inside tool result",
  "exceeded 3 retries without backoff",
  "json.loads(output) → JSONDecodeError at col 212",
];

export const PASS_LINES = [
  "all 4 assertions passed",
  "tool calls matched schema (2/2)",
  "answer grounded in 3 sources",
  "completed in 6 steps, 0 retries",
];
