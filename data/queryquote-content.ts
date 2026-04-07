/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-06
 * This module centralizes the static content that drives the Query-Quote landing page so presentation components stay focused on layout.
 */

import type {
  DemoQueryVariant,
  DemoSearchResult,
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
    value: '"may the force b with you"',
    tactic: "The user drops punctuation and mistypes one token, which is common for recalled dialogue.",
  },
  {
    label: "Normalized query",
    value: '"may the force be with you"',
    tactic: "Normalization repairs spacing and punctuation so phrase retrieval and BM25 can align cleanly.",
  },
  {
    label: "Semantic backup",
    value: '"good luck, may the force guide you"',
    tactic: "A semantic fallback can recover near-paraphrases when exact wording is unavailable.",
  },
];

export const demoResults: DemoSearchResult[] = [
  {
    rank: "01",
    title: "Star Wars",
    year: "1977",
    score: "0.97",
    matchMode: "Phrase + fuzzy",
    snippet: '"Luke, may the Force be with you."',
    explanation: "Highest rank after typo repair changes the remembered query from 'b' to 'be' and confirms phrase order.",
  },
  {
    rank: "02",
    title: "The Empire Strikes Back",
    year: "1980",
    score: "0.81",
    matchMode: "Phrase + proximity",
    snippet: '"And may the Force be with you."',
    explanation: "Strong lexical overlap remains, but the exact local wording is slightly weaker than the top hit.",
  },
  {
    rank: "03",
    title: "Return of the Jedi",
    year: "1983",
    score: "0.73",
    matchMode: "Franchise neighbor",
    snippet: '"May the Force be with you, always."',
    explanation: "Returned as a close series match once the system broadens from exact phrase evidence to nearby variants.",
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
