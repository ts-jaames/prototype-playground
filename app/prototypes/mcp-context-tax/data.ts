import { defineControls } from "@/components/playground/controls";

import type { Server } from "./types";

export const NAMESPACE = "mcp-context-tax";

export const controls = defineControls({
  period: {
    type: "select",
    label: "Usage period",
    default: "7d",
    options: [
      { value: "24h", label: "Last 24 hours" },
      { value: "7d", label: "Last 7 days" },
      { value: "30d", label: "Last 30 days" },
    ],
  },
  budget: { type: "slider", label: "Tool budget", min: 8, max: 32, step: 1, default: 16, unit: "k" },
  threshold: { type: "slider", label: "Unused below", min: 1, max: 10, step: 1, default: 1, unit: " calls" },
});

type Row = [name: string, tokens: number, d1: number, d7: number, d30: number];

function server(id: string, rows: Row[]): Server {
  return {
    id,
    label: id,
    tools: rows.map(([name, tokens, d1, d7, d30]) => ({
      id: `${id}.${name}`,
      name,
      tokens,
      calls: { "24h": d1, "7d": d7, "30d": d30 },
    })),
  };
}

export const SERVERS: Server[] = [
  server("github", [
    ["create_issue", 410, 3, 11, 40],
    ["list_issues", 380, 22, 150, 610],
    ["get_pr", 520, 9, 61, 250],
    ["create_pr", 690, 1, 6, 22],
    ["search_code", 450, 14, 88, 300],
    ["list_commits", 360, 0, 4, 19],
    ["merge_pr", 480, 0, 0, 2],
    ["delete_branch", 300, 0, 0, 0],
    ["fork_repo", 340, 0, 0, 0],
    ["create_release", 560, 0, 0, 1],
    ["list_workflows", 390, 0, 0, 0],
  ]),
  server("postgres", [
    ["query", 620, 31, 210, 900],
    ["execute_sql", 580, 2, 9, 41],
    ["list_tables", 260, 6, 40, 170],
    ["describe_table", 310, 5, 33, 140],
    ["explain", 420, 0, 1, 6],
    ["drop_table", 280, 0, 0, 0],
    ["create_index", 450, 0, 0, 0],
  ]),
  server("slack", [
    ["read_channel", 400, 12, 85, 360],
    ["send_message", 350, 4, 25, 102],
    ["search", 480, 3, 19, 66],
    ["list_channels", 240, 1, 9, 33],
    ["add_reaction", 220, 0, 0, 3],
    ["set_status", 200, 0, 0, 0],
    ["create_channel", 320, 0, 0, 0],
    ["upload_file", 540, 0, 0, 0],
  ]),
  server("filesystem", [
    ["read_file", 300, 40, 280, 1100],
    ["write_file", 340, 8, 52, 210],
    ["list_dir", 280, 19, 130, 520],
    ["edit_file", 520, 6, 40, 160],
    ["search", 360, 2, 14, 60],
    ["move_file", 330, 0, 1, 5],
    ["delete_file", 260, 0, 0, 1],
    ["get_info", 240, 0, 0, 0],
  ]),
  server("browser", [
    ["navigate", 380, 5, 30, 120],
    ["click", 420, 8, 55, 200],
    ["screenshot", 700, 2, 11, 44],
    ["eval_js", 460, 0, 0, 0],
    ["fill_form", 560, 0, 0, 2],
    ["pdf_export", 640, 0, 0, 0],
    ["network_log", 520, 0, 0, 0],
  ]),
];
