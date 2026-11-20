"use client";

import { ControlsLayout } from "@/components/playground/controls";
import { useEffect, useState } from "react";

import { Collapse } from "@/components/playground/collapse";
import { Button } from "@/components/ui/button";

import { AuditList } from "./audit-list";
import { STEPS, TASK, TOOLS } from "./data";
import { PermissionRequest } from "./permission-request";
import { consume, keepPersistent, makeGrant, needsPermission } from "./rules";
import { StepList } from "./step-list";
import type { Grants, LogEntry, LogKind, Scope, StepResult } from "./types";

const WORK_MS = 800;

export function PermissionLadder() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [grants, setGrants] = useState<Grants>({});
  const [log, setLog] = useState<LogEntry[]>([]);
  const [results, setResults] = useState<Record<number, StepResult>>({});

  const step = STEPS[index];
  const finished = started && index >= STEPS.length;
  const running = started && !finished;
  const waiting = running && needsPermission(step.toolId, grants);
  const tool = TOOLS.find((t) => t.id === step?.toolId);

  function record(kind: LogKind, toolId: string, scope?: Scope) {
    setLog((l) => [...l, { id: l.length + 1, kind, toolId, scope }]);
  }

  useEffect(() => {
    if (!running || waiting) return;
    const timer = window.setTimeout(() => {
      record("used", step.toolId);
      setGrants((g) => consume(g, step.toolId));
      setResults((r) => ({ ...r, [index]: "done" }));
      setIndex((i) => i + 1);
    }, WORK_MS);
    return () => window.clearTimeout(timer);
  }, [running, waiting, step, index]);

  function choose(scope: Scope) {
    if (scope === "deny") {
      record("denied", step.toolId);
      setResults((r) => ({ ...r, [index]: "skipped" }));
      setIndex((i) => i + 1);
      return;
    }
    record("allowed", step.toolId, scope);
    setGrants((g) => ({ ...g, [step.toolId]: makeGrant(scope) }));
  }

  function revoke(toolId: string) {
    setGrants((g) => Object.fromEntries(Object.entries(g).filter(([id]) => id !== toolId)));
    record("revoked", toolId);
  }

  function start() {
    setGrants((g) => keepPersistent(g));
    setResults({});
    setIndex(0);
    setStarted(true);
  }

  return (
    <ControlsLayout>
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-medium">{TASK}</h1>
        <p className="text-sm text-muted-foreground">
          The agent asks for each tool the first time it needs it. You choose how much trust to give.
        </p>
      </header>

      <StepList index={index} started={started} waiting={waiting} results={results} />

      <Collapse open={waiting && !!tool}>
        {tool && step && <PermissionRequest key={`${index}-${tool.id}`} tool={tool} stepText={step.text} onChoose={choose} />}
      </Collapse>

      {(!started || finished) && (
        <Button className="self-start" onClick={start}>
          {finished ? "Run again" : "Run agent"}
        </Button>
      )}

      <AuditList grants={grants} log={log} onRevoke={revoke} />
    </ControlsLayout>
  );
}
