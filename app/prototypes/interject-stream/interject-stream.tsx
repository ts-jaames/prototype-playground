"use client";

import { useEffect, useState } from "react";

import { Collapse } from "@/components/playground/collapse";
import { usePrefersReducedMotion } from "@/components/playground/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Clause } from "./clause";
import { BASE, DIRECTIVES, QUESTION } from "./data";
import { RedirectBar } from "./redirect-bar";
import { buildSequence, clauseStarts, delayAfter, INITIAL_REVEALED, words } from "./stream";
import type { Cut, Directive } from "./types";

export function InterjectStream() {
  const reducedMotion = usePrefersReducedMotion();
  const [cut, setCut] = useState<Cut | null>(null);
  const [revealed, setRevealed] = useState(INITIAL_REVEALED);
  const [picked, setPicked] = useState<number | null>(null);
  const [showTail, setShowTail] = useState(false);

  const { clauses, prefixLen } = buildSequence(cut);
  const flat = clauses.flatMap(words);
  const starts = clauseStarts(clauses);
  const shown = reducedMotion ? flat.length : revealed;
  const done = shown >= flat.length;
  const streaming = picked === null && !done;

  useEffect(() => {
    if (!streaming) return;
    const timer = window.setTimeout(() => setRevealed((n) => n + 1), delayAfter(flat[shown - 1]));
    return () => window.clearTimeout(timer);
  }, [streaming, shown, flat]);

  function redirect(directive: Directive) {
    if (picked === null) return;
    const nextCut = { clause: picked, directive };
    // Everything up to and including the tapped clause stays visible; the new text streams after it.
    setRevealed(BASE.slice(0, picked + 1).flatMap(words).length);
    setCut(nextCut);
    setPicked(null);
    setShowTail(false);
  }

  function restart() {
    setCut(null);
    setRevealed(0);
    setPicked(null);
    setShowTail(false);
  }

  const renderClause = (i: number) => (
    <Clause
      key={`${cut?.clause ?? "base"}-${cut?.directive ?? "base"}-${i}`}
      text={clauses[i]}
      visible={shown - starts[i]}
      selected={picked === i}
      onPick={i < prefixLen ? () => setPicked(picked === i ? null : i) : undefined}
    />
  );
  const prefix = clauses.slice(0, prefixLen).map((_, i) => renderClause(i));
  const branch = clauses.slice(prefixLen).map((_, i) => renderClause(prefixLen + i));
  const directiveLabel = DIRECTIVES.find((d) => d.id === cut?.directive)?.label;
  const discarded = cut ? BASE.slice(cut.clause + 1) : [];

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-medium">{QUESTION}</h1>
        <p className="text-sm text-muted-foreground">Tap any sentence to pause and redirect from there.</p>
      </header>

      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary">{picked !== null ? "Paused" : done ? "Done" : "Streaming"}</Badge>
        <Button variant="outline" onClick={restart}>
          Restart
        </Button>
      </div>

      <article className="flex flex-col gap-3 text-base">
        <p>{prefix}</p>
        {cut && (
          <>
            <p className="text-xs text-muted-foreground">Redirected: {directiveLabel}</p>
            <p>{branch}</p>
          </>
        )}
      </article>

      {discarded.length > 0 && (
        <section className="flex flex-col gap-1">
          <Button variant="ghost" className="self-start" onClick={() => setShowTail((s) => !s)} aria-expanded={showTail}>
            {showTail ? "Hide" : "Show"} discarded continuation
          </Button>
          <Collapse open={showTail}>
            <p inert={!showTail} className="text-sm leading-relaxed text-muted-foreground">
              {discarded.join(" ")}
            </p>
          </Collapse>
        </section>
      )}

      {picked !== null && <RedirectBar onChoose={redirect} onCancel={() => setPicked(null)} />}
    </main>
  );
}
