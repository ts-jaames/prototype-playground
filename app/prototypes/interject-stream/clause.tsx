import { cn } from "@/lib/utils";

import { words } from "./stream";

type Props = {
  text: string;
  /** How many of this clause's words are visible. */
  visible: number;
  selected: boolean;
  /** Only original clauses can be redirected from. */
  onPick?: () => void;
};

export function Clause({ text, visible, selected, onPick }: Props) {
  if (visible <= 0) return null;
  const shown = words(text).slice(0, visible);
  const content = shown.map((w, i) => (
    <span key={i} className="animate-in duration-500 fade-in">
      {w}{" "}
    </span>
  ));

  if (!onPick) return <span>{content}</span>;
  return (
    <button
      type="button"
      onClick={onPick}
      aria-label={`Redirect after: ${text}`}
      className={cn(
        "inline cursor-pointer rounded-sm py-1 text-left leading-relaxed outline-none transition-colors duration-200 box-decoration-clone focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-muted",
        selected && "bg-primary/15",
      )}
    >
      {content}
    </button>
  );
}
