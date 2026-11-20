"use client";

import { SlidersHorizontalIcon } from "lucide-react";

import { usePrototypeInfo } from "@/components/playground/prototype-info";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Subject in a centered column; a sidebar on desktop shows the prototype's description
 * (from metadata.json) and the optional control panel, never over the subject. On
 * mobile the panel moves into a bottom sheet behind a floating button.
 */
export function ControlsLayout({
  panel,
  children,
}: {
  panel?: React.ReactNode;
  children: React.ReactNode;
}) {
  const description = usePrototypeInfo()?.description;

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <div
        className={
          panel
            ? "mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-6 pb-24 lg:pb-6"
            : "mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-6"
        }
      >
        {children}
      </div>

      {(panel || description) && (
        <aside data-playground-panel className="hidden w-72 shrink-0 border-l border-border lg:block">
          <div className="sticky top-[var(--chrome-h,0px)] flex max-h-[calc(100dvh-var(--chrome-h,0px))] flex-col gap-4 overflow-y-auto p-4">
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            {description && panel && <div className="border-t border-border" />}
            {panel}
          </div>
        </aside>
      )}

      {panel && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              data-playground-panel
              size="icon-lg"
              className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 size-12 rounded-full shadow-lg lg:hidden"
              aria-label="Controls"
            >
              <SlidersHorizontalIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[70dvh] rounded-t-xl lg:hidden">
            <SheetHeader className="pb-0">
              <SheetTitle>Controls</SheetTitle>
              <SheetDescription className={description ? undefined : "sr-only"}>
                {description ?? "Adjust the parameters"}
              </SheetDescription>
            </SheetHeader>
            <div className="overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {panel}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
