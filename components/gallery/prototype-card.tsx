import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { Prototype } from "@/lib/prototypes";

import { Thumbnail } from "./thumbnail";

export function PrototypeCard({ prototype }: { prototype: Prototype }) {
  return (
    <Link
      href={`/prototypes/${prototype.slug}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card text-card-foreground transition-colors duration-200 hover:border-ring active:border-ring focus-visible:border-ring focus-visible:outline-none"
    >
      <Thumbnail prototype={prototype} />
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <h2 className="truncate font-medium">{prototype.title}</h2>
          {prototype.public && <Badge variant="outline">Public</Badge>}
          {prototype.hidden && <Badge variant="outline">Hidden</Badge>}
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{prototype.description}</p>
        {prototype.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {prototype.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
