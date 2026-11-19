import { LIFE_RANGE, NOISE_SCALE } from "./data";
import type { Noise2D, Particle, Pattern } from "./types";

export type Bounds = { width: number; height: number };

export function spawnParticle(bounds: Bounds, random: () => number): Particle {
  const x = random() * bounds.width;
  const y = random() * bounds.height;
  const life = LIFE_RANGE[0] + random() * (LIFE_RANGE[1] - LIFE_RANGE[0]);
  return { x, y, px: x, py: y, age: Math.floor(random() * life), life };
}

/** Grow or shrink the particle list to `count` without restarting existing particles. */
export function resizeParticles(
  particles: Particle[],
  count: number,
  bounds: Bounds,
  random: () => number,
): Particle[] {
  if (particles.length > count) return particles.slice(0, count);
  const next = particles.slice();
  while (next.length < count) next.push(spawnParticle(bounds, random));
  return next;
}

/** Direction of the field (radians) at a point. */
export function fieldAngle(
  pattern: Pattern,
  noise: Noise2D,
  x: number,
  y: number,
  time: number,
  turbulence: number,
  bounds: Bounds,
): number {
  const s = NOISE_SCALE * turbulence;
  const drift = time * 0.002;
  switch (pattern) {
    case "noise":
      return noise(x * s, y * s + drift) * Math.PI * 2;
    case "swirl": {
      const angle = Math.atan2(y - bounds.height / 2, x - bounds.width / 2);
      return angle + Math.PI / 2 + noise(x * s, y * s + drift) * 1.2;
    }
    case "waves":
      return Math.sin(x * s * 3 + drift * 4) + Math.cos(y * s * 3) + noise(x * s, y * s) * 0.6;
  }
}

/** Advance one particle in place. Respawns it when it leaves the canvas or gets old. */
export function stepParticle(
  p: Particle,
  angle: number,
  speed: number,
  bounds: Bounds,
  random: () => number,
): void {
  p.px = p.x;
  p.py = p.y;
  p.x += Math.cos(angle) * speed;
  p.y += Math.sin(angle) * speed;
  p.age += 1;

  const outside = p.x < 0 || p.x > bounds.width || p.y < 0 || p.y > bounds.height;
  if (outside || p.age > p.life) Object.assign(p, spawnParticle(bounds, random), { age: 0 });
}
