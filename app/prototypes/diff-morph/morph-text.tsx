import { Fragment } from "react";

import type { Ghost, Token } from "./types";

type Props = {
  tokens: Token[];
  ghosts: Ghost[];
  containerRef: React.RefObject<HTMLParagraphElement | null>;
  registerWord: (id: number, el: HTMLElement | null) => void;
  registerGhost: (id: number, el: HTMLElement | null) => void;
};

export function MorphText({ tokens, ghosts, containerRef, registerWord, registerGhost }: Props) {
  return (
    <p ref={containerRef} className="relative text-base leading-relaxed">
      {tokens.map((t) => (
        <Fragment key={t.id}>
          <span ref={(el) => registerWord(t.id, el)} className="inline-block rounded-sm">
            {t.text}
          </span>{" "}
        </Fragment>
      ))}
      {ghosts.map((g) => (
        <span
          key={g.id}
          ref={(el) => registerGhost(g.id, el)}
          aria-hidden
          className="pointer-events-none absolute whitespace-nowrap text-muted-foreground"
          style={{ left: g.x, top: g.y }}
        >
          {g.text}
        </span>
      ))}
    </p>
  );
}
