// Particle physics for the field. No React.
import { WARMUP_STEPS } from "./data";
import type { Dot, Noise2D, Params } from "./types";

export type Bounds = { width: number; height: number };

export function spawnDot(bounds: Bounds, random: () => number, group: 0 | 1): Dot {
  return { x: random() * bounds.width, y: random() * bounds.height, vx: 0, vy: 0, group };
}

/** Grow or shrink the dot list without restarting the ones that stay. Groups alternate. */
export function resizeDots(dots: Dot[], count: number, bounds: Bounds, random: () => number): Dot[] {
  if (dots.length > count) return dots.slice(0, count);
  const next = dots.slice();
  while (next.length < count) next.push(spawnDot(bounds, random, (next.length % 2) as 0 | 1));
  return next;
}

/** Move `current` a step toward `target`, in place, so a state change blends over about a second. */
export function blendParams(current: Params, target: Params, amount: number): void {
  for (const key of Object.keys(target) as (keyof Params)[]) {
    current[key] += (target[key] - current[key]) * amount;
  }
}

type World = { noise: Noise2D; bounds: Bounds; time: number; intensity: number; random: () => number };

export function stepDot(d: Dot, p: Params, w: World): void {
  const { width, height } = w.bounds;
  const minSide = Math.min(width, height);
  const offset = (d.group === 0 ? -1 : 1) * p.split * minSide * 0.22;
  const cx = width / 2 + offset;
  const cy = height / 2;

  const angle = w.noise(d.x * 0.004, d.y * 0.004 + w.time * 0.004) * Math.PI * 2;
  let ax = Math.cos(angle) * p.flow * 0.12;
  let ay = Math.sin(angle) * p.flow * 0.12;

  const dx = d.x - cx;
  const dy = d.y - cy;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = dx / dist;
  const ny = dy / dist;

  const ring = p.ringR * minSide * (1 + 0.04 * Math.sin(w.time * 0.02));
  ax += nx * (ring - dist) * 0.004 * p.pull - ny * p.swirl * 0.06 * p.pull;
  ay += ny * (ring - dist) * 0.004 * p.pull + nx * p.swirl * 0.06 * p.pull;
  ax += nx * p.spread * 0.02;
  ay += ny * p.spread * 0.02;
  ax += (w.random() - 0.5) * p.jitter * 0.6;
  ay += (w.random() - 0.5) * p.jitter * 0.6;

  d.vx = (d.vx + ax * w.intensity) * p.damp;
  d.vy = (d.vy + ay * w.intensity) * p.damp;
  d.x += d.vx;
  d.y += d.vy;

  if (d.x < 0 || d.x > width) {
    d.x = Math.min(width, Math.max(0, d.x));
    d.vx *= -0.5;
  }
  if (d.y < 0 || d.y > height) {
    d.y = Math.min(height, Math.max(0, d.y));
    d.vy *= -0.5;
  }
}

/** Run the physics forward without drawing, so a fresh or paused field already looks settled. */
export function warmUp(dots: Dot[], p: Params, w: World): void {
  for (let i = 0; i < WARMUP_STEPS; i++) {
    for (const d of dots) stepDot(d, p, w);
    w.time += 1;
  }
}
