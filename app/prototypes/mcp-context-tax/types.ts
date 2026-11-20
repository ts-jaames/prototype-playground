export type Period = "24h" | "7d" | "30d";

export type Tool = {
  id: string;
  name: string;
  /** Tokens the tool's definition occupies in context. */
  tokens: number;
  calls: Record<Period, number>;
};

export type Server = { id: string; label: string; tools: Tool[] };
