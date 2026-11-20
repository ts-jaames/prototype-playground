"use client";

import { useState } from "react";

import { Collapse } from "@/components/playground/collapse";
import { Button } from "@/components/ui/button";

import { REDIRECT_OPTIONS } from "./data";
import type { Decision } from "./types";

/** Go, Redirect or Stop. Going past a missed criterion takes a second, explicit tap. */
export function DecisionBar({ unmet, onDecide }: { unmet: number; onDecide: (d: Decision) => void }) {
  const [confirming, setConfirming] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  return (
    <div className="pt-3">
      <div className="flex flex-wrap gap-2">
        {confirming ? (
          <>
            <Button variant="destructive" onClick={() => onDecide({ type: "go" })}>
              Go anyway ({unmet} missed)
            </Button>
            <Button variant="ghost" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={unmet > 0 ? "outline" : "default"}
              onClick={() => (unmet > 0 ? (setConfirming(true), setRedirecting(false)) : onDecide({ type: "go" }))}
            >
              Go
            </Button>
            <Button
              variant={unmet > 0 ? "default" : "outline"}
              aria-expanded={redirecting}
              onClick={() => setRedirecting((v) => !v)}
            >
              Redirect
            </Button>
            <Button variant="ghost" className="text-destructive" onClick={() => onDecide({ type: "stop" })}>
              Stop
            </Button>
          </>
        )}
      </div>
      <Collapse open={redirecting && !confirming}>
        <div className="flex flex-wrap gap-2 pt-2">
          {REDIRECT_OPTIONS.map((note) => (
            <Button key={note} size="sm" variant="secondary" onClick={() => onDecide({ type: "redirect", note })}>
              {note}
            </Button>
          ))}
        </div>
      </Collapse>
    </div>
  );
}
