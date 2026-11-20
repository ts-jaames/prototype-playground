"use client";

import { useEffect, useState } from "react";

import { Collapse } from "@/components/playground/collapse";
import { usePrefersReducedMotion } from "@/components/playground/hooks";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { AnswerCard } from "./answer-card";
import { DEFAULT_INPUTS, INPUT_LABELS, TASK } from "./data";
import { buildRun } from "./simulation";
import { StepDetail } from "./step-detail";
import { StepRow, type StepState } from "./step-row";
import type { InputKey, Run } from "./types";

const STEP_MS = 550;
const MAX_RUNS = 6;

export function RunTimelineFork() {
  const reducedMotion = usePrefersReducedMotion();
  const [runs, setRuns] = useState<Run[]>(() => [buildRun("r1", "Run 1", DEFAULT_INPUTS, null, null)]);
  const [activeId, setActiveId] = useState("r1");
  const active = runs.find((r) => r.id === activeId) ?? runs[0];
  const total = active.steps.length;

  const [cursor, setCursor] = useState(total);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const isPlaying = playing && cursor < total;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => setCursor((c) => c + 1), STEP_MS);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  function selectRun(id: string) {
    const run = runs.find((r) => r.id === id);
    if (!run) return;
    setActiveId(id);
    setCursor(run.steps.length);
    setPlaying(false);
    setSelected(null);
  }

  function fork(stepIndex: number, value: string) {
    const key = active.steps[stepIndex].inputKey as InputKey;
    const n = runs.length + 1;
    const run = buildRun(`r${n}`, `Run ${n}`, { ...active.inputs, [key]: value }, active.id, stepIndex);
    setRuns((r) => [...r, run]);
    setActiveId(run.id);
    setSelected(null);
    setCursor(reducedMotion ? run.steps.length : stepIndex);
    setPlaying(!reducedMotion);
  }

  function stateOf(i: number): StepState {
    if (i < cursor) return "done";
    return i === cursor && isPlaying ? "running" : "pending";
  }

  const parent = runs.find((r) => r.id === active.parentId);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-medium">{TASK}</h1>
        <p className="text-sm text-muted-foreground">
          Tap a step to change its input and fork a new run. Steps before the fork are reused.
        </p>
      </header>

      <ToggleGroup
        type="single"
        value={activeId}
        onValueChange={(v) => v && selectRun(v)}
        className="flex-wrap"
        aria-label="Runs"
      >
        {runs.map((r) => (
          <ToggleGroupItem key={r.id} value={r.id} variant="outline" className="min-h-11">
            {r.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {parent && active.forkStep !== null && (
        <p className="text-xs text-muted-foreground">
          Forked from {parent.label} at step {active.forkStep + 1}:{" "}
          {INPUT_LABELS[active.steps[active.forkStep].inputKey as InputKey].toLowerCase()} changed.
        </p>
      )}

      <div className="flex items-center gap-3">
        <Slider
          min={0}
          max={total}
          step={1}
          value={[cursor]}
          onValueChange={([v]) => {
            setPlaying(false);
            setCursor(v);
          }}
          className="py-3"
          aria-label="Scrub run"
        />
        <span className="w-12 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
          {cursor}/{total}
        </span>
        <Button
          variant="outline"
          onClick={() => {
            setCursor(reducedMotion ? total : 0);
            setPlaying(!reducedMotion);
          }}
        >
          Replay
        </Button>
      </div>

      <ol className="flex flex-col">
        {active.steps.map((step, i) => (
          <li key={step.id}>
            <StepRow
              step={step}
              index={i}
              state={stateOf(i)}
              cached={active.forkStep !== null && i < active.forkStep}
              selected={selected === i}
              onSelect={() => setSelected(selected === i ? null : i)}
            />
            <Collapse open={selected === i}>
              {selected === i && (
                <StepDetail
                  key={`${active.id}-${step.id}`}
                  step={step}
                  inputs={active.inputs}
                  canFork={runs.length < MAX_RUNS}
                  onFork={(v) => fork(i, v)}
                />
              )}
            </Collapse>
          </li>
        ))}
      </ol>

      <AnswerCard run={active} parent={parent} ready={cursor >= total} />
    </main>
  );
}
