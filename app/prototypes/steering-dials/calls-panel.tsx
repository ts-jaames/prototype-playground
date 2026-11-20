type Props = { calls: string[] };

/** The dials are a UI for tool arguments, so show the arguments they produce. */
export function CallsPanel({ calls }: Props) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-muted p-3">
      <p className="text-xs text-muted-foreground">Running</p>
      <ul className="flex flex-col gap-1">
        {calls.map((c) => (
          <li key={c} className="font-mono text-xs break-words">
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
