"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { controls, TICK_MS } from "./data";
import { advance, createRun, initialRun, replan } from "./sim";
import type { RunState } from "./types";

export function usePlan(overrun: number, speed: number, paused: boolean) {
  const [state, setState] = useState<RunState>(() => initialRun(controls.overrun.default));
  const [replans, setReplans] = useState(0);
  const live = useRef({ overrun, speed });

  useEffect(() => {
    live.current = { overrun, speed };
  }, [overrun, speed]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setState((s) => advance(s, (live.current.speed * TICK_MS) / 1000, live.current.overrun));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const onReplan = useCallback(() => {
    setState((s) => replan(s));
    setReplans((n) => n + 1);
  }, []);

  const restart = useCallback(() => {
    setState(createRun());
    setReplans(0);
  }, []);

  return { state, replans, replan: onReplan, restart };
}
