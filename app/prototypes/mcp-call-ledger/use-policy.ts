"use client";

import { useCallback, useEffect, useState } from "react";

import { defaultPolicy, POLICY_KEY, sanitizePolicy } from "./data";
import type { Policy, PolicyMap } from "./types";

/** Per-tool policy, persisted to localStorage once the saved value has been read. */
export function usePolicy() {
  const [policy, setPolicy] = useState<PolicyMap>(defaultPolicy);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let saved: unknown = null;
    try {
      const raw = window.localStorage.getItem(POLICY_KEY);
      saved = raw ? JSON.parse(raw) : null;
    } catch {
      saved = null;
    }
    /* eslint-disable react-hooks/set-state-in-effect -- localStorage only exists after mount */
    if (saved) setPolicy(sanitizePolicy(saved));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(POLICY_KEY, JSON.stringify(policy));
    } catch {
      // Storage unavailable (private mode, quota): policy just won't persist.
    }
  }, [policy, hydrated]);

  const setToolPolicy = useCallback((toolId: string, value: Policy) => {
    setPolicy((p) => ({ ...p, [toolId]: value }));
  }, []);

  return { policy, setToolPolicy };
}
