"use client";

import { useEffect, useRef } from "react";

import { useCssColor } from "@/components/playground/hooks";

import { BLEND, STATE_PARAMS } from "./data";
import { blendParams, resizeDots, stepDot, warmUp, type Bounds } from "./field";
import { createNoise2D, createRandom } from "./noise";
import type { AgentState, Dot, FieldSettings, Params } from "./types";

type Props = { state: AgentState; settings: FieldSettings; playing: boolean };

export function FieldCanvas({ state, settings, playing }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const background = useCssColor("card");
  const colorA = useCssColor("foreground");
  const colorB = useCssColor("chart-2");

  // The loop reads the latest props from here so it never has to restart.
  const live = useRef({ state, settings, background, colorA, colorB, playing, dirty: true });
  useEffect(() => {
    live.current = { state, settings, background, colorA, colorB, playing, dirty: true };
  }, [state, settings, background, colorA, colorB, playing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const random = createRandom(7);
    const noise = createNoise2D(7);
    let bounds: Bounds = { width: 0, height: 0 };
    let dots: Dot[] = [];
    let time = 0;
    let frame = 0;
    const current: Params = { ...STATE_PARAMS[live.current.state] };

    const world = () => ({ noise, bounds, time, intensity: live.current.settings.intensity, random });

    const draw = () => {
      const l = live.current;
      if (dots.length !== l.settings.count) dots = resizeDots(dots, l.settings.count, bounds, random);
      blendParams(current, STATE_PARAMS[l.state], BLEND);

      const w = world();
      for (const d of dots) stepDot(d, current, w);
      time += 1;

      ctx.globalAlpha = Math.max(0.03, 1 - l.settings.trail / 100);
      ctx.fillStyle = l.background;
      ctx.fillRect(0, 0, bounds.width, bounds.height);
      ctx.globalAlpha = current.alpha;
      for (const group of [0, 1] as const) {
        ctx.fillStyle = group === 0 ? l.colorA : l.colorB;
        ctx.beginPath();
        for (const d of dots) {
          if (d.group !== group) continue;
          ctx.moveTo(d.x + 1.8, d.y);
          ctx.arc(d.x, d.y, 1.8, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const restart = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bounds = { width: rect.width, height: rect.height };
      dots = resizeDots([], live.current.settings.count, bounds, random);
      Object.assign(current, STATE_PARAMS[live.current.state]);
      const w = world();
      warmUp(dots, current, w);
      time = w.time;
      ctx.globalAlpha = 1;
      ctx.fillStyle = live.current.background;
      ctx.fillRect(0, 0, bounds.width, bounds.height);
      for (let i = 0; i < 24; i++) draw();
    };

    const loop = () => {
      if (live.current.playing) draw();
      else if (live.current.dirty) restart();
      live.current.dirty = false;
      frame = requestAnimationFrame(loop);
    };

    const observer = new ResizeObserver(restart);
    observer.observe(canvas);
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-card">
      <canvas ref={canvasRef} role="img" aria-label="Agent state field" className="block size-full" />
    </div>
  );
}
