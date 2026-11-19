"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import type { Prototype } from "@/lib/prototypes";

import { collectTags, filterPrototypes } from "./filter";
import { PrototypeCard } from "./prototype-card";

export function Gallery({ prototypes }: { prototypes: Prototype[] }) {
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showHidden, setShowHidden] = useState(false);

  const allTags = useMemo(() => collectTags(prototypes), [prototypes]);
  const visible = useMemo(
    () => filterPrototypes(prototypes, { query, tags, showHidden }),
    [prototypes, query, tags, showHidden],
  );
  const hiddenCount = prototypes.filter((p) => p.hidden).length;

  const toggleTag = (tag: string) =>
    setTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Input
          type="search"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search prototypes"
        />
        {(allTags.length > 0 || hiddenCount > 0) && (
          <div className="flex flex-wrap items-center gap-2">
            {allTags.map((tag) => (
              <Toggle
                key={tag}
                size="sm"
                variant="outline"
                className="data-[state=on]:border-primary"
                pressed={tags.includes(tag)}
                onPressedChange={() => toggleTag(tag)}
              >
                {tag}
              </Toggle>
            ))}
            {hiddenCount > 0 && (
              <Label className="ml-auto gap-2 text-muted-foreground">
                <Switch checked={showHidden} onCheckedChange={setShowHidden} />
                Hidden ({hiddenCount})
              </Label>
            )}
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          {prototypes.length === 0 ? "No prototypes yet." : "Nothing matches."}
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li key={p.slug}>
              <PrototypeCard prototype={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
