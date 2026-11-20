export type Risk = "read" | "write" | "destructive";
export type Policy = "allow" | "ask" | "block";
export type CallStatus = "ok" | "error" | "blocked" | "pending" | "denied";

export type ToolDef = { id: string; server: string; name: string; risk: Risk };
export type ServerDef = { id: string; label: string; tools: ToolDef[] };

export type Call = { id: number; toolId: string; status: CallStatus; ms: number; at: number };
export type LedgerState = { tick: number; calls: Call[]; nextId: number };
export type PolicyMap = Record<string, Policy>;

export type ToolStats = {
  total: number;
  errors: number;
  blocked: number;
  /** Calls per tick for the last BUCKETS ticks, oldest first. */
  buckets: number[];
};
