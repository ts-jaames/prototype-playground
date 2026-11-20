// Pure word diff. No React, no DOM.
import type { DiffResult, Token } from "./types";

export const split = (text: string) => text.split(/\s+/).filter(Boolean);

/** Longest common subsequence of two word lists, as [indexInA, indexInB] pairs. */
function matchWords(a: string[], b: string[]): [number, number][] {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const table = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const pairs: [number, number][] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      pairs.push([i, j]);
      i++;
      j++;
    } else if (table[i + 1][j] >= table[i][j + 1]) i++;
    else j++;
  }
  return pairs;
}

/** Tokens for the first view; ids are positions, so later ids can start after the last one. */
export function initialTokens(text: string): Token[] {
  return split(text).map((t, i) => ({ id: i + 1, text: t }));
}

/**
 * Turn the words on screen into the words of `nextText`. Words that survive keep their id, so the
 * view can animate them from their old position; the rest are added or removed.
 */
export function diffTokens(prev: Token[], nextText: string, nextId: () => number): DiffResult {
  const nextWords = split(nextText);
  const pairs = matchWords(
    prev.map((t) => t.text),
    nextWords,
  );
  const keptFor = new Map(pairs.map(([i, j]) => [j, prev[i]]));
  const keptIds = new Set(pairs.map(([i]) => prev[i].id));

  const added = new Set<number>();
  const tokens = nextWords.map((text, j): Token => {
    const kept = keptFor.get(j);
    if (kept) return kept;
    const token = { id: nextId(), text };
    added.add(token.id);
    return token;
  });
  return { tokens, added, removed: prev.filter((t) => !keptIds.has(t.id)) };
}
