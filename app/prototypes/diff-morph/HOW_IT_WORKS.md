# Diff Morph

## What It Does
Shows an agent's answer changing between revisions. Words that survive the edit glide from their old position to their new one, removed words fade out where they were, and new words fade in (optionally with a brief tint). You see what changed without rereading the paragraph.

## Architecture
```
revision picked
   │
   ▼
diff-morph.tsx goTo():
   1. measure(): record every word's position            (motion.ts)
   2. diffTokens(): word-level LCS, survivors keep their id (diff.ts)
   3. setTokens(): React renders the new text
   │
   ▼
useLayoutEffect: measure again, playMorph() animates each survivor from (before - after)
```

## Frontend
- This is the FLIP technique: First (measure), Last (measure after render), Invert (offset back to the old spot), Play (animate to none) using the Web Animations API, so no animation state lives in React.
- Word identity comes from the diff: a word that matches in the longest common subsequence keeps its id, so React keeps the same DOM node and the animation has a stable target.
- Removed words are rendered as absolutely positioned ghosts at their old coordinates, faded out, then cleared by a timer.
- Controls: duration, per-word stagger, and a toggle for tinting new words (shared control panel with Reset and Randomize).
- Reduced motion: revisions swap instantly with no ghosts or animation.
- A text line reports kept, added and removed counts, so the change is readable without seeing the motion.

## Key Dependencies
Shared control panel, `ToggleGroup`, `usePrefersReducedMotion`. No animation library.

## Component Tree
```
DiffMorph
├── ControlsLayout (panel: ControlPanel)
├── ToggleGroup (revisions)
├── MorphText (word spans + ghosts)
└── change summary
```

## Error Handling
No network or storage. If a word can't be measured (not mounted), it is skipped rather than animated. The ghost-clearing timer is replaced on each revision.

## File Structure
```
diff-morph/
├── page.tsx
├── diff-morph.tsx
├── morph-text.tsx
├── diff.ts
├── motion.ts
├── data.ts
├── types.ts
├── metadata.json
└── HOW_IT_WORKS.md
```
