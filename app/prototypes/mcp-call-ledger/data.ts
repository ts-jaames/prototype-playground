import { defineControls } from "@/components/playground/controls";

import type { Policy, PolicyMap, Risk, ServerDef, ToolDef } from "./types";

export const NAMESPACE = "mcp-call-ledger";
export const POLICY_KEY = `pp:${NAMESPACE}:policy`;

export const controls = defineControls({
  callRate: { type: "slider", label: "Call rate", min: 1, max: 10, step: 1, default: 5 },
  errorRate: { type: "slider", label: "Error rate", min: 0, max: 40, step: 1, default: 8, unit: "%" },
  paused: { type: "toggle", label: "Paused", default: false, randomize: false },
});

export const TICK_MS = 1200;
export const BUCKETS = 12;
export const MAX_CALLS = 240;
export const FEED_SIZE = 5;

const tool = (server: string, name: string, risk: Risk): ToolDef => ({
  id: `${server}.${name}`,
  server,
  name,
  risk,
});

export const SERVERS: ServerDef[] = [
  {
    id: "github",
    label: "github",
    tools: [
      tool("github", "list_issues", "read"),
      tool("github", "create_pr", "write"),
      tool("github", "delete_branch", "destructive"),
    ],
  },
  {
    id: "postgres",
    label: "postgres",
    tools: [
      tool("postgres", "query", "read"),
      tool("postgres", "execute_sql", "write"),
      tool("postgres", "drop_table", "destructive"),
    ],
  },
  {
    id: "slack",
    label: "slack",
    tools: [tool("slack", "read_channel", "read"), tool("slack", "send_message", "write")],
  },
  {
    id: "filesystem",
    label: "filesystem",
    tools: [
      tool("filesystem", "read_file", "read"),
      tool("filesystem", "write_file", "write"),
      tool("filesystem", "delete_file", "destructive"),
    ],
  },
];

export const ALL_TOOLS: ToolDef[] = SERVERS.flatMap((s) => s.tools);
export const TOOL_BY_ID: Record<string, ToolDef> = Object.fromEntries(ALL_TOOLS.map((t) => [t.id, t]));

export const RISK_WEIGHT: Record<Risk, number> = { read: 6, write: 3, destructive: 1 };
export const POLICIES: Policy[] = ["allow", "ask", "block"];

const DEFAULT_BY_RISK: Record<Risk, Policy> = { read: "allow", write: "allow", destructive: "ask" };

export function defaultPolicy(): PolicyMap {
  return Object.fromEntries(ALL_TOOLS.map((t) => [t.id, DEFAULT_BY_RISK[t.risk]]));
}

export function sanitizePolicy(raw: unknown): PolicyMap {
  const base = defaultPolicy();
  if (typeof raw !== "object" || raw === null) return base;
  for (const t of ALL_TOOLS) {
    const v = (raw as Record<string, unknown>)[t.id];
    if (v === "allow" || v === "ask" || v === "block") base[t.id] = v;
  }
  return base;
}
