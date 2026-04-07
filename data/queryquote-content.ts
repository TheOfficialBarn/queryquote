/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-06
 * This module centralizes the static homepage content that remains useful even after the search section moved from static mock data to a live MVP.
 */

import type {
  DemoQueryVariant,
  EvaluationMetric,
  ProposalStat,
  RetrievalCapability,
  ToolGroup,
} from "@/types/queryquote";

export const proposalStats: ProposalStat[] = [
  {
    value: "59,727",
    label: "local transcript files",
    note: "Bundled from the Kaggle movie transcript corpus already included in this repo.",
  },
  {
    value: "BM25 + TF-IDF",
    label: "baseline retrieval",
    note: "Two classical first-stage rankers give the project a measurable IR baseline.",
  },
  {
    value: "Phrase + fuzzy",
    label: "quote-aware search",
    note: "Positional matching, typo tolerance, and punctuation normalization target real misquotes.",
  },
];

export const demoQueries: DemoQueryVariant[] = [
  {
    label: "Remembered line",
    value: "may the force b with you",
    tactic: "The user drops punctuation and mistypes one token, which is common for recalled dialogue.",
  },
  {
    label: "Partial quote",
    value: "ill be back",
    tactic: "A short remembered line tests whether the search can still surface the right movie from a very small lexical signal.",
  },
  {
    label: "Longer fragment",
    value: "frankly my dear i dont give a damn",
    tactic: "Punctuation-free input checks whether normalization keeps famous lines searchable without exact formatting.",
  },
];

export const retrievalCapabilities: RetrievalCapability[] = [
  {
    phase: "Index",
    title: "Passage-first transcript segmentation",
    summary: "Transcripts are split into smaller searchable windows so memorable lines can rank without requiring an entire movie to dominate the score.",
    details: ["Supports quote-sized evidence", "Keeps local context for proximity scoring"],
  },
  {
    phase: "Retrieve",
    title: "Classical lexical baselines",
    summary: "An inverted index powers TF-IDF cosine similarity and BM25 so the system has strong, explainable first-stage retrieval methods.",
    details: ["Fast candidate generation", "Direct comparison against class material"],
  },
  {
    phase: "Refine",
    title: "Quote-aware matching",
    summary: "Phrase search, positional offsets, punctuation normalization, and fuzzy matching target the way people actually remember movie lines.",
    details: ["Handles misspellings", "Rewards ordered nearby terms"],
  },
  {
    phase: "Expand",
    title: "Optional semantic retrieval",
    summary: "Sentence embeddings can recover paraphrases or meaning-preserving reformulations when lexical overlap is too weak to surface the right movie.",
    details: ["Useful for loose memory", "Natural second-stage extension"],
  },
];

export const evaluationMetrics: EvaluationMetric[] = [
  {
    name: "MAP",
    purpose: "Measures how well the ranking orders relevant movies or passages across the full result list.",
  },
  {
    name: "MRR",
    purpose: "Highlights how quickly the first correct movie appears for short quote queries.",
  },
  {
    name: "nDCG@K",
    purpose: "Rewards strong early ranking when multiple relevant passages or franchise entries exist.",
  },
  {
    name: "Precision / Recall",
    purpose: "Shows the tradeoff between exact quote recovery and broader fuzzy or semantic recall.",
  },
];

export const toolGroups: ToolGroup[] = [
  {
    category: "Backend",
    items: ["Python", "FastAPI", "Pydantic", "PostgreSQL"],
  },
  {
    category: "Retrieval and NLP",
    items: [
      "Pyserini",
      "NLTK",
      "RapidFuzz",
      "Sentence-Transformers",
      "pytrec_eval",
      "FAISS (optional)",
    ],
  },
  {
    category: "Frontend and Analysis",
    items: ["Next.js", "TypeScript", "Tailwind CSS", "Pandas"],
  },
];
