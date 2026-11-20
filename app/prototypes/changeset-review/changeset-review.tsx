"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ApplyBar } from "./apply-bar";
import { ChangeCard } from "./change-card";
import { CHANGES, REQUEST, SOURCES_READ } from "./data";
import type { ChangeStatus, Decision } from "./types";

const APPLY_STEP_MS = 450;

export function ChangesetReview() {
  const [statuses, setStatuses] = useState<Record<string, ChangeStatus>>({});
  const [applying, setApplying] = useState(false);
  const [done, setDone] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const values = Object.values(statuses);
  const accepted = values.filter((s) => s === "accepted" || s === "applied").length;
  const rejected = values.filter((s) => s === "rejected").length;
  const pending = CHANGES.length - accepted - rejected;

  function decide(id: string, decision: Decision) {
    setStatuses((s) => ({ ...s, [id]: decision }));
  }
  function undo(id: string) {
    setStatuses((s) => {
      const next = { ...s };
      delete next[id];
      return next;
    });
  }

  function apply() {
    const ids = CHANGES.filter((c) => statuses[c.id] === "accepted").map((c) => c.id);
    setApplying(true);
    ids.forEach((id, i) => {
      timers.current.push(
        window.setTimeout(() => setStatuses((s) => ({ ...s, [id]: "applied" })), (i + 1) * APPLY_STEP_MS),
      );
    });
    timers.current.push(
      window.setTimeout(
        () => {
          setApplying(false);
          setDone(true);
          toast.success(`Applied ${ids.length} ${ids.length === 1 ? "change" : "changes"}`);
        },
        (ids.length + 1) * APPLY_STEP_MS,
      ),
    );
  }

  function reset() {
    setStatuses({});
    setDone(false);
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">You asked</p>
        <h1 className="text-lg font-medium">{REQUEST}</h1>
        <p className="text-sm text-muted-foreground">
          Read {SOURCES_READ.join(", ")}. {CHANGES.length} proposed changes. Swipe right to accept, left to reject.
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {CHANGES.map((change) => (
          <li key={change.id}>
            <ChangeCard
              change={change}
              status={statuses[change.id]}
              locked={applying || done}
              onDecide={(d) => decide(change.id, d)}
              onUndo={() => undo(change.id)}
            />
          </li>
        ))}
      </ul>

      <ApplyBar
        accepted={accepted}
        rejected={rejected}
        pending={pending}
        applying={applying}
        done={done}
        onApply={apply}
        onReset={reset}
      />
    </main>
  );
}
