# MCP Call Ledger — How It Works

## What It Does

A simulated agent makes MCP tool calls across four servers. The top shows a live feed; below, every tool is a row with a risk tag (read / write / destructive), a 12-tick sparkline, call and error counts, and an Allow / Ask / Block control. Changing the policy changes what happens to the very next call.

## Architecture

```
usePolicy (localStorage "pp:mcp-call-ledger:policy")
      │ policy (read through a ref)
      ▼
useLedger ── setInterval(TICK_MS) ──► stepLedger(state, policy, opts, rng)  [pure]
      │          allow → ok | error     ask → pending     block → blocked
      │
      ├─ decide(callId, approve) ──► decideCall()  pending → ok | error | denied
      ▼
CallLedger ──► LiveFeed (pending + last 5 settled)
          └──► ToolRow × n ◄── toolStats(calls)  [counts + sparkline buckets]
```

## Frontend

- **Policy is the control**: the row you monitor is the row you tighten. Defaults: read and write allow, destructive ask.
- **Pending calls** stay in the feed with Approve / Deny until decided, however many newer calls arrive.
- **Persistence**: policy is saved after the first read (hydrated flag); controls use the shared hook.
- **Responsive**: one column; the policy control is a full-width three-button radio group under each tool.

## API

None. Simulated in the browser.

## Key Dependencies

- `@/components/playground/controls`, `@/components/playground/collapse`
- shadcn/ui `Button`, `Badge`

## Component Tree

```
McpCallLedgerPage
└─ CallLedger
   └─ ControlsLayout
      ├─ LiveFeed
      └─ ToolRow × n ─ Sparkline, PolicyButtons
```

## Error Handling

localStorage reads and writes are wrapped in try/catch; invalid saved policy values fall back to defaults.

## File Structure

```
mcp-call-ledger/
├─ page.tsx, metadata.json, HOW_IT_WORKS.md
├─ types.ts, utils.ts
├─ data.ts            controls, servers/tools, default policy
├─ simulation.ts      stepLedger, decideCall, toolStats (pure)
├─ use-ledger.ts, use-policy.ts
├─ call-ledger.tsx    composition
├─ live-feed.tsx, tool-row.tsx, policy-buttons.tsx, sparkline.tsx
```
