# Context Tray

## What It Does
A row of chips shows every MCP source the agent is drawing on. Turning a chip off folds away the claims that came from it, and the verdict recomputes, so you can see what each source contributed.

## Architecture
```
data.ts (sources, claims with a lean -2..+2)
   │
   ▼
context-tray.tsx ── active: Set<SourceId>
   │            │
   ▼            ▼
source-chip.tsx   compose.ts verdictFor(active) ──► Verdict
                  answer.tsx (claims in Collapse, verdict card)
```

## Frontend
- `active` is the only state. Claims stay mounted and animate open or closed with `Collapse`; closed claims are `inert` so they leave the tab order and screen readers.
- The verdict is the sum of the active claims' leans: +2 or more leans renew, -2 or less leans hold, otherwise mixed. Fewer than three claims reads "Not enough context".
- The tray is sticky under the header so it stays reachable while you read.

## Key Dependencies
Shared `Button`, `Badge`, `Collapse`.

## Component Tree
```
ContextTray (inside ControlsLayout; desktop sidebar shows the description)
├── SourceChip × 5 (sticky tray)
└── Answer
    ├── verdict card
    └── claims × 10 (Collapse)
```

## Error Handling
No network or storage. Verdict logic is pure and handles an empty tray.

## File Structure
```
context-tray/
├── page.tsx
├── context-tray.tsx
├── source-chip.tsx
├── answer.tsx
├── compose.ts
├── data.ts
├── types.ts
├── metadata.json
└── HOW_IT_WORKS.md
```
