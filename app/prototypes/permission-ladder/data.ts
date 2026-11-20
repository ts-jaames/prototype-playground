import type { Risk, Scope, Step, Tool } from "./types";

export const TASK = "Prepare the weekly client update";

export const TOOLS: Tool[] = [
  { id: "drive.read_file", label: "Read a Drive file", risk: "read" },
  { id: "gmail.search_threads", label: "Search your email", risk: "read" },
  { id: "gmail.create_draft", label: "Create an email draft", risk: "write" },
  { id: "gmail.send", label: "Send email as you", risk: "send" },
  { id: "calendar.create_event", label: "Add a calendar event", risk: "write" },
];

export const STEPS: Step[] = [
  { id: "s1", toolId: "drive.read_file", text: "Read last week's status doc" },
  { id: "s2", toolId: "gmail.search_threads", text: "Find threads with the client" },
  { id: "s3", toolId: "gmail.search_threads", text: "Check for replies since Monday" },
  { id: "s4", toolId: "gmail.create_draft", text: "Draft the weekly update" },
  { id: "s5", toolId: "gmail.send", text: "Send the update to Priya" },
  { id: "s6", toolId: "calendar.create_event", text: "Book the follow-up call" },
];

export const RISK_LABELS: Record<Risk, string> = {
  read: "Reads data",
  write: "Changes data",
  send: "Acts as you",
};

export const RUNGS: { scope: Scope; label: string; hint: string }[] = [
  { scope: "always", label: "Always", hint: "Until you revoke it" },
  { scope: "task", label: "For this task", hint: "Until the run finishes" },
  { scope: "once", label: "Just this once", hint: "Asks again next time" },
  { scope: "deny", label: "Don't allow", hint: "Skip this step" },
];

/** The most trust each kind of action can be given. Riskier actions always keep a human in the loop. */
export const ALLOWED: Record<Risk, Scope[]> = {
  read: ["always", "task", "once", "deny"],
  write: ["task", "once", "deny"],
  send: ["once", "deny"],
};
