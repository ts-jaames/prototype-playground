# Eval Case Grid — How It Works

## What It Does

A 30-case × N-run matrix of pass/fail results. Patterns carry the meaning: a vertical stripe is a change that broke many cases at once, a horizontal speckle is a flaky case, a solid red row is a case that never passes. Tap or drag on the grid to inspect any cell.

## Architecture

```
controls (scenario, runs, sort)
      │
      ▼
generateResults(scenario, runs)  [seeded matrix]
      ├─► findInsights()  → stripes / flaky / stuck, each with a cursor
      └─► sortRows()      → name | failures | flakiness
                │
                ▼
CaseGrid (cursor state)
  ├─ Insights    tap → jump cursor
  ├─ ResultGrid  one SVG surface; pointer + arrow keys → cursor
  └─ DetailPanel selected cell, mock assertion line, prev/next buttons
```

## Frontend

- **Single interactive surface**: the grid is one element handling pointer down/move and arrow keys, instead of hundreds of tiny tap targets. `touch-action: pan-y` keeps vertical page scroll working.
- **Cursor** is `{ caseId, run }`, so it survives re-sorting. Until the user picks a cell it points at the first insight.
- **Insights** are computed from the matrix: ≥ max(4, 15%) cases starting to fail in the same run = stripe; ≥ 3 flips = flaky; failing in every run = stuck.
- **Responsive**: grid is `max-w-sm` and scales as SVG; detail buttons are 44px.

## API

None. Deterministic mock data.

## Key Dependencies

- `@/components/playground/controls`
- shadcn/ui `Button`, `Badge`; `lucide-react` chevrons (functional)

## Component Tree

```
EvalCaseGridPage
└─ CaseGrid
   └─ ControlsLayout
      ├─ Insights
      ├─ ResultGrid
      └─ DetailPanel
```

## Error Handling

`clampCursor` repairs a cursor that points at a missing case or run after a control change.

## File Structure

```
eval-case-grid/
├─ page.tsx, metadata.json, HOW_IT_WORKS.md
├─ types.ts, utils.ts
├─ data.ts        controls, case names, sample assertion lines
├─ results.ts     generateResults (pure)
├─ analysis.ts    sort, insights, cursor clamp (pure)
├─ case-grid.tsx  composition
├─ result-grid.tsx, detail-panel.tsx, insights.tsx
```
