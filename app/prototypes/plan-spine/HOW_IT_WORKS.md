# Plan Spine — How It Works

## What It Does

Shows an eight-step harness run as a vertical spine. The straight dotted line is the plan; each step's node is offset sideways by how far its start has slipped from plan, so the spine bends as the run drifts. Completed steps are solid, projected steps dashed. The header shows a live ETA and the slip versus plan; Replan rewrites the plan from actuals and straightens the spine.

## Architecture

```
controls (overrun, speed, paused)
      │ (read through a ref)
      ▼
usePlan ── setInterval(TICK_MS) ──► advance(state, dt, overrun)  [pure]
      │      step duration = work × (1 + overrun + per-step noise)
      │
      ├─ replan() ──► replan(state)   done → actual, rest → planned × pace
      ▼
project(state)  [pure]  pace = elapsed / planned-work-done
      │   done: actual · active: now + remaining × pace · pending: sequential × pace
      ▼
PlanHeader (ETA, slip, Replan/Restart)    Spine (SVG)   StepLabel × 8
```

## Frontend

- **Bend**: node x = centre + clamp(drift minutes × 3px, ±42px); segments are cubic Béziers between nodes. The dotted vertical line is the plan.
- **Projection** assumes the pace observed so far continues. Pace of 1.00× means on plan.
- **Replan** sets done steps' plan to their actual duration and scales the remaining steps by pace; drift returns to ~0 and the spine straightens.
- **First paint** warms up 44 simulated minutes so the spine is already bent.
- **Responsive**: SVG column is fixed 104px; labels sit beside it; buttons collapse to icons below `sm`.

## API

None. Simulated in the browser.

## Key Dependencies

- `@/components/playground/controls`
- shadcn/ui `Button`, `Badge`; `lucide-react` icons

## Component Tree

```
PlanSpinePage
└─ PlanSpine
   └─ ControlsLayout
      ├─ PlanHeader
      └─ Spine + StepLabel × 8
```

## Error Handling

Pure functions guard divide-by-zero (pace defaults to 1 before any work is done) and a finished run stops advancing.

## File Structure

```
plan-spine/
├─ page.tsx, metadata.json, HOW_IT_WORKS.md
├─ types.ts, utils.ts
├─ data.ts        controls, plan steps, noise, constants
├─ sim.ts         advance, project, replan, formatting (pure)
├─ use-plan.ts    interval + state
├─ plan-spine.tsx composition
├─ plan-header.tsx, spine.tsx, step-label.tsx
```
