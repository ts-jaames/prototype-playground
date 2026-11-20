export type Directive = "deeper" | "shorter" | "angle" | "sources";

/** The point where the reader redirected: after clause `clause` of the original answer. */
export type Cut = { clause: number; directive: Directive };
