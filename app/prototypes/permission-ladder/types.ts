export type Risk = "read" | "write" | "send";
export type Scope = "once" | "task" | "always" | "deny";
export type GrantScope = Exclude<Scope, "deny">;

export type Tool = { id: string; label: string; risk: Risk };
export type Step = { id: string; toolId: string; text: string };

/** `usesLeft` is 1 for a one-time grant and null when the grant doesn't count uses. */
export type Grant = { scope: GrantScope; usesLeft: number | null };
export type Grants = Record<string, Grant>;

export type LogKind = "allowed" | "denied" | "used" | "revoked";
export type LogEntry = { id: number; kind: LogKind; toolId: string; scope?: Scope };

export type StepResult = "done" | "skipped";
