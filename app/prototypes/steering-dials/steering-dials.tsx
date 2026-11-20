"use client";

import { useState } from "react";

import { ControlPanel, ControlsLayout, useControls } from "@/components/playground/controls";

import { CallsPanel } from "./calls-panel";
import { controls as schema, NAMESPACE, QUESTION, SOURCES } from "./data";
import { diffIds, runQuery } from "./query";
import { ResultCard } from "./result-card";

export function SteeringDials() {
  const controls = useControls(NAMESPACE, schema);
  const settings = controls.values;
  const { items, calls } = runQuery(settings);

  // Track the previous result set during render so changed items can be flagged.
  const key = items.map((i) => i.id).join(",");
  const [seen, setSeen] = useState({ key, ids: new Set(items.map((i) => i.id)), prev: new Set(items.map((i) => i.id)) });
  if (seen.key !== key) setSeen({ key, ids: new Set(items.map((i) => i.id)), prev: seen.ids });
  const { added, removed } = diffIds(seen.prev, seen.ids);

  const groups = settings.group
    ? SOURCES.slice(0, settings.scope)
        .map((source) => ({ source, items: items.filter((i) => i.source === source) }))
        .filter((g) => g.items.length > 0)
    : [{ source: null, items }];

  return (
    <ControlsLayout panel={<ControlPanel controls={controls} />}>
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">You asked</p>
        <h1 className="text-lg font-medium">{QUESTION}</h1>
      </header>

      <CallsPanel calls={calls} />

      <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
        {items.length} {items.length === 1 ? "result" : "results"}
        {(added.length > 0 || removed.length > 0) && ` (+${added.length} −${removed.length})`}
      </p>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nothing matches. Widen the scope or recency, or lower the relevance floor.
        </p>
      ) : (
        groups.map((g) => (
          <section key={g.source ?? "all"} className="flex flex-col gap-3">
            {g.source && <h2 className="text-xs font-medium text-muted-foreground">{g.source}</h2>}
            {g.items.map((item) => (
              <ResultCard
                key={item.id}
                item={item}
                depth={settings.depth}
                isNew={added.includes(item.id)}
                showSource={!settings.group}
              />
            ))}
          </section>
        ))
      )}
    </ControlsLayout>
  );
}
