"use client";

import { SlidersHorizontalIcon } from "lucide-react";

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
 * Subject in a centered column; the panel sits in a sidebar on desktop (never over the
 * subject) and in a bottom sheet behind a floating button on mobile.
 */
export function ControlsLayout({
  panel,
  children,
}: {
  panel: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-6 pb-24 lg:pb-6">
        {children}
      </div>

      <aside data-playground-panel className="hidden w-72 shrink-0 border-l border-border lg:block">
        <div className="sticky top-[var(--chrome-h,0px)] max-h-[calc(100dvh-var(--chrome-h,0px))] overflow-y-auto p-4">
          {panel}
        </div>
      </aside>

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
            <SheetDescription className="sr-only">Adjust the parameters</SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {panel}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
