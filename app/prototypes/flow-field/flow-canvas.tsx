"use client";

import { useEffect, useRef } from "react";

import { useCssColor } from "@/components/playground/hooks";

import { WARMUP_FRAMES } from "./data";
import { createNoise2D, createRandom } from "./noise";
import { fieldAngle, resizeParticles, stepParticle, type Bounds } from "./simulation";
import type { FlowSettings, Particle } from "./types";

type Props = { settings: FlowSettings; playing: boolean; seed: number };

export function FlowCanvas({ settings, playing, seed }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const background = useCssColor("card");
  const stroke = useCssColor(settings.color);

  // The animation loop reads the latest props from here instead of restarting.
  const live = useRef({ settings, background, stroke, playing, dirty: true });
  useEffect(() => {
    live.current = { settings, background, stroke, playing, dirty: true };
  }, [settings, background, stroke, playing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const random = createRandom(seed);
    const noise = createNoise2D(seed);
    let bounds: Bounds = { width: 0, height: 0 };
    let particles: Particle[] = [];
    let time = 0;
    let frame = 0;

    const draw = () => {
      const s = live.current.settings;
      if (particles.length !== s.count) particles = resizeParticles(particles, s.count, bounds, random);

      ctx.globalAlpha = Math.max(0.02, 1 - s.trail / 100);
      ctx.fillStyle = live.current.background;
      ctx.fillRect(0, 0, bounds.width, bounds.height);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = live.current.stroke;
      ctx.lineWidth = s.lineWidth;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (const p of particles) {
        const angle = fieldAngle(s.pattern, noise, p.x, p.y, time, s.turbulence, bounds);
        stepParticle(p, angle, s.speed, bounds, random);
        if (p.age === 0) continue;
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      time += 1;
    };

    const restart = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bounds = { width: rect.width, height: rect.height };
      particles = resizeParticles([], live.current.settings.count, bounds, random);
      ctx.globalAlpha = 1;
      ctx.fillStyle = live.current.background;
      ctx.fillRect(0, 0, bounds.width, bounds.height);
      for (let i = 0; i < WARMUP_FRAMES; i++) draw();
      live.current.dirty = false;
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
  }, [seed]);

  return (
    <div className="aspect-square w-full overflow-hidden rounded-xl border border-border bg-card">
      <canvas ref={canvasRef} role="img" aria-label="Flow field" className="block size-full" />
    </div>
  );
}
