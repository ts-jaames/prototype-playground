# Evidence Gates — How It Works

## What It Does

A simulated harness run with four gates (Plan, Prototype, Evals, Release). Work progresses toward a gate, then the run stops and shows evidence against that gate's criteria. A human chooses Go, Redirect or Stop. Progress is decisions, not a percentage.

## Architecture

```
controls (quality, speed, paused)
      │ (read through a ref)
      ▼
useRun ── setInterval(TICK_MS) ──► tick(state, dt, quality, rng)   [pure, run.ts]
      │        working gate: work += dt; at 100 → awaiting + makeEvidence()
      │
      └─ decide(i, Go | Redirect(note) | Stop) ──► decide()         [pure]
              Go → passed, next gate working
              Redirect → back to working at 45%, attempts+1 (better evidence odds)
              Stop → gate stopped, later gates stay locked
      ▼
EvidenceGates ──► GateRow × 4 ──► progress bar | EvidenceList + DecisionBar | summary
```

## Frontend

- **Evidence** is generated when a gate is reached: each criterion passes with probability `quality` (+30 points per redirect), landing on the right or wrong side of its threshold.
- **Go with a miss** needs a second tap ("Go anyway (n missed)"); the pass summary records how many were waived.
- **First paint** opens with gate 1 passed and gate 2 waiting with one miss, so there's a real decision on screen.
- **Rows** animate between working, awaiting and passed states with `Collapse`.
- **Responsive**: single column; buttons wrap; criteria rows truncate labels.

## API

None. Simulated in the browser.

## Key Dependencies

- `@/components/playground/controls`, `@/components/playground/collapse`
- shadcn/ui `Button`, `Badge`

## Component Tree

```
EvidenceGatesPage
└─ EvidenceGates
   └─ ControlsLayout
      └─ GateRow × 4 ─ EvidenceList, DecisionBar
```

## Error Handling

`decide` ignores decisions for gates that aren't awaiting; `tick` is a no-op when no gate is working.

## File Structure

```
evidence-gates/
├─ page.tsx, metadata.json, HOW_IT_WORKS.md
├─ types.ts, utils.ts
├─ data.ts            controls, gate definitions, constants
├─ run.ts             evidence generation, tick, decide (pure)
├─ use-run.ts         interval + state
├─ evidence-gates.tsx composition
├─ gate-row.tsx, evidence-list.tsx, decision-bar.tsx
```
