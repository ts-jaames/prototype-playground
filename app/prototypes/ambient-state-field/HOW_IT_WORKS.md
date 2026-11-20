# Ambient State Field

## What It Does
A particle field that shows what an agent is doing through motion alone, in place of a spinner: drifting and wide while searching, tightening into a ring as it converges, splitting and shaking when two answers compete, and settling into a calm ring when done. State changes blend over about a second. A "Run demo" button plays a scripted agent run.

## Architecture
```
data.ts (STATE_PARAMS: one parameter set per state)
   │
   ▼
ambient-field.tsx ── state (manual or from the demo script)
   │
   ▼
field-canvas.tsx  rAF loop
   ├── blendParams(current → target)   every frame, so states ease into each other
   └── stepDot(): noise flow + ring spring + swirl + spread + jitter   (field.ts)
```

## Frontend
- Each state is a set of numbers (`Params`); the canvas keeps a `current` set and eases it toward the target each frame, so transitions are continuous rather than switched.
- Two hypotheses are shown as two dot groups. In "Uncertain" the groups pull toward separate centers and shake; in other states both share one center.
- The loop reads props from a ref (same approach as `flow-field`), so changing state or controls never restarts the animation.
- Reduced motion: starts paused and renders a settled still frame for the current state. A Play/Pause button is always available.
- A text label and caption name the state, so meaning is never carried by motion alone.
- Controls: particle count, trail, intensity (shared control panel with Reset and Randomize).

## Key Dependencies
Shared control panel, `ToggleGroup`, `Button`, `useCssColor`, `usePrefersReducedMotion`. `noise.ts` is a local copy of the seeded noise helpers.

## Component Tree
```
AmbientField
├── ControlsLayout (panel: ControlPanel)
├── FieldCanvas
├── state label + caption
├── StateBar (ToggleGroup + Run demo)
└── Pause/Play
```

## Error Handling
Canvas context absence exits quietly. Resize is handled by a `ResizeObserver` that rebuilds the field. The demo timer is cleared on unmount.

## File Structure
```
ambient-state-field/
├── page.tsx
├── ambient-field.tsx
├── field-canvas.tsx
├── state-bar.tsx
├── field.ts
├── noise.ts
├── data.ts
├── types.ts
├── metadata.json
└── HOW_IT_WORKS.md
```
