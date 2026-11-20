// Pure permission logic: no React.
import { ALLOWED } from "./data";
import type { Grant, Grants, GrantScope, Risk, Scope } from "./types";

export function needsPermission(toolId: string, grants: Grants): boolean {
  const grant = grants[toolId];
  return !grant || grant.usesLeft === 0;
}

export function isOffered(risk: Risk, scope: Scope): boolean {
  return ALLOWED[risk].includes(scope);
}

export function makeGrant(scope: GrantScope): Grant {
  return { scope, usesLeft: scope === "once" ? 1 : null };
}

/** Record one use of a tool. A one-time grant is spent. */
export function consume(grants: Grants, toolId: string): Grants {
  const grant = grants[toolId];
  if (!grant || grant.usesLeft === null) return grants;
  return { ...grants, [toolId]: { ...grant, usesLeft: grant.usesLeft - 1 } };
}

/** What survives into the next run: only "always" grants. */
export function keepPersistent(grants: Grants): Grants {
  return Object.fromEntries(Object.entries(grants).filter(([, g]) => g.scope === "always"));
}
