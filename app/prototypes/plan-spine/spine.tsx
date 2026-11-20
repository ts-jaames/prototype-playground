import type { Projection } from "./types";

export const ROW_H = 76;
const WIDTH = 104;
const CENTER = 52;
const PX_PER_MIN = 3;
const MAX_OFFSET = 42;
const R = 7;

function pathThrough(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let k = 0; k < points.length - 1; k++) {
    const a = points[k];
    const b = points[k + 1];
    const mid = (a.y + b.y) / 2;
    d += ` C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${b.y}`;
  }
  return d;
}

/**
 * Plan is the straight dotted line. Each node sits at its start's drift from plan; the line
 * through completed steps is solid, the projection beyond the active step is dashed.
 */
export function Spine({ projection }: { projection: Projection }) {
  const points = projection.steps.map((s, i) => ({
    x: CENTER + Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, s.drift * PX_PER_MIN)),
    y: i * ROW_H + ROW_H / 2,
  }));
  const activeIndex = projection.steps.findIndex((s) => s.status === "active");
  const split = activeIndex === -1 ? points.length - 1 : activeIndex;
  const height = points.length * ROW_H;

  return (
    <svg aria-hidden width={WIDTH} height={height} viewBox={`0 0 ${WIDTH} ${height}`} className="absolute top-0 left-0">
      <line
        x1={CENTER}
        x2={CENTER}
        y1={points[0].y}
        y2={points[points.length - 1].y}
        className="stroke-border"
        strokeWidth={1.5}
        strokeDasharray="2 5"
      />
      <path d={pathThrough(points.slice(0, split + 1))} className="fill-none stroke-chart-2" strokeWidth={2.5} />
      <path
        d={pathThrough(points.slice(split))}
        className="fill-none stroke-muted-foreground"
        strokeWidth={2}
        strokeDasharray="5 5"
      />
      {projection.steps.map((s, i) => (
        <circle
          key={i}
          cx={points[i].x}
          cy={points[i].y}
          r={R}
          strokeWidth={s.status === "active" ? 3.5 : 2}
          className={
            s.status === "done"
              ? "fill-chart-2 stroke-chart-2"
              : s.status === "active"
                ? "fill-background stroke-chart-4"
                : "fill-background stroke-muted-foreground"
          }
        />
      ))}
    </svg>
  );
}
