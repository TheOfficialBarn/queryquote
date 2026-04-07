/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-06
 * Shared homepage types cover both the presentation content and the live transcript search response contract used by the homepage client.
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

export type SearchStrategy = {
  label: string;
  patternPreview: string;
};

export type SearchResult = {
  explanation: string;
  matchType:
    | "Phrase match"
    | "Fuzzy + ordered"
    | "Ordered token match"
    | "Token shortlist";
  score: number;
  snippet: string;
  title: string;
  year: string;
};

export type SearchApiResponse = {
  diagnostics: {
    cacheHit?: boolean;
    elapsedMs: number;
    normalizedQuery: string;
    searchedFiles?: number;
    strategies: SearchStrategy[];
  };
  error?: string;
  query: string;
  results: SearchResult[];
};
