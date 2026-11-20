import type { Period, Server, Tool } from "./types";

export function isUnused(tool: Tool, period: Period, threshold: number): boolean {
  return tool.calls[period] < threshold;
}

export function sumTokens(tools: Tool[]): number {
  return tools.reduce((sum, t) => sum + t.tokens, 0);
}

export type Totals = {
  loaded: number;
  loadedUsed: number;
  loadedUnused: number;
  /** Tokens a "prune all unused" would give back (unused tools still loaded). */
  reclaimable: number;
};

export function totals(
  servers: Server[],
  pruned: ReadonlySet<string>,
  period: Period,
  threshold: number,
): Totals {
  let loadedUsed = 0;
  let loadedUnused = 0;
  for (const tool of servers.flatMap((s) => s.tools)) {
    if (pruned.has(tool.id)) continue;
    if (isUnused(tool, period, threshold)) loadedUnused += tool.tokens;
    else loadedUsed += tool.tokens;
  }
  return { loaded: loadedUsed + loadedUnused, loadedUsed, loadedUnused, reclaimable: loadedUnused };
}

export function unusedLoaded(
  server: Server,
  pruned: ReadonlySet<string>,
  period: Period,
  threshold: number,
): Tool[] {
  return server.tools.filter((t) => !pruned.has(t.id) && isUnused(t, period, threshold));
}

export function formatTokens(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
