"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { TICK_MS, WORK_PER_TICK } from "./data";
import { createRun, decide, initialRun, tick } from "./run";
import type { Decision, RunState } from "./types";
import { createRng } from "./utils";

export function useRun(quality: number, speed: number, paused: boolean) {
  const [state, setState] = useState<RunState>(() => initialRun(createRng(0.64)));
  const live = useRef({ quality, speed });

  useEffect(() => {
    live.current = { quality, speed };
  }, [quality, speed]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      const rng = createRng(Math.random());
      setState((s) => tick(s, WORK_PER_TICK * live.current.speed, live.current.quality, rng));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const onDecide = useCallback((index: number, decision: Decision) => {
    setState((s) => decide(s, index, decision));
  }, []);

  const restart = useCallback(() => setState(createRun()), []);

  return { state, decide: onDecide, restart };
}
