import type { CaseRow, Cursor, Insight, SortKey } from "./types";

export const failures = (row: CaseRow) => row.results.filter((r) => !r).length;

export const transitions = (row: CaseRow) =>
  row.results.reduce((n, r, i) => (i > 0 && r !== row.results[i - 1] ? n + 1 : n), 0);

export function sortRows(rows: CaseRow[], key: SortKey): CaseRow[] {
  const copy = [...rows];
  if (key === "failures") copy.sort((a, b) => failures(b) - failures(a));
  if (key === "flakiness") copy.sort((a, b) => transitions(b) - transitions(a));
  return copy;
}

/** Reads the grid the way an eye would: vertical stripes, horizontal speckle, rows stuck red. */
export function findInsights(rows: CaseRow[]): Insight[] {
  const runs = rows[0]?.results.length ?? 0;
  const out: Insight[] = [];
  const stripeMin = Math.max(4, Math.ceil(rows.length * 0.15));

  for (let run = 1; run < runs; run++) {
    const started = rows.filter((r) => r.results[run - 1] && !r.results[run]);
    if (started.length >= stripeMin) {
      out.push({
        kind: "stripe",
        text: `Run ${run + 1}: ${started.length} cases started failing`,
        cursor: { caseId: started[0].id, run },
      });
    }
  }

  rows
    .filter((r) => transitions(r) >= 3 && failures(r) >= 2 && failures(r) <= runs - 2)
    .sort((a, b) => transitions(b) - transitions(a))
    .slice(0, 3)
    .forEach((r) => {
      const run = r.results.findIndex((v) => !v);
      out.push({
        kind: "flaky",
        text: `${r.id} flips ${transitions(r)}× in ${runs} runs`,
        cursor: { caseId: r.id, run: Math.max(0, run) },
      });
    });

  rows
    .filter((r) => failures(r) === runs)
    .forEach((r) =>
      out.push({ kind: "stuck", text: `${r.id} fails in every run`, cursor: { caseId: r.id, run: runs - 1 } }),
    );

  return out.slice(0, 5);
}

export function clampCursor(rows: CaseRow[], runs: number, cursor: Cursor | null, fallback: Cursor): Cursor {
  const wanted = cursor ?? fallback;
  const row = rows.find((r) => r.id === wanted.caseId) ?? rows[0];
  return { caseId: row.id, run: Math.min(runs - 1, Math.max(0, wanted.run)) };
}
