# Interject Mid-Stream

## What It Does
An answer streams in word by word, paced like reading: short pauses at commas, longer at the end of a sentence. Tap any sentence to pause, then redirect (go deeper, shorter, a new angle, cite sources). The text before your tap stays; a new continuation streams after it, and the abandoned tail is kept behind a toggle.

## Architecture
```
data.ts (BASE clauses, BRANCHES per directive)
   │
   ▼
stream.ts buildSequence(cut) ──► clauses + how many are original
   │
   ▼
interject-stream.tsx ── cut, revealed (words shown), picked (paused clause)
   ├── Clause (per-word fade-in; original clauses are tappable)
   └── RedirectBar (appears while paused)
```

## Frontend
- `revealed` counts words shown. A timeout chain adds one word at a time, with the delay chosen by the previous word's punctuation (`delayAfter`).
- Tapping an original clause sets `picked`, which pauses streaming. Choosing a directive sets `cut`, keeps the prefix visible, and streams the branch after it.
- Each word is its own span with a fade-in, keyed by position so only new words animate.
- Under reduced motion everything is shown immediately.
- The tappable unit is a sentence (not a word) so tap targets stay large on mobile. Branch text is not redirectable; Restart resets.

## Key Dependencies
Shared `Button`, `Badge`, `Collapse`; `tw-animate-css` for fade-ins.

## Component Tree
```
InterjectStream
├── Clause × n
├── discarded continuation (Collapse)
└── RedirectBar
```

## Error Handling
No network or storage. Timers are cleared on every effect change and on unmount.

## File Structure
```
interject-stream/
├── page.tsx
├── interject-stream.tsx
├── clause.tsx
├── redirect-bar.tsx
├── stream.ts
├── data.ts
├── types.ts
├── metadata.json
└── HOW_IT_WORKS.md
```
