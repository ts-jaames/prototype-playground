"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { TICK_MS } from "./data";
import { decideCall, seedLedger, stepLedger } from "./simulation";
import type { LedgerState, PolicyMap } from "./types";
import { createRng } from "./utils";

export function useLedger(policy: PolicyMap, opts: { callRate: number; errorRate: number }, paused: boolean) {
  const [state, setState] = useState<LedgerState>(seedLedger);
  const live = useRef({ policy, opts });

  useEffect(() => {
    live.current = { policy, opts };
  }, [policy, opts]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      const rng = createRng(Math.random());
      setState((s) => stepLedger(s, live.current.policy, live.current.opts, rng));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const decide = useCallback((callId: number, approve: boolean) => {
    const rng = createRng(Math.random());
    setState((s) => decideCall(s, callId, approve, live.current.opts.errorRate, rng));
  }, []);

  return { state, decide };
}
