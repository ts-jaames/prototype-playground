# Agent Attention Queue — How It Works

## What It Does

Monitors a fleet of simulated agents by exception. Anything that needs a human surfaces as a one-line ask with approve / redirect / stop; running agents recede into a quiet strip of thin progress lines.

## Architecture

```
controls (askRate, speed, sort, paused)
      │
      ▼
useQueue ── setInterval(TICK_MS) ──► stepQueue(state, opts, seeded rng)  [pure]
      │                                  ├─ advance running agents
      │                                  ├─ maybe raise an ask (ASK_TEMPLATES)
      │                                  └─ revive finished agents from TASK_POOL
      ▼
AttentionQueue ──► AskCard × n (sorted by urgency or age)
      │                └─ resolve → card collapses → onExited → resolveAsk()
      └──────────► RunningStrip (one Collapse row per agent)
```

## Frontend

- **State**: `QueueState` (agents, tick, counters) lives in `useQueue`. Each interval creates a fresh seeded RNG so the state updater stays pure.
- **Ask lifecycle**: tapping an action marks the agent as `leaving`; the card collapses, and only on `onExited` is the resolution applied. The agent then rejoins the strip.
- **Ask kinds**: `approve` offers Approve / Redirect (reveals redirect choices) / Stop. `choose` and `unblock` show their answers directly as buttons.
- **Sorting**: urgency = template urgency + age/6, or oldest first.
- **Time**: one tick (1.5s) reads as one minute.
- **Responsive**: single `max-w-2xl` column; actions wrap; controls in a sheet below `lg`.

## API

None. Everything is simulated in the browser.

## Key Dependencies

- `@/components/playground/controls`, `@/components/playground/collapse`
- shadcn/ui `Button`, `Badge`

## Component Tree

```
AgentAttentionQueuePage
└─ AttentionQueue
   └─ ControlsLayout
      ├─ AskCard × n
      └─ RunningStrip
```

## Error Handling

No network or storage beyond the shared controls hook. Resolving an ask for an agent that no longer has one is a no-op.

## File Structure

```
agent-attention-queue/
├─ page.tsx
├─ metadata.json
├─ HOW_IT_WORKS.md
├─ types.ts
├─ data.ts             controls, seed agents, ask templates
├─ utils.ts            seeded RNG
├─ simulation.ts       stepQueue, resolveAsk, sorting (pure)
├─ use-queue.ts        interval + state
├─ attention-queue.tsx composition
├─ ask-card.tsx
└─ running-strip.tsx
```
