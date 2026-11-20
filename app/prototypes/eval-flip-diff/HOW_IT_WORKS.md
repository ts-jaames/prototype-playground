# Eval Flip Diff — How It Works

## What It Does

Compares a candidate eval run against a fixed baseline across 48 cases and shows only what flipped across the pass bar. Regressions (pass→fail) and fixes (fail→pass) are listed by size of change; sub-threshold crossings, and everything unchanged, collapse into counts.

## Architecture

```
controls (run, passBar, noiseFloor)
      │
      ▼
generateCases(run)  [seeded: fixed baseline + per-run perturbation]
      │
      ▼
classify(cases, passBar, noiseFloor) → regression | fix | noise | unchanged
      │
      ├─► summarize() ─► FlipSummary
      └─► FlipGroup × 4 ─► FlipRow ─► ScoreBars (+ expandable failure note)
```

## Frontend

- **Flip** = the score crosses `passBar`. It counts as a regression/fix only if `|delta| ≥ noiseFloor`; smaller crossings are "noise".
- **Rows** show baseline (top) and candidate (bottom) bars with a tick at the pass bar. Tapping expands a failure note.
- **Groups**: Regressions and Fixes open by default; Below noise floor and Unchanged start collapsed.
- **Responsive**: single column; row headers are 44px-tall buttons.

## API

None. Scores are deterministic mock data.

## Key Dependencies

- `@/components/playground/controls`, `@/components/playground/collapse`

## Component Tree

```
EvalFlipDiffPage
└─ FlipDiff
   └─ ControlsLayout
      ├─ FlipSummary
      └─ FlipGroup × 4 ─ FlipRow × n ─ ScoreBars
```

## Error Handling

No network or storage beyond the shared controls hook. An unknown run id falls back to run B.

## File Structure

```
eval-flip-diff/
├─ page.tsx, metadata.json, HOW_IT_WORKS.md
├─ types.ts, utils.ts
├─ data.ts         controls, suites, note pool
├─ cases.ts        generateCases, classify, summarize (pure)
├─ flip-diff.tsx   composition
├─ flip-summary.tsx, flip-group.tsx, flip-row.tsx, score-bars.tsx
```
