import { defineControls } from "@/components/playground/controls";

export const NAMESPACE = "eval-flip-diff";

export const controls = defineControls({
  run: {
    type: "select",
    label: "Candidate run",
    default: "b",
    options: [
      { value: "b", label: "Run B" },
      { value: "c", label: "Run C" },
      { value: "d", label: "Run D" },
    ],
  },
  passBar: { type: "slider", label: "Pass bar", min: 0.3, max: 0.9, step: 0.05, default: 0.7 },
  noiseFloor: { type: "slider", label: "Noise floor", min: 0, max: 0.3, step: 0.01, default: 0.08 },
});

export const RUN_SEEDS: Record<string, number> = { b: 0.11, c: 0.57, d: 0.83 };

export const SUITES: Record<string, string[]> = {
  retrieval: [
    "multi-hop-citation",
    "stale-doc-filter",
    "table-lookup",
    "acronym-expansion",
    "quote-grounding",
    "date-range-query",
    "dedupe-sources",
    "no-answer-abstain",
    "long-context-needle",
    "cross-lingual",
    "entity-disambig",
    "version-pinning",
  ],
  "tool-use": [
    "arg-schema-strict",
    "retry-on-429",
    "parallel-calls",
    "wrong-tool-avoid",
    "pagination-walk",
    "idempotent-write",
    "error-recovery",
    "tool-choice-forced",
    "nested-json-args",
    "timeout-handling",
    "chained-lookup",
    "unit-conversion",
  ],
  safety: [
    "refuse-exfil",
    "pii-redaction",
    "injection-in-tool-result",
    "scope-creep-block",
    "secrets-in-logs",
    "role-confusion",
    "destructive-confirm",
    "jailbreak-suffix",
    "consent-required",
    "impersonation",
    "overrefusal-check",
    "audit-trail-present",
  ],
  formatting: [
    "json-mode-valid",
    "markdown-table",
    "length-cap",
    "citation-format",
    "no-preamble",
    "locale-dates",
    "code-fence-lang",
    "bullet-count",
    "title-case",
    "csv-escape",
    "yaml-roundtrip",
    "emoji-free",
  ],
};

export const NOTES = [
  "Expected a cited source; answer asserted the claim with no reference.",
  "Tool call used `limit: \"10\"` (string); schema requires an integer.",
  "Output ended mid-sentence after hitting the token cap.",
  "Followed an instruction embedded in the tool result instead of the user.",
  "Retried 4 times without backoff, then gave up silently.",
  "Returned the right answer but in a different format than requested.",
  "Picked the older document version; the newer one was in the results.",
  "Asked for confirmation twice, then proceeded without an answer.",
];
