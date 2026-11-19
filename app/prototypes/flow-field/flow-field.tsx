"use client";

import { useState } from "react";

import { ControlPanel, ControlsLayout, useControls } from "@/components/playground/controls";
import { usePrefersReducedMotion } from "@/components/playground/hooks";

import { controls as schema, NAMESPACE } from "./data";
import { FlowCanvas } from "./flow-canvas";
import { PlaybackBar } from "./playback-bar";

export function FlowField() {
  const controls = useControls(NAMESPACE, schema);
  const reducedMotion = usePrefersReducedMotion();
  const [playChoice, setPlayChoice] = useState<boolean | null>(null);
  const [seed, setSeed] = useState(1);
  const playing = playChoice ?? !reducedMotion;

  return (
    <ControlsLayout panel={<ControlPanel controls={controls} />}>
      <FlowCanvas settings={controls.values} playing={playing} seed={seed} />
      <PlaybackBar
        playing={playing}
        onToggle={() => setPlayChoice(!playing)}
        onRestart={() => setSeed((s) => s + 1)}
      />
    </ControlsLayout>
  );
}
