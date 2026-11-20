export type SourceName = "Zendesk" | "Slack" | "Gmail" | "Reviews";

export type Item = {
  id: string;
  source: SourceName;
  ageDays: number;
  /** 0-100, how well the item matches the question. */
  relevance: number;
  headline: string;
  summary: string;
  detail: string;
};

export type Depth = "headline" | "summary" | "detail";

export type Settings = {
  scope: number;
  recency: number;
  relevance: number;
  depth: Depth;
  group: boolean;
};

export type QueryResult = {
  items: Item[];
  /** The MCP calls these settings translate to. */
  calls: string[];
};
