/** Tiny bar sparkline in plain SVG; colour comes from `currentColor`. */
export function Sparkline({ values, className }: { values: number[]; className?: string }) {
  const max = Math.max(1, ...values);
  const w = 4;
  const gap = 1.5;
  const h = 16;
  return (
    <svg
      aria-hidden
      className={className}
      width={values.length * (w + gap) - gap}
      height={h}
      viewBox={`0 0 ${values.length * (w + gap) - gap} ${h}`}
    >
      {values.map((v, i) => {
        const bar = v === 0 ? 1 : Math.max(2, (v / max) * h);
        return (
          <rect
            key={i}
            x={i * (w + gap)}
            y={h - bar}
            width={w}
            height={bar}
            rx={1}
            fill="currentColor"
            opacity={v === 0 ? 0.25 : 1}
          />
        );
      })}
    </svg>
  );
}
