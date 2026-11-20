import type { ControlValues } from "@/components/playground/controls";

import type { controls } from "./data";

export type MorphSettings = ControlValues<typeof controls>;

/** One word on screen. The id follows the word across revisions when it survives a diff. */
export type Token = { id: number; text: string };

export type Revision = { id: string; label: string; text: string };

export type DiffResult = {
  tokens: Token[];
  added: Set<number>;
  removed: Token[];
};

export type Box = { x: number; y: number };

/** A removed word, kept on screen briefly at its old position so it can fade out. */
export type Ghost = Token & Box;
