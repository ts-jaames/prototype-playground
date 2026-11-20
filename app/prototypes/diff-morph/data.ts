import { defineControls } from "@/components/playground/controls";

import type { Revision } from "./types";

export const NAMESPACE = "diff-morph";

export const controls = defineControls({
  duration: { type: "slider", label: "Duration", min: 150, max: 1500, step: 50, default: 650, unit: " ms" },
  stagger: { type: "slider", label: "Stagger", min: 0, max: 60, step: 2, default: 14, unit: " ms/word" },
  highlight: { type: "toggle", label: "Tint new words", default: true },
});

/** Each revision is what the agent would write after the edit named by its label. */
export const REVISIONS: Revision[] = [
  {
    id: "draft",
    label: "Draft",
    text: "Revenue grew 12% last quarter, driven mostly by new enterprise accounts. Churn stayed flat at 2.1%, so net growth tracks new sales. We expect similar growth next quarter if the pipeline holds.",
  },
  {
    id: "figures",
    label: "New figures",
    text: "Revenue grew 14% last quarter, driven mostly by new enterprise accounts and two large expansions. Churn stayed flat at 2.1%, so net growth tracks new sales. We expect similar growth next quarter if the pipeline holds.",
  },
  {
    id: "caveat",
    label: "Add caveat",
    text: "Revenue grew 14% last quarter, driven mostly by new enterprise accounts and two large expansions. Churn stayed flat at 2.1%, so net growth tracks new sales. We expect similar growth next quarter if the pipeline holds, though two renewals are at risk.",
  },
  {
    id: "tighten",
    label: "Tighten",
    text: "Revenue grew 14% last quarter, mostly from new enterprise accounts and two large expansions. Churn held at 2.1%, so growth tracks new sales. Expect similar growth next quarter if the pipeline holds, though two renewals are at risk.",
  },
  {
    id: "reframe",
    label: "Lead with outlook",
    text: "Next quarter looks similar if the pipeline holds, though two renewals are at risk. Revenue grew 14% last quarter, mostly from new enterprise accounts and two large expansions. Churn held at 2.1%, so growth tracks new sales.",
  },
];
