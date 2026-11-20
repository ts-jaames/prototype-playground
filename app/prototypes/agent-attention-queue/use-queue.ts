"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { initialState, TICK_MS } from "./data";
import { resolveAsk, stepQueue } from "./simulation";
import type { QueueSettings, QueueState, Resolution } from "./types";
import { createRng } from "./utils";

export function useQueue(settings: QueueSettings, paused: boolean) {
  const [state, setState] = useState<QueueState>(initialState);
  const live = useRef(settings);

  useEffect(() => {
    live.current = settings;
  }, [settings]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      const rng = createRng(Math.random());
      setState((s) => stepQueue(s, live.current, rng));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const resolve = useCallback((agentId: string, resolution: Resolution) => {
    setState((s) => resolveAsk(s, agentId, resolution));
  }, []);

  return { state, resolve };
}
