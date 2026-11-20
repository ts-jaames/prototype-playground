import { Badge } from "@/components/ui/badge";

import type { Depth, Item } from "./types";

type Props = { item: Item; depth: Depth; isNew: boolean; showSource: boolean };

export function ResultCard({ item, depth, isNew, showSource }: Props) {
  return (
    <article className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        {showSource && <Badge variant="secondary">{item.source}</Badge>}
        <span className="text-xs text-muted-foreground tabular-nums">
          {item.ageDays}d ago · relevance {item.relevance}
        </span>
        {isNew && <Badge>new</Badge>}
      </div>
      <h3 className="text-sm font-medium">{item.headline}</h3>
      {depth !== "headline" && <p className="text-sm text-muted-foreground">{item.summary}</p>}
      {depth === "detail" && <p className="text-sm">{item.detail}</p>}
    </article>
  );
}
