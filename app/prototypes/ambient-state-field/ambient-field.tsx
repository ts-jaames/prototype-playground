"use client";

import { useEffect, useState } from "react";

import { ControlPanel, ControlsLayout, useControls } from "@/components/playground/controls";
import { usePrefersReducedMotion } from "@/components/playground/hooks";
import { Button } from "@/components/ui/button";

import { controls as schema, DEMO, NAMESPACE, STATES } from "./data";
import { FieldCanvas } from "./field-canvas";
import { StateBar } from "./state-bar";
import type { AgentState } from "./types";

export function AmbientField() {
  const controls = useControls(NAMESPACE, schema);
  const reducedMotion = usePrefersReducedMotion();
  const [playChoice, setPlayChoice] = useState<boolean | null>(null);
  const playing = playChoice ?? !reducedMotion;

  const [manual, setManual] = useState<AgentState>("searching");
  const [demoStep, setDemoStep] = useState<number | null>(null);
  const state = demoStep === null ? manual : DEMO[demoStep].state;
  const info = STATES.find((s) => s.id === state) ?? STATES[0];

  useEffect(() => {
    if (demoStep === null) return;
    const timer = window.setTimeout(
      () => setDemoStep((i) => (i === null || i + 1 >= DEMO.length ? null : i + 1)),
      DEMO[demoStep].ms,
    );
    return () => window.clearTimeout(timer);
  }, [demoStep]);

  return (
    <ControlsLayout panel={<ControlPanel controls={controls} />}>
      <FieldCanvas state={state} settings={controls.values} playing={playing} />

      <div className="flex flex-col gap-1" aria-live="polite">
        <p className="text-sm font-medium">{info.label}</p>
        <p className="text-sm text-muted-foreground">{info.caption}</p>
        {demoStep !== null && <p className="font-mono text-xs text-muted-foreground">{DEMO[demoStep].note}</p>}
      </div>

      <StateBar
        state={state}
        demoRunning={demoStep !== null}
        onState={(s) => {
          setDemoStep(null);
          setManual(s);
        }}
        onDemo={() => setDemoStep(0)}
      />

      <Button variant="ghost" className="self-start" onClick={() => setPlayChoice(!playing)}>
        {playing ? "Pause" : "Play"}
      </Button>
    </ControlsLayout>
  );
}
