import type { Change } from "./types";

export const REQUEST = "Clear Thursday afternoon so I can prep for the investor call";

export const SOURCES_READ = ["Calendar", "Gmail", "Tasks"] as const;

export const CHANGES: Change[] = [
  {
    id: "c1",
    source: "Calendar",
    tool: "calendar.update_event",
    title: "Design sync",
    before: "Thu 1:00 PM – 2:00 PM",
    after: "Fri 10:00 AM – 11:00 AM",
    reason: "Everyone invited is free Friday morning; Thursday has two conflicts.",
  },
  {
    id: "c2",
    source: "Calendar",
    tool: "calendar.update_event",
    title: "1:1 with Priya",
    before: "Thu 3:30 PM – 4:00 PM",
    after: "Wed 4:30 PM – 5:00 PM",
    reason: "Priya has an open slot Wednesday. Your 1:1s moved once already this month.",
  },
  {
    id: "c3",
    source: "Calendar",
    tool: "calendar.create_event",
    title: "Investor call prep",
    before: null,
    after: "Thu 1:00 PM – 4:00 PM, focus time",
    reason: "Frees a three-hour block ahead of Friday's call.",
  },
  {
    id: "c4",
    source: "Gmail",
    tool: "gmail.create_draft",
    title: "Reply to Marcus: vendor intro",
    before: null,
    after: "Draft: \"Can we do Monday instead? Thursday is full.\"",
    reason: "Marcus proposed Thursday 2 PM in his last message.",
  },
  {
    id: "c5",
    source: "Gmail",
    tool: "gmail.label_thread",
    title: "Newsletter digest (4 threads)",
    before: "Inbox",
    after: "Archive, label: Read later",
    reason: "Low priority, none addressed to you directly.",
  },
  {
    id: "c6",
    source: "Tasks",
    tool: "tasks.update_task",
    title: "Send board deck",
    before: "Due Thu",
    after: "Due Fri 9:00 AM",
    reason: "Deck depends on the prep block and can't ship before it.",
  },
];
