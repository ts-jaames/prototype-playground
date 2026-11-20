import { defineControls } from "@/components/playground/controls";

import type { Agent, AskTemplate, QueueState } from "./types";

export const NAMESPACE = "agent-attention-queue";

export const controls = defineControls({
  askRate: { type: "slider", label: "Ask rate", min: 1, max: 10, step: 1, default: 4 },
  speed: { type: "slider", label: "Speed", min: 0.5, max: 3, step: 0.5, default: 1 },
  sort: {
    type: "select",
    label: "Sort asks by",
    default: "urgency",
    options: [
      { value: "urgency", label: "Urgency" },
      { value: "oldest", label: "Oldest first" },
    ],
  },
  paused: { type: "toggle", label: "Paused", default: false, randomize: false },
});

/** One simulation tick, in milliseconds. A tick reads as one minute in the UI. */
export const TICK_MS = 1500;
export const MAX_PENDING_ASKS = 6;
export const MIN_ACTIVE_AGENTS = 4;

export const TASK_POOL = [
  "Rotating API keys across services",
  "Summarising 212 support tickets",
  "Migrating legacy cron jobs",
  "Auditing unused feature flags",
  "Backfilling analytics events",
  "Triaging overnight alerts",
  "Reviewing 9 open pull requests",
  "Cleaning duplicate CRM contacts",
];

export const ASK_TEMPLATES: AskTemplate[] = [
  {
    kind: "approve",
    text: "Delete 14 stale branches?",
    detail: "git push origin --delete · 14 refs",
    options: ["Archive instead", "Only merged ones", "Ask me later"],
    urgency: 1,
  },
  {
    kind: "approve",
    text: "Send refund of $1,240 to Northwind?",
    detail: "stripe.refunds.create · irreversible",
    options: ["Split into two", "Draft only", "Ask me later"],
    urgency: 3,
  },
  {
    kind: "choose",
    text: "Two customers match “Acme”",
    detail: "crm.search · 2 results",
    options: ["Acme Corp (US)", "Acme Corp (EU)"],
    urgency: 2,
  },
  {
    kind: "unblock",
    text: "Staging token expired",
    detail: "401 from deploy-api · retried 3×",
    options: ["Use read-only prod", "Wait for rotation"],
    urgency: 2,
  },
  {
    kind: "approve",
    text: "Overwrite 3 files with edits?",
    detail: "src/auth/session.ts +2 more · uncommitted changes",
    options: ["Write to a branch", "Show diff first"],
    urgency: 2,
  },
  {
    kind: "choose",
    text: "Source of truth for pricing?",
    detail: "Sheet and billing API disagree on 4 plans",
    options: ["Billing API", "Pricing sheet"],
    urgency: 1,
  },
];

const SEEDS: Pick<Agent, "name" | "task" | "progress">[] = [
  { name: "Refactor auth", task: "Moving session logic to middleware", progress: 34 },
  { name: "Invoice sync", task: "Reconciling Stripe with the ledger", progress: 58 },
  { name: "Docs sweep", task: "Fixing broken links in /docs", progress: 12 },
  { name: "Churn report", task: "Segmenting Q3 cancellations", progress: 71 },
  { name: "Release notes", task: "Drafting the v4.2 changelog", progress: 45 },
  { name: "Flaky tests", task: "Bisecting checkout.spec", progress: 22 },
  { name: "Vendor intake", task: "Parsing 31 supplier PDFs", progress: 63 },
  { name: "Cache warmup", task: "Prefetching the top 500 routes", progress: 8 },
];

/** Initial asks give the first paint (and thumbnail) a populated queue. */
const SEED_ASKS: Record<number, { template: number; age: number }> = {
  1: { template: 1, age: 9 },
  2: { template: 2, age: 5 },
  5: { template: 3, age: 2 },
};

export function initialState(): QueueState {
  const agents: Agent[] = SEEDS.map((seed, i) => {
    const seeded = SEED_ASKS[i];
    return {
      id: `agent-${i}`,
      ...seed,
      state: seeded ? "asking" : "running",
      ask: seeded
        ? { ...ASK_TEMPLATES[seeded.template], id: `ask-seed-${i}`, raisedAt: -seeded.age }
        : null,
    };
  });
  return { tick: 0, agents, nextAskId: 1, taskCursor: 0 };
}
