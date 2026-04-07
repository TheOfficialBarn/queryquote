/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * Shared site types cover both the presentation content and the richer live transcript search response contract now exposed on the professor-facing search page.
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

export type SearchTokenDiagnostics = {
  coreTokens: string[];
  filteredTokens: string[];
  normalizedTokens: string[];
  orderedTokens: string[];
};

export type SearchScoreWeight = {
  label: string;
  purpose: string;
  weight: string;
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
    rankingNotes: string[];
    scoreWeights: SearchScoreWeight[];
    searchedFiles?: number;
    strategies: SearchStrategy[];
    tokenization: SearchTokenDiagnostics;
  };
  error?: string;
  query: string;
  results: SearchResult[];
};

export type SearchTestCase = {
  movie: string;
  quote: string;
  year: number;
};
