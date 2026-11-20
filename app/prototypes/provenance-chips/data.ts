import type { FieldDef, SourceId } from "./types";

export const ACCOUNT = "Acme Corp";

export const SOURCE_LABELS: Record<SourceId, string> = {
  salesforce: "Salesforce",
  billing: "Billing",
  zendesk: "Zendesk",
  gainsight: "Gainsight",
  sheet: "Q3 forecast sheet",
};

/** The first reading of each field is the one the agent used. */
export const FIELDS: FieldDef[] = [
  {
    id: "arr",
    label: "ARR",
    readings: [
      { source: "salesforce", value: "$480k", tool: "salesforce.get_account", minutesAgo: 130, requeryValue: "$462k" },
      { source: "billing", value: "$462k", tool: "billing.get_subscription", minutesAgo: 12 },
      { source: "sheet", value: "$450k", tool: "drive.read_sheet", minutesAgo: 12960 },
    ],
  },
  {
    id: "renewal",
    label: "Renewal date",
    readings: [
      { source: "salesforce", value: "Mar 14", tool: "salesforce.get_account", minutesAgo: 130, requeryValue: "Mar 31" },
      { source: "billing", value: "Mar 31", tool: "billing.get_subscription", minutesAgo: 12 },
    ],
  },
  {
    id: "owner",
    label: "Owner",
    readings: [
      { source: "salesforce", value: "Dana Lee", tool: "salesforce.get_account", minutesAgo: 130 },
      { source: "gainsight", value: "Dana Lee", tool: "gainsight.get_cta_owner", minutesAgo: 45 },
    ],
  },
  {
    id: "health",
    label: "Health score",
    readings: [
      { source: "gainsight", value: "72", tool: "gainsight.get_health", minutesAgo: 45 },
      { source: "sheet", value: "65", tool: "drive.read_sheet", minutesAgo: 12960 },
    ],
  },
  {
    id: "tickets",
    label: "Open tickets",
    readings: [
      { source: "zendesk", value: "5", tool: "zendesk.search_tickets", minutesAgo: 3 },
      { source: "gainsight", value: "7", tool: "gainsight.get_support_summary", minutesAgo: 45, requeryValue: "5" },
    ],
  },
];
