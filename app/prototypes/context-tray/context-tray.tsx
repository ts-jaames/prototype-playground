"use client";

import { useState } from "react";

import { Answer } from "./answer";
import { verdictFor } from "./compose";
import { QUESTION, SOURCES } from "./data";
import { SourceChip } from "./source-chip";
import type { SourceId } from "./types";

export function ContextTray() {
  const [active, setActive] = useState<ReadonlySet<SourceId>>(() => new Set(SOURCES.map((s) => s.id)));

  function toggle(id: SourceId) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-medium">{QUESTION}</h1>
        <p className="text-sm text-muted-foreground">
          {active.size} of {SOURCES.length} sources in context. Turn one off to see what it contributed.
        </p>
      </header>

      <div className="sticky top-14 z-10 -mx-4 flex flex-wrap gap-2 bg-background/90 px-4 py-2 backdrop-blur">
        {SOURCES.map((s) => (
          <SourceChip key={s.id} source={s} on={active.has(s.id)} onToggle={() => toggle(s.id)} />
        ))}
      </div>

      <Answer active={active} verdict={verdictFor(active)} />
    </main>
  );
}
