# Steering Dials

## What It Does
Steer an agent's findings with dials (scope, recency, relevance floor, depth, grouping) instead of rewording a prompt. The panel also shows the MCP tool calls those settings translate to, so the dials read as a UI for tool arguments.

## Architecture
```
useControls (persisted dials)
   │
   ▼
query.ts runQuery(settings) ──► { items, calls }   (pure filter + sort)
   │                               │
   ▼                               ▼
steering-dials.tsx ──► ResultCard list   CallsPanel
   └── diffIds(prev, next) ──► "+2 −1" and "new" badges
```

## Frontend
- Dials come from the shared control panel (`defineControls`): sidebar on desktop, bottom sheet on mobile. Reset and Randomize come with it.
- Results recompute on every change; sorting is by relevance.
- The previous result set is stored during render (not in an effect) so added items get a "new" badge and the count shows `+added −removed`.
- Depth only changes how much text each card shows; it doesn't change which items match.

## Key Dependencies
Shared `ControlPanel`/`ControlsLayout`, `Badge`.

## Component Tree
```
SteeringDials
├── ControlsLayout (panel: ControlPanel)
├── CallsPanel
└── ResultCard × n
```

## Error Handling
Controls storage is handled by the shared hook (try/catch, loaded on mount). An empty result set shows guidance on which dial to move.

## File Structure
```
steering-dials/
├── page.tsx
├── steering-dials.tsx
├── result-card.tsx
├── calls-panel.tsx
├── query.ts
├── data.ts
├── types.ts
├── metadata.json
└── HOW_IT_WORKS.md
```
