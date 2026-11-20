import type { Inputs, InputKey } from "./types";

export const TASK = "Find a day for the team offsite";

export const MEMBERS = [
  { name: "Ana", teams: ["design"] },
  { name: "Ben", teams: ["design"] },
  { name: "Chloe", teams: ["design"] },
  { name: "Dev", teams: ["design"] },
  { name: "Eli", teams: ["design"] },
  { name: "Fay", teams: ["design"] },
  { name: "Gus", teams: ["product"] },
  { name: "Hana", teams: ["product"] },
  { name: "Ira", teams: ["product"] },
  { name: "Jo", teams: ["product"] },
  { name: "Kai", teams: ["product"] },
  { name: "Lena", teams: ["product"] },
  { name: "Milo", teams: ["product"] },
  { name: "Nia", teams: ["product"] },
  { name: "Omar", teams: ["product"] },
] as const;

export const VENUES = [
  { name: "The Loft", capacity: 8 },
  { name: "Studio 4", capacity: 12 },
  { name: "Riverside Hall", capacity: 20 },
] as const;

export const DEFAULT_INPUTS: Inputs = { team: "design", window: "2w", quorum: "80" };

export const WORKDAYS: Record<Inputs["window"], number> = { "1w": 5, "2w": 10, "4w": 20 };

export const OPTIONS = {
  team: [
    { value: "design", label: "Design (6 people)" },
    { value: "product", label: "Product (9 people)" },
    { value: "all", label: "Everyone (15 people)" },
  ],
  window: [
    { value: "1w", label: "Next week" },
    { value: "2w", label: "Next 2 weeks" },
    { value: "4w", label: "Next 4 weeks" },
  ],
  quorum: [
    { value: "60", label: "At least 60% free" },
    { value: "80", label: "At least 80% free" },
    { value: "100", label: "Everyone free" },
  ],
} as const satisfies Record<InputKey, readonly { value: string; label: string }[]>;

export const INPUT_LABELS: Record<InputKey, string> = {
  team: "Team",
  window: "Window",
  quorum: "Quorum",
};
