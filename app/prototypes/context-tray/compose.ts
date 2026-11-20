// Pure: what the agent would conclude from the sources currently in context.
import { CLAIMS, MIN_CLAIMS } from "./data";
import type { Claim, SourceId, Verdict } from "./types";

export function activeClaims(active: ReadonlySet<SourceId>): Claim[] {
  return CLAIMS.filter((c) => active.has(c.source));
}

export function verdictFor(active: ReadonlySet<SourceId>): Verdict {
  const claims = activeClaims(active);
  const score = claims.reduce((sum, c) => sum + c.lean, 0);
  if (claims.length < MIN_CLAIMS) return { label: "Not enough context", score, claims: claims.length };
  if (score >= 2) return { label: "Lean renew", score, claims: claims.length };
  if (score <= -2) return { label: "Lean hold", score, claims: claims.length };
  return { label: "Mixed", score, claims: claims.length };
}
