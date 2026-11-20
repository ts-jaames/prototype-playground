"use client";

import { useState } from "react";

import { Collapse } from "@/components/playground/collapse";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { Agent, Resolution } from "./types";

export function AskCard({
  agent,
  tick,
  leaving,
  onResolve,
  onExited,
}: {
  agent: Agent;
  tick: number;
  leaving: boolean;
  onResolve: (resolution: Resolution) => void;
  onExited: () => void;
}) {
  const ask = agent.ask!;
  const [redirecting, setRedirecting] = useState(false);
  const age = Math.max(0, tick - ask.raisedAt);
  const isApprove = ask.kind === "approve";

  return (
    <Collapse open={!leaving} onExited={onExited}>
      <div className="pb-2">
        <div className="rounded-lg border border-border bg-card p-3 text-card-foreground">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              aria-hidden
              className={cn(
                "size-2 rounded-full",
                ask.urgency === 3 || age > 8 ? "bg-destructive" : "bg-chart-4",
              )}
            />
            <span className="font-medium text-foreground">{agent.name}</span>
            <span className="ml-auto tabular-nums">waiting {age}m</span>
          </div>
          <p className="mt-2 text-sm font-medium">{ask.text}</p>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">{ask.detail}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {isApprove ? (
              <>
                <Button size="sm" disabled={leaving} onClick={() => onResolve({ type: "approve" })}>
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={leaving}
                  aria-expanded={redirecting}
                  onClick={() => setRedirecting((v) => !v)}
                >
                  Redirect
                </Button>
              </>
            ) : (
              ask.options.map((option) => (
                <Button
                  key={option}
                  size="sm"
                  variant="outline"
                  disabled={leaving}
                  onClick={() => onResolve({ type: "redirect", note: option })}
                >
                  {option}
                </Button>
              ))
            )}
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive"
              disabled={leaving}
              onClick={() => onResolve({ type: "stop" })}
            >
              Stop
            </Button>
          </div>

          {isApprove && (
            <Collapse open={redirecting}>
              <div className="flex flex-wrap gap-2 pt-2">
                {ask.options.map((option) => (
                  <Button
                    key={option}
                    size="sm"
                    variant="secondary"
                    disabled={leaving}
                    onClick={() => onResolve({ type: "redirect", note: option })}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </Collapse>
          )}
        </div>
      </div>
    </Collapse>
  );
}
