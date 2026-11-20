export type SourceId = "salesforce" | "billing" | "zendesk" | "gainsight" | "sheet";

/** One value as returned by one MCP tool. */
export type Reading = {
  source: SourceId;
  value: string;
  tool: string;
  minutesAgo: number;
  /** What a fresh call to the same tool returns, when it differs from `value`. */
  requeryValue?: string;
};

export type FieldId = "arr" | "renewal" | "owner" | "health" | "tickets";

export type FieldDef = { id: FieldId; label: string; readings: Reading[] };

export type FieldState = { readings: Reading[]; selected: SourceId };
export type FieldStates = Record<FieldId, FieldState>;
