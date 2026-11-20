# Run Timeline + Fork

## What It Does
Shows an agent run as a list of MCP tool calls you can scrub through. Tap a step, change the input it owns, and fork a new run. Steps before the fork are marked reused; steps after it re-run, and the answer is compared against the parent run.

## Architecture
```
inputs ──► simulation.ts simulate() ──► steps[] + answer   (pure, deterministic)
              ▲
fork(step, value) ── merges one changed input ──► buildRun() ──► new Run
runs[] ──► run-timeline-fork.tsx ──► StepRow / StepDetail / AnswerCard
```

## Frontend
- `runs` holds every run; `activeId` picks the visible one. Switching runs shows it fully played.
- `cursor` is how many steps are revealed. The slider scrubs it; Replay and forking animate it forward on an interval (550ms per step). Under reduced motion it jumps to the end.
- The step detail uses `Collapse` so opening and closing never jumps the page.
- Runs are capped at 6 so the tab row stays readable.

## Key Dependencies
`date-fns`, shared `Slider`, `Select`, `ToggleGroup`, `Button`, `Badge`.

## Component Tree
```
RunTimelineFork (inside ControlsLayout; desktop sidebar shows the description)
├── ToggleGroup (runs)
├── Slider + Replay
├── StepRow × 5
│   └── StepDetail (args, result, Select + Fork)
└── AnswerCard
```

## Error Handling
No network or storage. Simulation is pure; an impossible quorum returns a "No day works" answer instead of throwing.

## File Structure
```
run-timeline-fork/
├── page.tsx
├── run-timeline-fork.tsx
├── step-row.tsx
├── step-detail.tsx
├── answer-card.tsx
├── simulation.ts
├── data.ts
├── types.ts
├── metadata.json
└── HOW_IT_WORKS.md
```
