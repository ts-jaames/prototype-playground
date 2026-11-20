import { defineControls } from "@/components/playground/controls";

import type { Item, SourceName } from "./types";

export const NAMESPACE = "steering-dials";

export const QUESTION = "What are customers saying about onboarding?";

/** Scope n searches the first n of these. */
export const SOURCES: SourceName[] = ["Zendesk", "Slack", "Gmail", "Reviews"];

export const TOOLS: Record<SourceName, string> = {
  Zendesk: "zendesk.search_tickets",
  Slack: "slack.search_messages",
  Gmail: "gmail.search_threads",
  Reviews: "reviews.search",
};

export const controls = defineControls({
  scope: { type: "slider", label: "Scope", min: 1, max: 4, step: 1, default: 3, unit: " sources" },
  recency: { type: "slider", label: "Recency", min: 1, max: 90, step: 1, default: 30, unit: " days" },
  relevance: { type: "slider", label: "Relevance floor", min: 0, max: 100, step: 5, default: 40 },
  depth: {
    type: "select",
    label: "Depth",
    default: "summary",
    options: [
      { value: "headline", label: "Headlines" },
      { value: "summary", label: "Summaries" },
      { value: "detail", label: "Full detail" },
    ],
  },
  group: { type: "toggle", label: "Group by source", default: false },
});

export const ITEMS: Item[] = [
  {
    id: "z1", source: "Zendesk", ageDays: 2, relevance: 92,
    headline: "Setup wizard fails on the SSO step",
    summary: "Eleven tickets this week report an error right after the domain check.",
    detail: "Most come from Okta tenants. Support's workaround is manual domain verification, which takes about a day and delays go-live.",
  },
  {
    id: "z2", source: "Zendesk", ageDays: 9, relevance: 71,
    headline: "Invite emails land in spam",
    summary: "Admins say teammates never see their invites.",
    detail: "Concentrated in customers with strict Microsoft 365 filters. SPF alignment is the likely cause; two customers fixed it on their side.",
  },
  {
    id: "z3", source: "Zendesk", ageDays: 35, relevance: 58,
    headline: "CSV import maps columns incorrectly",
    summary: "Users with non-English headers get fields in the wrong place.",
    detail: "Auto-mapping assumes English column names. Four tickets this quarter ended in a manual re-import by support.",
  },
  {
    id: "z4", source: "Zendesk", ageDays: 70, relevance: 33,
    headline: "Request: bulk user import",
    summary: "Larger teams ask to add users in one step.",
    detail: "Three accounts above 200 seats asked for this; all currently invite users one at a time.",
  },
  {
    id: "s1", source: "Slack", ageDays: 1, relevance: 88,
    headline: "Sales hears time-to-value complaints",
    summary: "Three reps flagged prospects saying setup takes too long to show value.",
    detail: "Comments cluster around week one. One rep suggests a guided sample project so new teams see results before configuring anything.",
  },
  {
    id: "s2", source: "Slack", ageDays: 6, relevance: 64,
    headline: "Docs link in the welcome email returns 404",
    summary: "Reported twice in #support within a day.",
    detail: "The link points to a retired docs path. A redirect is queued but not shipped; new signups still get the old link.",
  },
  {
    id: "s3", source: "Slack", ageDays: 21, relevance: 47,
    headline: "Champions ask for an onboarding checklist",
    summary: "CS managers want something to share with their own teams.",
    detail: "Two managers built their own in Notion. Both said a built-in checklist would replace it.",
  },
  {
    id: "s4", source: "Slack", ageDays: 55, relevance: 25,
    headline: "Pricing page confusion during trials",
    summary: "Trial users aren't sure which limits carry over.",
    detail: "Mentioned in a retro thread. Not specific to onboarding, but it surfaces during the first week.",
  },
  {
    id: "g1", source: "Gmail", ageDays: 4, relevance: 81,
    headline: "Enterprise prospect paused rollout over SSO",
    summary: "The security team won't proceed until SSO setup is documented.",
    detail: "Thread with the prospect's IT lead. They asked for a step-by-step SAML guide and a named contact; the call is set for next Tuesday.",
  },
  {
    id: "g2", source: "Gmail", ageDays: 12, relevance: 52,
    headline: "CS lead asks for an onboarding webinar",
    summary: "A mid-market customer wants live training for new hires.",
    detail: "Asks for a monthly session. Marketing has a webinar slot free in two weeks.",
  },
  {
    id: "g3", source: "Gmail", ageDays: 28, relevance: 39,
    headline: "Partner flags missing SCIM docs",
    summary: "An integration partner couldn't find provisioning guidance.",
    detail: "Resolved by email with a PDF, but the partner suggested publishing it.",
  },
  {
    id: "g4", source: "Gmail", ageDays: 80, relevance: 18,
    headline: "Annual survey rates onboarding 3.1 of 5",
    summary: "Lowest-scoring area in last quarter's customer survey.",
    detail: "Free-text answers mention setup length and unclear next steps. Sample size was 41 responses.",
  },
  {
    id: "r1", source: "Reviews", ageDays: 3, relevance: 67,
    headline: "App store review: \"easy to start, hard to finish\"",
    summary: "A four-star review praises sign-up but stalls at team setup.",
    detail: "The reviewer got stuck inviting colleagues and never reached the dashboard. Similar wording appears in two other recent reviews.",
  },
  {
    id: "r2", source: "Reviews", ageDays: 16, relevance: 44,
    headline: "G2 review praises starter templates",
    summary: "Templates are credited with getting a team productive fast.",
    detail: "Mentioned as the main reason the reviewer finished onboarding in a day.",
  },
  {
    id: "r3", source: "Reviews", ageDays: 44, relevance: 29,
    headline: "Review mentions slow first load",
    summary: "A single reviewer found the first session sluggish.",
    detail: "Unrelated to setup steps. No other reviews mention performance.",
  },
  {
    id: "r4", source: "Reviews", ageDays: 85, relevance: 12,
    headline: "Review asks for a dark mode",
    summary: "Feature request, not about onboarding.",
    detail: "Included because it matched the keyword \"first day\".",
  },
];
