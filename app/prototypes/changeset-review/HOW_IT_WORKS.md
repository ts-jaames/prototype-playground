# Changeset Review

## What It Does
An agent has read calendar, email and tasks through MCP and proposes six edits. Each shows a before/after diff and the tool it would call. You accept or reject each one (swipe or tap), then apply only the accepted set.

## Architecture
```
data.ts (mock proposals)
   │
   ▼
changeset-review.tsx  ── statuses: Record<id, accepted | rejected | applied>
   │            │
   ▼            ▼
change-card.tsx   apply-bar.tsx
(swipe + buttons) (counts, Apply)
```

## Frontend
- State lives in one `statuses` map. Undo deletes the key.
- Swipe uses pointer events with pointer capture; dragging past 88px commits, otherwise the card springs back. `touch-pan-y` keeps vertical scroll working.
- Every swipe has a visible button equivalent (no gesture-only actions).
- Apply marks accepted changes `applied` one by one on a timer, then shows a toast. Decisions lock while applying.
- The apply bar is sticky and respects the bottom safe area.

## Key Dependencies
`sonner` (toast), `lucide-react`, shared `Button` and `Badge`.

## Component Tree
```
ChangesetReview
├── header
├── ChangeCard × 6
└── ApplyBar
```

## Error Handling
No network or storage. Timers are cleared on unmount. Apply is disabled with zero accepted changes.

## File Structure
```
changeset-review/
├── page.tsx
├── changeset-review.tsx
├── change-card.tsx
├── apply-bar.tsx
├── data.ts
├── types.ts
├── metadata.json
└── HOW_IT_WORKS.md
```
