// Pure helpers for the streaming view. No React.
import { BASE, BRANCHES } from "./data";
import type { Cut } from "./types";

export const words = (clause: string) => clause.split(" ");

/** The clauses currently on screen, and how many of them are original text. */
export function buildSequence(cut: Cut | null): { clauses: string[]; prefixLen: number } {
  if (!cut) return { clauses: BASE, prefixLen: BASE.length };
  const prefix = BASE.slice(0, cut.clause + 1);
  return { clauses: [...prefix, ...BRANCHES[cut.directive]], prefixLen: prefix.length };
}

/** Index of each clause's first word within the flattened word list. */
export function clauseStarts(clauses: string[]): number[] {
  const starts: number[] = [];
  let n = 0;
  for (const c of clauses) {
    starts.push(n);
    n += words(c).length;
  }
  return starts;
}

/** Pause after a word: longer at the end of a thought, so text arrives at reading pace. */
export function delayAfter(word: string | undefined): number {
  if (!word) return 250;
  if (/[.!?]$/.test(word)) return 380;
  if (/[,;:]$/.test(word)) return 190;
  return 55;
}
