"use client";

import { PauseIcon, PlayIcon, RefreshCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = { playing: boolean; onToggle: () => void; onRestart: () => void };

export function PlaybackBar({ playing, onToggle, onRestart }: Props) {
  return (
    <div className="flex justify-center gap-2">
      <Button variant="outline" onClick={onToggle} aria-label={playing ? "Pause" : "Play"}>
        {playing ? <PauseIcon /> : <PlayIcon />}
        <span className="hidden sm:inline">{playing ? "Pause" : "Play"}</span>
      </Button>
      <Button variant="outline" onClick={onRestart} aria-label="New seed">
        <RefreshCwIcon />
        <span className="hidden sm:inline">New seed</span>
      </Button>
    </div>
  );
}
