"use client";

import { useMemo, useState } from "react";

import { ControlPanel, ControlsLayout, useControls } from "@/components/playground/controls";

import { clampCursor, findInsights, sortRows } from "./analysis";
import { controls as schema, NAMESPACE } from "./data";
import { DetailPanel } from "./detail-panel";
import { Insights } from "./insights";
import { ResultGrid } from "./result-grid";
import { generateResults } from "./results";
import type { Cursor } from "./types";

export function CaseGrid() {
  const controls = useControls(NAMESPACE, schema);
  const { scenario, runs, sort } = controls.values;
  const [cursor, setCursor] = useState<Cursor | null>(null);

  const data = useMemo(() => generateResults(scenario, runs), [scenario, runs]);
  const insights = useMemo(() => findInsights(data), [data]);
  const rows = useMemo(() => sortRows(data, sort), [data, sort]);

  // Until the user picks a cell, point at the first finding so the view opens on evidence.
  const fallback = insights[0]?.cursor ?? { caseId: rows[0].id, run: 0 };
  const active = clampCursor(rows, runs, cursor, fallback);

  return (
    <ControlsLayout panel={<ControlPanel controls={controls} />}>
      <Insights insights={insights} onJump={setCursor} />
      <ResultGrid rows={rows} runs={runs} cursor={active} onCursor={setCursor} />
      <DetailPanel rows={rows} runs={runs} cursor={active} onCursor={setCursor} />
    </ControlsLayout>
  );
}
