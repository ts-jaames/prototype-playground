// Pure: turns dial settings into the tool calls and the results they would return.
import { ITEMS, SOURCES, TOOLS } from "./data";
import type { QueryResult, Settings } from "./types";

export function runQuery(settings: Settings): QueryResult {
  const sources = SOURCES.slice(0, settings.scope);
  const items = ITEMS.filter(
    (i) =>
      sources.includes(i.source) && i.ageDays <= settings.recency && i.relevance >= settings.relevance,
  ).sort((a, b) => b.relevance - a.relevance);

  const calls = sources.map(
    (s) => `${TOOLS[s]}(since="${settings.recency}d", min_score=${(settings.relevance / 100).toFixed(2)})`,
  );
  return { items, calls };
}

/** Which ids appeared or disappeared between two result sets. */
export function diffIds(prev: ReadonlySet<string>, next: ReadonlySet<string>) {
  return {
    added: [...next].filter((id) => !prev.has(id)),
    removed: [...prev].filter((id) => !next.has(id)),
  };
}
