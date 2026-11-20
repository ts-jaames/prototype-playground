"use client";

import { useRef } from "react";

import type { CaseRow, Cursor } from "./types";

const CW = 28;
const CH = 14;
const GAP = 3;

/**
 * One interactive surface, not hundreds of tiny buttons: tap or drag to place the cursor,
 * arrow keys to move it. Prev/next buttons in the detail panel cover assistive and touch use.
 */
export function ResultGrid({
  rows,
  runs,
  cursor,
  onCursor,
}: {
  rows: CaseRow[];
  runs: number;
  cursor: Cursor;
  onCursor: (cursor: Cursor) => void;
}) {
  const pressed = useRef(false);
  const rowIndex = Math.max(0, rows.findIndex((r) => r.id === cursor.caseId));

  const place = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const col = Math.min(runs - 1, Math.max(0, Math.floor(((e.clientX - box.left) / box.width) * runs)));
    const row = Math.min(rows.length - 1, Math.max(0, Math.floor(((e.clientY - box.top) / box.height) * rows.length)));
    onCursor({ caseId: rows[row].id, run: col });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const move: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };
    const delta = move[e.key];
    if (!delta) return;
    e.preventDefault();
    const row = Math.min(rows.length - 1, Math.max(0, rowIndex + delta[0]));
    onCursor({ caseId: rows[row].id, run: Math.min(runs - 1, Math.max(0, cursor.run + delta[1])) });
  };

  return (
    <div
      role="grid"
      tabIndex={0}
      aria-label="Eval results, cases by runs. Use arrow keys to inspect."
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        pressed.current = true;
        place(e);
      }}
      onPointerMove={(e) => pressed.current && place(e)}
      onPointerUp={() => (pressed.current = false)}
      onPointerCancel={() => (pressed.current = false)}
      onPointerLeave={() => (pressed.current = false)}
      className="mx-auto w-full max-w-sm cursor-crosshair touch-pan-y rounded-lg border border-border bg-card p-2 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <svg viewBox={`0 0 ${runs * CW} ${rows.length * CH}`} className="block w-full" aria-hidden>
        <rect x={0} y={rowIndex * CH} width={runs * CW} height={CH} className="fill-foreground/10" />
        <rect x={cursor.run * CW} y={0} width={CW} height={rows.length * CH} className="fill-foreground/10" />
        {rows.map((row, r) =>
          row.results.map((pass, c) => (
            <rect
              key={`${row.id}-${c}`}
              x={c * CW + GAP / 2}
              y={r * CH + GAP / 2}
              width={CW - GAP}
              height={CH - GAP}
              rx={3}
              className={pass ? "fill-chart-2" : "fill-destructive"}
            />
          )),
        )}
        <rect
          x={cursor.run * CW}
          y={rowIndex * CH}
          width={CW}
          height={CH}
          rx={3}
          className="fill-none stroke-foreground"
          strokeWidth={1.5}
        />
      </svg>
    </div>
  );
}
