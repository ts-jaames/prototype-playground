# Flow Field — How It Works

## What It Does

Thousands of particles follow a vector field built from seeded Perlin noise, leaving fading trails on a canvas. Pattern, particle count, speed, turbulence, trail length, line width and color are tunable, with Reset and Randomize.

## Architecture

```
useControls (schema in data.ts, persisted to localStorage "pp:flow-field:controls")
      │ values
      ▼
FlowField ──► ControlsLayout ──► ControlPanel (sidebar ≥lg, bottom sheet <lg)
      │
      ├─ playing, seed ──► PlaybackBar (Play/Pause, New seed)
      ▼
FlowCanvas
  live ref ◄── settings + resolved token colors (useCssColor)
      │
      ▼  requestAnimationFrame loop
  simulation.ts: fieldAngle(noise.ts) → stepParticle → draw segment
```

## Frontend

- **State**: control values live in `useControls` (shared library). `playing` defaults to `!prefers-reduced-motion` until the user picks; `seed` restarts the field with a new noise seed.
- **Render loop**: one `requestAnimationFrame` loop per seed. It reads the latest settings from a ref, so tweaking a control never restarts the simulation. Changing particle count grows/shrinks the list in place.
- **Paused / reduced motion**: on start, resize, or any change while paused, the canvas is cleared and `WARMUP_FRAMES` are simulated instantly, so the still image always reflects current settings.
- **Theme**: canvas colors come from design tokens (`--card` for background, `--chart-N` for strokes) via `useCssColor`, which re-reads them when the `<html>` class changes.
- **Responsive**: square canvas in a `max-w-2xl` column; ResizeObserver resizes the backing store (capped at 2× DPR). Playback buttons are icon-only below `sm`.
- **Shortcuts**: none.

## API

None. Everything runs in the browser.

## Key Dependencies

- `@/components/playground/controls`: schema-driven control panel, persistence, Reset/Randomize
- `@/components/playground/hooks`: `useCssColor`, `usePrefersReducedMotion`
- shadcn/ui `Button`; `lucide-react` icons
- Canvas 2D API (no extra packages)

## Component Tree

```
FlowFieldPage (page.tsx)
└─ FlowField
   └─ ControlsLayout
      ├─ FlowCanvas
      ├─ PlaybackBar
      └─ ControlPanel (rendered in sidebar and mobile sheet)
```

## Error Handling

- Missing 2D context: the canvas effect exits early and renders an empty card.
- Corrupt or outdated saved controls: `sanitizeValues` drops invalid entries and falls back to defaults; storage errors are swallowed.

## File Structure

```
flow-field/
├─ page.tsx          thin route + metadata
├─ metadata.json
├─ HOW_IT_WORKS.md
├─ types.ts          FlowSettings, Particle, Noise2D
├─ data.ts           control schema, constants
├─ noise.ts          seeded PRNG + Perlin noise (pure)
├─ simulation.ts     spawn / step / field angle (pure)
├─ flow-field.tsx    composition + playback state
├─ flow-canvas.tsx   canvas + animation loop
└─ playback-bar.tsx  Play/Pause + New seed
```
