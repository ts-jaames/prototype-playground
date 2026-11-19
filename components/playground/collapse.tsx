"use client";

import { cn } from "@/lib/utils";

/**
 * Animates height open/closed (grid-rows 0fr <-> 1fr), including on first mount via
 * @starting-style, so added and removed rows never make the page jump.
 *
 * Removing a row: set `open={false}`, then drop it from state in `onExited`.
 */
export function Collapse({
  open = true,
  onExited,
  className,
  children,
}: {
  open?: boolean;
  onExited?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      data-open={open}
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && e.propertyName === "grid-template-rows" && !open) {
          onExited?.();
        }
      }}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-(--ease-smooth) starting:grid-rows-[0fr] starting:opacity-0",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
    >
      <div className={cn("min-h-0 overflow-hidden", className)}>{children}</div>
    </div>
  );
}
