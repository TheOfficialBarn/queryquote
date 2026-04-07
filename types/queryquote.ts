/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-06
 * Shared homepage types keep the mock search content structured so the static demo can be replaced with live backend data later.
 */

export type ProposalStat = {
  value: string;
  label: string;
  note: string;
};

export type DemoQueryVariant = {
  label: string;
  value: string;
  tactic: string;
};

export type DemoSearchResult = {
  rank: string;
  title: string;
  year: string;
  score: string;
  matchMode: string;
  snippet: string;
  explanation: string;
};

export type RetrievalCapability = {
  phase: string;
  title: string;
  summary: string;
  details: string[];
};

export type EvaluationMetric = {
  name: string;
  purpose: string;
};

export type ToolGroup = {
  category: string;
  items: string[];
};
