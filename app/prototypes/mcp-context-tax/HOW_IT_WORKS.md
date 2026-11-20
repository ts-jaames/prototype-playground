# MCP Context Tax — How It Works

## What It Does

Shows what five MCP servers' tool definitions cost in context tokens, split into tools that get called and tools that never do (within a chosen period). Prune unused tools per server or all at once and the budget bar gives the tokens back.

## Architecture

```
controls (period, budget, threshold)      pruned: Set<toolId>  (component state)
      │                                          │
      └──────────────┬───────────────────────────┘
                     ▼
   tax.ts: isUnused / totals / unusedLoaded  [pure, over data.ts SERVERS]
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
  BudgetBar     prune buttons   ServerRow × 5 ─ stacked segment bar + ToolLine × n
```

## Frontend

- **Unused** means fewer than `threshold` calls in the selected period; changing either control reclassifies instantly.
- **Segment bar** per server: one segment per tool, width proportional to tokens; green-ish = called, amber = never called, border colour = pruned.
- **Budget bar** transitions widths; if loaded tokens exceed the budget it flags the overage.
- **Rows** expand with `Collapse`; the header is a 44px-tall button.
- **Pruning is in-memory** only; nothing is persisted.

## API

None. Data is static mock data in `data.ts`.

## Key Dependencies

- `@/components/playground/controls`, `@/components/playground/collapse`
- shadcn/ui `Button`

## Component Tree

```
McpContextTaxPage
└─ ContextTax
   └─ ControlsLayout
      ├─ BudgetBar
      ├─ prune / restore buttons
      └─ ServerRow × 5 ─ ToolLine × n
```

## Error Handling

No network or storage. Pruning an already-pruned tool is idempotent.

## File Structure

```
mcp-context-tax/
├─ page.tsx, metadata.json, HOW_IT_WORKS.md
├─ types.ts
├─ data.ts          controls, servers and per-period call counts
├─ tax.ts           classification + totals (pure)
├─ context-tax.tsx  composition and prune state
├─ budget-bar.tsx, server-row.tsx, tool-line.tsx
```
