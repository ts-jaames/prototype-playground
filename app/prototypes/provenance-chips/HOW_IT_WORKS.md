# Provenance Chips

## What It Does
An agent-written account brief where every value shows the MCP source it came from and how fresh it is. Tap a chip to compare what each source returned, swap one in, or re-query it. The summary sentence rewrites from whatever is selected.

## Architecture
```
data.ts (readings per field, from several tools)
   │
   ▼
provenance-chips.tsx ── states: Record<field, { readings, selected }>
   │            │
   ▼            ▼
field-row.tsx   format.ts summarize() ──► summary sentence
   └── source-popover.tsx (pick source, re-query)
```

## Frontend
- Each field keeps all readings and which source is selected. The agent's original pick is the first reading.
- A "differs" badge appears when sources return more than one distinct value. Values older than a day get a "stale" badge, so state is never carried by color alone.
- Re-query is simulated: 900ms spinner, then the reading's value updates to `requeryValue` (when set) and its age resets to "just now".
- Chips are 44px tall tap targets; the popover is width-capped to the viewport.

## Key Dependencies
shared `Popover`, `Badge`, `Button`, `Separator`, `lucide-react`.

## Component Tree
```
ProvenanceChips (inside ControlsLayout; desktop sidebar shows the description)
├── FieldRow × 5
│   └── Popover → SourcePopover
└── summary section
```

## Error Handling
No network or storage. The re-query timer is cleared on unmount.

## File Structure
```
provenance-chips/
├── page.tsx
├── provenance-chips.tsx
├── field-row.tsx
├── source-popover.tsx
├── format.ts
├── data.ts
├── types.ts
├── metadata.json
└── HOW_IT_WORKS.md
```
