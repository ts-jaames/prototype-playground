"use client";

import { ControlPanel, ControlsLayout, useControls } from "@/components/playground/controls";

import { controls as schema, NAMESPACE } from "./data";
import { PlanHeader } from "./plan-header";
import { project } from "./sim";
import { Spine } from "./spine";
import { StepLabel } from "./step-label";
import { usePlan } from "./use-plan";

export function PlanSpine() {
  const controls = useControls(NAMESPACE, schema);
  const { overrun, speed, paused } = controls.values;
  const { state, replans, replan, restart } = usePlan(overrun, speed, paused);
  const projection = project(state);

  return (
    <ControlsLayout panel={<ControlPanel controls={controls} />}>
      <PlanHeader
        projection={projection}
        replans={replans}
        finished={state.current === null}
        onReplan={replan}
        onRestart={restart}
      />
      <div className="relative">
        <Spine projection={projection} />
        {state.steps.map((step, i) => (
          <StepLabel key={step.name} step={step} projection={projection.steps[i]} />
        ))}
      </div>
    </ControlsLayout>
  );
}
