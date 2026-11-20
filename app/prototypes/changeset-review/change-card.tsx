"use client";

import { CheckIcon, Undo2Icon, XIcon } from "lucide-react";
import { useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { Change, ChangeStatus, Decision } from "./types";

const THRESHOLD = 88;
const MAX_DRAG = 140;

type Props = {
  change: Change;
  status: ChangeStatus | undefined;
  /** Set while changes are being applied, so decisions can't change mid-run. */
  locked: boolean;
  onDecide: (decision: Decision) => void;
  onUndo: () => void;
};

export function ChangeCard({ change, status, locked, onDecide, onUndo }: Props) {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const canSwipe = !status && !locked;

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!canSwipe) return;
    startX.current = e.clientX;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (startX.current === null) return;
    setDx(Math.max(-MAX_DRAG, Math.min(MAX_DRAG, e.clientX - startX.current)));
  }
  function endDrag() {
    if (startX.current === null) return;
    startX.current = null;
    setDragging(false);
    if (dx >= THRESHOLD) onDecide("accepted");
    else if (dx <= -THRESHOLD) onDecide("rejected");
    setDx(0);
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card transition-[opacity,border-color] duration-300 ease-(--ease-smooth)",
        status === "rejected" ? "border-border opacity-60" : "border-border",
        (status === "accepted" || status === "applied") && "border-primary",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 flex items-center px-4 text-sm font-medium",
          dx > 0 && "justify-start bg-primary/10 text-foreground",
          dx < 0 && "justify-end bg-destructive/10 text-destructive",
        )}
      >
        {dx > 0 ? "Accept" : dx < 0 ? "Reject" : null}
      </div>

      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{ transform: `translateX(${dx}px)` }}
        className={cn(
          "relative flex touch-pan-y flex-col gap-2 bg-card p-4 select-none",
          canSwipe && "cursor-grab",
          !dragging && "transition-transform duration-200 ease-(--ease-smooth)",
        )}
      >
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{change.source}</Badge>
          <span className="truncate font-mono text-xs text-muted-foreground">{change.tool}</span>
        </div>
        <p className="text-sm font-medium">{change.title}</p>

        <div className="flex flex-col gap-1 rounded-lg bg-muted p-3 text-sm">
          {change.before ? (
            <p className="text-muted-foreground line-through">{change.before}</p>
          ) : (
            <Badge variant="outline" className="w-fit">
              New
            </Badge>
          )}
          <p>{change.after}</p>
        </div>
        <p className="text-xs text-muted-foreground">{change.reason}</p>
      </div>

      <div className="relative flex items-center justify-end gap-2 border-t border-border bg-card p-2">
        {status === "applied" ? (
          <Badge>Applied</Badge>
        ) : status ? (
          <>
            <Badge variant={status === "accepted" ? "default" : "outline"}>
              {status === "accepted" ? "Accepted" : "Rejected"}
            </Badge>
            <Button
              variant="ghost"
              disabled={locked}
              onClick={onUndo}
              aria-label={`Undo decision for ${change.title}`}
            >
              <Undo2Icon />
              <span className="hidden sm:inline">Undo</span>
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              disabled={locked}
              onClick={() => onDecide("rejected")}
              aria-label={`Reject ${change.title}`}
            >
              <XIcon />
              Reject
            </Button>
            <Button disabled={locked} onClick={() => onDecide("accepted")} aria-label={`Accept ${change.title}`}>
              <CheckIcon />
              Accept
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
