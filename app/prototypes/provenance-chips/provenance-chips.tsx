"use client";

import { ControlsLayout } from "@/components/playground/controls";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { ACCOUNT, FIELDS } from "./data";
import { FieldRow } from "./field-row";
import { conflictCount, selectedReading, summarize } from "./format";
import type { FieldId, FieldStates, SourceId } from "./types";

const REQUERY_MS = 900;

function initialStates(): FieldStates {
  return Object.fromEntries(
    FIELDS.map((f) => [f.id, { readings: f.readings, selected: f.readings[0].source }]),
  ) as FieldStates;
}

export function ProvenanceChips() {
  const [states, setStates] = useState<FieldStates>(initialStates);
  const [refreshing, setRefreshing] = useState<FieldId | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function select(id: FieldId, source: SourceId) {
    setStates((s) => ({ ...s, [id]: { ...s[id], selected: source } }));
  }

  function requery(id: FieldId) {
    setRefreshing(id);
    timer.current = window.setTimeout(() => {
      setStates((s) => {
        const state = s[id];
        const readings = state.readings.map((r) =>
          r.source === state.selected
            ? { ...r, value: r.requeryValue ?? r.value, requeryValue: undefined, minutesAgo: 0 }
            : r,
        );
        return { ...s, [id]: { ...state, readings } };
      });
      setRefreshing(null);
    }, REQUERY_MS);
  }

  const conflicts = conflictCount(states);

  return (
    <ControlsLayout>
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-medium">{ACCOUNT} renewal brief</h1>
        <p className="text-sm text-muted-foreground">
          {conflicts > 0
            ? `${conflicts} of ${FIELDS.length} values differ between sources. Tap a chip to compare.`
            : "All sources agree."}
        </p>
      </header>

      <div className="flex flex-col rounded-xl border border-border bg-card px-4 py-1">
        {FIELDS.map((def, i) => (
          <div key={def.id}>
            {i > 0 && <Separator />}
            <FieldRow
              def={def}
              state={states[def.id]}
              refreshing={refreshing === def.id}
              onSelect={(source) => select(def.id, source)}
              onRequery={() => requery(def.id)}
            />
          </div>
        ))}
      </div>

      <section className="flex flex-col gap-2 rounded-xl bg-muted p-4">
        <p className="text-xs text-muted-foreground">Agent summary, from the selected values</p>
        <p className="text-sm leading-relaxed">
          {summarize(ACCOUNT, states).map((part, i) =>
            part.value ? (
              <span key={i} className="font-medium">
                {part.text}
              </span>
            ) : (
              <span key={i}>{part.text}</span>
            ),
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          Oldest value used: {Math.max(...FIELDS.map((f) => selectedReading(states[f.id]).minutesAgo))} min old
        </p>
      </section>

      <Button variant="outline" className="self-start" onClick={() => setStates(initialStates())}>
        Reset
      </Button>
    </ControlsLayout>
  );
}
