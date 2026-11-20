// Pure, deterministic stand-in for an agent run. Same inputs always give the same steps.
import { addDays, format, isWeekend } from "date-fns";

import { MEMBERS, VENUES, WORKDAYS } from "./data";
import type { Answer, Inputs, Run, Step } from "./types";

const START = new Date(2026, 11, 7); // Monday, Dec 7 2026
const BUSY_PERCENT = 35;

function isBusy(day: number, member: number): boolean {
  let h = Math.imul(day * 97 + member * 13 + 7, 2654435761);
  h ^= h >>> 15;
  return (h >>> 0) % 100 < BUSY_PERCENT;
}

function workdays(count: number): Date[] {
  const days: Date[] = [];
  for (let d = START; days.length < count; d = addDays(d, 1)) {
    if (!isWeekend(d)) days.push(d);
  }
  return days;
}

function memberIndexes(team: Inputs["team"]): number[] {
  return MEMBERS.flatMap((m, i) => (team === "all" || m.teams.some((t) => t === team) ? [i] : []));
}

export function simulate(inputs: Inputs): { steps: Step[]; answer: Answer } {
  const members = memberIndexes(inputs.team);
  const days = workdays(WORKDAYS[inputs.window]);
  const scored = days.map((date, i) => ({
    date,
    free: members.filter((m) => !isBusy(i, m)).length,
  }));
  const conflicts = scored.reduce((sum, d) => sum + (members.length - d.free), 0);

  const needed = Math.ceil((members.length * Number(inputs.quorum)) / 100);
  // Earliest day that meets quorum wins, so a lower quorum can pull the date forward.
  const qualifying = scored.filter((d) => d.free >= needed);
  const best = qualifying[0];
  const venue = VENUES.find((v) => v.capacity >= members.length) ?? VENUES[VENUES.length - 1];

  const answer: Answer = best
    ? {
        key: `${format(best.date, "yyyy-MM-dd")}|${venue.name}`,
        headline: `${format(best.date, "EEE MMM d")} at ${venue.name}`,
        detail: `${best.free} of ${members.length} free`,
      }
    : {
        key: "none",
        headline: "No day works",
        detail: `None of ${days.length} days reach ${inputs.quorum}% free. Try a longer window or a lower quorum.`,
      };

  const steps: Step[] = [
    {
      id: "members",
      tool: "directory.list_members",
      args: `team="${inputs.team}"`,
      result: `${members.length} people`,
      inputKey: "team",
    },
    {
      id: "freebusy",
      tool: "calendar.get_freebusy",
      args: `window="${inputs.window}", people=${members.length}`,
      result: `${days.length} workdays scanned, ${conflicts} conflicts`,
      inputKey: "window",
    },
    {
      id: "rank",
      tool: "schedule.rank_days",
      args: `quorum=${inputs.quorum}%`,
      result: `${qualifying.length} of ${days.length} days qualify`,
      inputKey: "quorum",
    },
    {
      id: "venue",
      tool: "venues.search",
      args: `capacity>=${members.length}`,
      result: best ? `${venue.name}, fits ${venue.capacity}` : "Skipped, no day to book",
      inputKey: null,
    },
    {
      id: "answer",
      tool: "agent.compose_answer",
      args: "from steps 1-4",
      result: answer.headline,
      inputKey: null,
    },
  ];
  return { steps, answer };
}

export function buildRun(
  id: string,
  label: string,
  inputs: Inputs,
  parentId: string | null,
  forkStep: number | null,
): Run {
  return { id, label, parentId, forkStep, inputs, ...simulate(inputs) };
}
