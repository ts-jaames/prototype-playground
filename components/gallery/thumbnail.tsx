import Image from "next/image";

import type { Prototype } from "@/lib/prototypes";

const SIZE = { width: 640, height: 400 };

/** Static light + dark screenshots, swapped by the `dark` class (no JS, no flash). */
export function Thumbnail({ prototype }: { prototype: Prototype }) {
  const { thumbnails, title } = prototype;

  if (!thumbnails) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center bg-muted text-sm text-muted-foreground">
        No preview yet
      </div>
    );
  }

  return (
    <div className="aspect-[16/10] overflow-hidden bg-muted">
      <Image
        src={thumbnails.light}
        alt={title}
        {...SIZE}
        unoptimized
        className="size-full object-cover object-top dark:hidden"
      />
      <Image
        src={thumbnails.dark}
        alt={title}
        {...SIZE}
        unoptimized
        className="hidden size-full object-cover object-top dark:block"
      />
    </div>
  );
}
