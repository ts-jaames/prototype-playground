"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { ControlPanel, ControlsLayout, useControls } from "@/components/playground/controls";
import { usePrefersReducedMotion } from "@/components/playground/hooks";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { controls as schema, NAMESPACE, REVISIONS } from "./data";
import { diffTokens, initialTokens } from "./diff";
import { measure, playMorph } from "./motion";
import { MorphText } from "./morph-text";
import type { Box, Ghost, Token } from "./types";

type Pending = { before: Map<number, Box>; added: Set<number> };

export function DiffMorph() {
  const controls = useControls(NAMESPACE, schema);
  const reducedMotion = usePrefersReducedMotion();

  const [tokens, setTokens] = useState<Token[]>(() => initialTokens(REVISIONS[0].text));
  const nextId = useRef(tokens.length + 1);
  const newId = () => nextId.current++;
  const [revision, setRevision] = useState(REVISIONS[0].id);
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const [stats, setStats] = useState<{ kept: number; added: number; removed: number } | null>(null);

  const containerRef = useRef<HTMLParagraphElement>(null);
  const els = useRef(new Map<number, HTMLElement>());
  const ghostEls = useRef(new Map<number, HTMLElement>());
  const pending = useRef<Pending | null>(null);
  const clearTimer = useRef<number | undefined>(undefined);

  const registerWord = (id: number, el: HTMLElement | null) => {
    if (el) els.current.set(id, el);
    else els.current.delete(id);
  };
  const registerGhost = (id: number, el: HTMLElement | null) => {
    if (el) ghostEls.current.set(id, el);
    else ghostEls.current.delete(id);
  };

  function goTo(id: string) {
    const target = REVISIONS.find((r) => r.id === id);
    const container = containerRef.current;
    if (!target || !container || id === revision) return;

    const before = measure(els.current, container);
    const diff = diffTokens(tokens, target.text, newId);
    const { duration } = controls.values;

    pending.current = reducedMotion ? null : { before, added: diff.added };
    setGhosts(
      reducedMotion
        ? []
        : diff.removed.flatMap((t) => {
            const box = before.get(t.id);
            return box ? [{ ...t, ...box }] : [];
          }),
    );
    setTokens(diff.tokens);
    setRevision(id);
    setStats({ kept: diff.tokens.length - diff.added.size, added: diff.added.size, removed: diff.removed.length });

    window.clearTimeout(clearTimer.current);
    clearTimer.current = window.setTimeout(() => setGhosts([]), duration + 200);
  }

  useLayoutEffect(() => {
    const play = pending.current;
    const container = containerRef.current;
    if (!play || !container) return;
    pending.current = null;
    playMorph({
      order: tokens.map((t) => t.id),
      before: play.before,
      after: measure(els.current, container),
      added: play.added,
      els: els.current,
      ghostEls: ghostEls.current,
      settings: controls.values,
    });
  }, [tokens, controls.values]);

  return (
    <ControlsLayout panel={<ControlPanel controls={controls} />}>
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-medium">Quarterly summary</h1>
        <p className="text-sm text-muted-foreground">Pick a revision. Watch what moves, leaves and arrives.</p>
      </header>

      <ToggleGroup
        type="single"
        value={revision}
        onValueChange={(v) => v && goTo(v)}
        className="flex-wrap"
        aria-label="Revision"
      >
        {REVISIONS.map((r) => (
          <ToggleGroupItem key={r.id} value={r.id} variant="outline" className="min-h-11">
            {r.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <article className="rounded-xl border border-border bg-card p-4">
        <MorphText
          tokens={tokens}
          ghosts={ghosts}
          containerRef={containerRef}
          registerWord={registerWord}
          registerGhost={registerGhost}
        />
      </article>

      <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
        {stats ? `${stats.kept} words kept, ${stats.added} added, ${stats.removed} removed` : "Draft shown."}
      </p>
    </ControlsLayout>
  );
}
