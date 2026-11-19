import { defineControls } from "@/components/playground/controls";

/** localStorage namespace for this prototype. */
export const NAMESPACE = "flow-field";

export const controls = defineControls({
  pattern: {
    type: "select",
    label: "Pattern",
    default: "noise",
    options: [
      { value: "noise", label: "Noise" },
      { value: "swirl", label: "Swirl" },
      { value: "waves", label: "Waves" },
    ],
  },
  count: { type: "slider", label: "Particles", min: 100, max: 3000, step: 100, default: 1200 },
  speed: { type: "slider", label: "Speed", min: 0.2, max: 4, step: 0.1, default: 1.2 },
  turbulence: { type: "slider", label: "Turbulence", min: 1, max: 20, step: 1, default: 6 },
  trail: { type: "slider", label: "Trail", min: 0, max: 98, step: 1, default: 90, unit: "%" },
  lineWidth: { type: "slider", label: "Line width", min: 0.5, max: 4, step: 0.5, default: 1 },
  color: { type: "color", label: "Color", default: "chart-1" },
});

/** Frames simulated instantly on (re)start so a paused or reduced-motion view isn't blank. */
export const WARMUP_FRAMES = 90;

/** Particle lifetime range in frames before respawning somewhere random. */
export const LIFE_RANGE = [80, 260] as const;

/** Noise coordinates per pixel at turbulence = 1. */
export const NOISE_SCALE = 0.0006;
