"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

/** Slim bar above every private prototype. Hidden in thumbnail captures. */
export function PrototypeHeader({ titles }: { titles: Record<string, string> }) {
  const slug = usePathname().split("/")[2] ?? "";

  return (
    <header
      data-playground-chrome
      className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-background/80 px-2 backdrop-blur sm:px-4"
    >
      <Button variant="ghost" size="icon" asChild>
        <Link href="/" aria-label="All prototypes">
          <ArrowLeftIcon />
        </Link>
      </Button>
      <span className="flex-1 truncate text-sm font-medium">{titles[slug] ?? ""}</span>
      <ThemeToggle />
    </header>
  );
}
