import type { Claim, Source } from "./types";

export const QUESTION = "Should we renew Acme at the proposed price?";

export const SOURCES: Source[] = [
  { id: "salesforce", label: "Salesforce account", tool: "salesforce.get_account" },
  { id: "zendesk", label: "Support tickets", tool: "zendesk.search_tickets" },
  { id: "notes", label: "Q3 review notes", tool: "drive.read_file" },
  { id: "slack", label: "#acme thread", tool: "slack.get_thread" },
  { id: "pricing", label: "Pricing sheet", tool: "drive.read_sheet" },
];

export const CLAIMS: Claim[] = [
  { id: "sf1", source: "salesforce", lean: 2, text: "Usage is up 34% since March across all three teams." },
  { id: "sf2", source: "salesforce", lean: -1, text: "Renewal is nine weeks out and no executive sponsor is logged." },
  { id: "zd1", source: "zendesk", lean: -1, text: "Five tickets are open, two about SSO setup and over ten days old." },
  { id: "zd2", source: "zendesk", lean: 1, text: "Satisfaction on closed tickets averages 4.6 out of 5." },
  { id: "nt1", source: "notes", lean: 2, text: "The champion wants to expand to a fourth team next quarter." },
  { id: "nt2", source: "notes", lean: -1, text: "The budget owner flagged a cost review for next quarter." },
  { id: "sl1", source: "slack", lean: -2, text: "Sales says the champion is happy but the CFO is pushing back on price." },
  { id: "sl2", source: "slack", lean: 1, text: "Support leads praised how responsive the account has been." },
  { id: "pr1", source: "pricing", lean: -1, text: "The proposed price is 12% above the current rate." },
  { id: "pr2", source: "pricing", lean: 1, text: "Comparable accounts accepted uplifts of 8 to 15%." },
];

export const MIN_CLAIMS = 3;
