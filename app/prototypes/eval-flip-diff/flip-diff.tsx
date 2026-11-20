"use client";

import { useMemo } from "react";

import { ControlPanel, ControlsLayout, useControls } from "@/components/playground/controls";

import { classify, generateCases, summarize } from "./cases";
import { controls as schema, NAMESPACE } from "./data";
import { FlipGroup } from "./flip-group";
import { FlipSummary } from "./flip-summary";

export function FlipDiff() {
  const controls = useControls(NAMESPACE, schema);
  const { run, passBar, noiseFloor } = controls.values;

  const cases = useMemo(() => generateCases(run), [run]);
  const classified = useMemo(() => classify(cases, passBar, noiseFloor), [cases, passBar, noiseFloor]);
  const summary = summarize(classified, passBar);

  const byKind = (kind: string) =>
    classified.filter((c) => c.kind === kind).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  return (
    <ControlsLayout panel={<ControlPanel controls={controls} />}>
      <FlipSummary summary={summary} />
      <FlipGroup title="Regressions" items={byKind("regression")} passBar={passBar} />
      <FlipGroup title="Fixes" items={byKind("fix")} passBar={passBar} />
      <FlipGroup title="Below noise floor" items={byKind("noise")} passBar={passBar} collapsedByDefault />
      <FlipGroup title="Unchanged" items={byKind("unchanged")} passBar={passBar} collapsedByDefault />
    </ControlsLayout>
  );
}
