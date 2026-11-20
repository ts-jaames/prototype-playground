# Permission Ladder

## What It Does
A simulated agent works through six steps that use five MCP tools. The first time it needs a tool it stops and asks, and you pick a rung: always, for this task, just this once, or don't allow. Riskier actions offer fewer rungs. An audit trail and a list of active permissions (with Revoke) show what you've granted.

## Architecture
```
data.ts (tools with risk, steps, rungs, allowed scopes per risk)
   │
   ▼
rules.ts: needsPermission / makeGrant / consume / keepPersistent  (pure)
   │
   ▼
permission-ladder.tsx ── index, grants, log, results
   ├── StepList        (progress + "Needs approval")
   ├── PermissionRequest (the ladder, in a Collapse)
   └── AuditList       (active grants + trail)
```

## Frontend
- "Waiting" is derived, not stored: the run is waiting when the current step's tool has no usable grant. Choosing a rung adds a grant, which un-derives it.
- A timer runs each unblocked step (800ms), logs a use, spends a one-time grant, and advances.
- Reads can be "always"; writes cap at "for this task"; sending is "once" only. Disabled rungs say why.
- "Run again" keeps only "always" grants, so the second run asks less.
- Step 3 reuses the email search tool, which shows the difference between "once" (asks again) and "for this task" (doesn't).

## Key Dependencies
Shared `Button`, `Badge`, `Collapse`.

## Component Tree
```
PermissionLadder
├── StepList
├── PermissionRequest (in Collapse)
├── Run button
└── AuditList
```

## Error Handling
No network or storage. The step timer is cleared whenever the state it depends on changes or on unmount.

## File Structure
```
permission-ladder/
├── page.tsx
├── permission-ladder.tsx
├── permission-request.tsx
├── step-list.tsx
├── audit-list.tsx
├── rules.ts
├── data.ts
├── types.ts
├── metadata.json
└── HOW_IT_WORKS.md
```
