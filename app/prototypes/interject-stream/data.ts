import type { Directive } from "./types";

export const QUESTION = "How should we roll out the new design system?";

/** The original answer, one clause per entry. A clause is the unit you can tap. */
export const BASE: string[] = [
  "Start with the components that appear on the most screens, because that is where adoption pays back fastest.",
  "Pick two product teams who already feel the pain of inconsistency, and pair a designer and an engineer with each.",
  "Ship the first release as a small kit of buttons, inputs and typography rather than a full library.",
  "Measure adoption by screens covered, not by components published.",
  "Hold a short weekly office hour so teams can bring real problems instead of filing tickets.",
  "Retire old patterns only after two teams have shipped with the new ones.",
  "Publish a changelog people actually read, in plain language.",
  "Revisit the roadmap after six weeks and cut anything nobody asked for.",
];

export const DIRECTIVES: { id: Directive; label: string }[] = [
  { id: "deeper", label: "Go deeper" },
  { id: "shorter", label: "Shorter" },
  { id: "angle", label: "New angle" },
  { id: "sources", label: "Cite sources" },
];

/** What the agent says after being redirected. Each starts a fresh thought. */
export const BRANCHES: Record<Directive, string[]> = {
  deeper: [
    "To go deeper, audit the product and rank every component by how many screens use it.",
    "Then score each one by migration effort and visible impact, and start where both are favorable.",
    "Write the acceptance criteria before building, so done means a team shipped it.",
  ],
  shorter: [
    "In short: start small, pair with two teams, and measure coverage.",
    "Everything else can wait for the next release.",
  ],
  angle: [
    "Another way to see it is as a change-management problem, not a component problem.",
    "People adopt what makes their next sprint easier, so find the pain and remove it first.",
    "The library follows the trust you build.",
  ],
  sources: [
    "Evidence for this comes from three places: your own screen audit, adoption data from the pilot teams, and support tickets about inconsistent UI.",
    "Check each one before committing to the plan.",
  ],
};
