// DOM animation for the morph (FLIP: measure before, measure after, play the difference).
import type { Box, MorphSettings } from "./types";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const MAX_DELAY = 900;

export function measure(els: Map<number, HTMLElement>, container: HTMLElement): Map<number, Box> {
  const origin = container.getBoundingClientRect();
  const boxes = new Map<number, Box>();
  for (const [id, el] of els) {
    const r = el.getBoundingClientRect();
    boxes.set(id, { x: r.left - origin.left, y: r.top - origin.top });
  }
  return boxes;
}

type Play = {
  order: number[];
  before: Map<number, Box>;
  after: Map<number, Box>;
  added: Set<number>;
  els: Map<number, HTMLElement>;
  ghostEls: Map<number, HTMLElement>;
  settings: Pick<MorphSettings, "duration" | "stagger" | "highlight">;
};

export function playMorph({ order, before, after, added, els, ghostEls, settings }: Play): void {
  const { duration, stagger, highlight } = settings;
  const delayFor = (i: number) => Math.min(i * stagger, MAX_DELAY);

  for (const el of ghostEls.values()) {
    el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: duration * 0.6, easing: "ease-out", fill: "forwards" });
  }

  order.forEach((id, i) => {
    const el = els.get(id);
    if (!el) return;
    const delay = delayFor(i);

    if (added.has(id)) {
      el.animate(
        [
          { opacity: 0, transform: "translateY(6px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration, delay, easing: EASE, fill: "backwards" },
      );
      if (highlight) {
        el.animate(
          [{ backgroundColor: "color-mix(in oklab, var(--primary) 30%, transparent)" }, { backgroundColor: "transparent" }],
          { duration: 1800, delay, easing: "ease-out", fill: "backwards" },
        );
      }
      return;
    }

    const from = before.get(id);
    const to = after.get(id);
    if (!from || !to) return;
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
    el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], {
      duration,
      delay,
      easing: EASE,
      fill: "backwards",
    });
  });
}
