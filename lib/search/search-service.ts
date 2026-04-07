/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This service executes a disk-backed quote search over the local transcript corpus using ripgrep for shortlist generation and in-process ranking for snippets and typo tolerance, and now exposes tokenization and scoring diagnostics for the professor-facing search page.
 */

import "server-only";

import { constants as fsConstants } from "node:fs";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import {
  buildSearchableText,
  escapeRegex,
  getFilteredTokens,
  getCoreTokens,
  getNormalizedTokens,
  getOrderedTokens,
  normalizeForSearch,
} from "./normalize";
import type {
  SearchApiResponse,
  SearchResult,
  SearchStrategy,
} from "../../types/queryquote";

const TRANSCRIPTS_DIRECTORY = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  "movie-transcripts-59k",
  "transcripts",
);

const MAX_CANDIDATE_FILES = 96;
const MAX_RETURNED_RESULTS = 8;
const FILE_CACHE_LIMIT = 32;
const QUERY_CACHE_LIMIT = 24;
const TITLE_CLUSTER_TOKEN_MIN_FREQUENCY = 2;
const LONG_QUOTE_TOKEN_THRESHOLD = 6;
const YEAR_BIAS_RECENCY_CUTOFF = 2010;
const YEAR_BIAS_DIVISOR = 20;

const TITLE_CLUSTER_STOPWORDS = new Set([
  "adventure",
  "adventures",
  "chapter",
  "episode",
  "film",
  "last",
  "movie",
  "new",
  "part",
  "return",
  "special",
  "story",
  "the",
]);

const DOCUMENTARY_TITLE_PENALTIES: Array<{
  pattern: RegExp;
  value: number;
}> = [
  { pattern: /\blegacy\b/, value: 8 },
  { pattern: /\brevealed\b/, value: 8 },
  { pattern: /\bstory of\b/, value: 9 },
  { pattern: /\bholiday special\b/, value: 7 },
  { pattern: /\bspecial\b/, value: 4 },
  { pattern: /\bdocumentary\b/, value: 8 },
  { pattern: /\bmandela effect\b/, value: 7 },
  { pattern: /\bout of darkness\b/, value: 6 },
  { pattern: /\bgalaxy\b/, value: 4 },
  { pattern: /\bbehind\b/, value: 4 },
  { pattern: /\binside\b/, value: 4 },
];

const CONTEXT_META_PENALTIES: Array<{
  pattern: RegExp;
  value: number;
}> = [
  { pattern: /\bactual(ly)?\b/g, value: 3 },
  { pattern: /\bmovie\b/g, value: 3 },
  { pattern: /\bfilm\b/g, value: 3 },
  { pattern: /\bquote\b/g, value: 4 },
  { pattern: /\bscene\b/g, value: 3 },
  { pattern: /\bcharacter\b/g, value: 3 },
  { pattern: /\bactor\b/g, value: 4 },
  { pattern: /\bdirector\b/g, value: 4 },
  { pattern: /\bvoiced\b/g, value: 4 },
  { pattern: /\btrilogy\b/g, value: 4 },
  { pattern: /\bsaga\b/g, value: 4 },
  { pattern: /\binterview\b/g, value: 4 },
  { pattern: /\bone more time\b/g, value: 4 },
  { pattern: /\bthat was great\b/g, value: 4 },
];

const fileCache = new Map<string, string>();
const queryCache = new Map<string, SearchApiResponse>();

let ripgrepBinary: Promise<string | null> | undefined;

export async function searchMovieQuotes(query: string): Promise<SearchApiResponse> {
  const startedAt = performance.now();
  const trimmedQuery = query.trim();
  const normalizedQuery = normalizeForSearch(trimmedQuery);

  if (trimmedQuery.length < 3 || normalizedQuery.length < 3) {
    return {
      diagnostics: {
        elapsedMs: 0,
        normalizedQuery,
        rankingNotes: [],
        scoreWeights: [],
        strategies: [],
        tokenization: {
          coreTokens: [],
          filteredTokens: [],
          normalizedTokens: [],
          orderedTokens: [],
        },
      },
      error: "Enter at least three characters to search the transcript corpus.",
      query: trimmedQuery,
      results: [],
    };
  }

  const cached = queryCache.get(normalizedQuery);

  if (cached) {
    return {
      ...cached,
      diagnostics: {
        ...cached.diagnostics,
        cacheHit: true,
      },
    };
  }

  const orderedTokens = getOrderedTokens(trimmedQuery).slice(0, 8);
  const coreTokens = getCoreTokens(trimmedQuery).slice(0, 6);
  const normalizedTokens = getNormalizedTokens(trimmedQuery).slice(0, 16);
  const filteredTokens = getFilteredTokens(trimmedQuery).slice(0, 8);
  const fullPhraseTokens = normalizedTokens;

  const strategies = buildStrategies(
    trimmedQuery,
    orderedTokens,
    coreTokens,
    fullPhraseTokens,
  );
  const candidateFiles = await shortlistCandidateFiles(strategies);
  const results = await rankCandidateFiles(
    candidateFiles,
    trimmedQuery,
    normalizedQuery,
    orderedTokens,
    coreTokens,
  );

  const response: SearchApiResponse = {
    diagnostics: {
      elapsedMs: Math.round(performance.now() - startedAt),
      normalizedQuery,
      rankingNotes: buildRankingNotes(),
      scoreWeights: buildScoreWeights(),
      searchedFiles: candidateFiles.length,
      strategies: strategies.map((strategy) => ({
        label: strategy.label,
        patternPreview: strategy.patternPreview,
      })),
      tokenization: {
        coreTokens,
        filteredTokens,
        normalizedTokens,
        orderedTokens,
      },
    },
    query: trimmedQuery,
    results,
  };

  remember(queryCache, normalizedQuery, response, QUERY_CACHE_LIMIT);

  return response;
}

function buildRankingNotes() {
  return [
    "Candidate generation uses ordered phrase, ordered quote-window, core-term, and token-shortlist ripgrep passes over the local transcript files.",
    "Final ranking combines exact phrase detection, token coverage, ordered coverage, proximity, fuzzy bigram overlap, and light title/context/year biases.",
    "Very short or franchise-reused quotes can still be ambiguous because multiple films in the corpus may contain the same normalized line.",
  ];
}

function buildScoreWeights() {
  return [
    {
      label: "Exact phrase hit",
      purpose: "Strong boost when the normalized query appears as a full phrase boundary in a transcript passage.",
      weight: "+72 base",
    },
    {
      label: "Token coverage",
      purpose: "Rewards how many meaningful quote terms appear anywhere in the candidate transcript.",
      weight: "+10 max",
    },
    {
      label: "Ordered coverage",
      purpose: "Rewards candidates that preserve the left-to-right order of the quote terms.",
      weight: "+10 max",
    },
    {
      label: "Proximity",
      purpose: "Rewards candidates where matched terms occur near one another inside the same local window.",
      weight: "+20 max",
    },
    {
      label: "Fuzzy overlap",
      purpose: "Uses bigram Dice similarity so punctuation-free or slightly misremembered lines can stay competitive.",
      weight: "+20 max",
    },
    {
      label: "Title/context/year bias",
      purpose: "Light heuristic adjustment to demote derivative commentary titles and break ties among exact matches.",
      weight: "small tie-breaker",
    },
  ];
}

type CandidateStrategy = SearchStrategy & {
  ripgrepArgs: string[];
};

function buildStrategies(
  rawQuery: string,
  orderedTokens: string[],
  coreTokens: string[],
  fullPhraseTokens: string[],
): CandidateStrategy[] {
  const strategies: CandidateStrategy[] = [];

  if (fullPhraseTokens.length >= 2) {
    const phrasePattern = fullPhraseTokens
      .map((token) => `\\b${buildFlexibleTokenPattern(token)}\\b`)
      .join("\\W+");

    strategies.push({
      label: "Ordered phrase",
      patternPreview: fullPhraseTokens.join(" → "),
      ripgrepArgs: buildRipgrepArgs(phrasePattern),
    });
  }

  if (fullPhraseTokens.length >= 3) {
    const flexiblePattern = fullPhraseTokens
      .map((token) => `\\b${buildFlexibleTokenPattern(token)}\\b`)
      .join(".{0,32}?");

    strategies.push({
      label: "Ordered quote window",
      patternPreview: fullPhraseTokens.join(" ~ "),
      ripgrepArgs: buildRipgrepArgs(flexiblePattern),
    });
  }

  if (coreTokens.length >= 2) {
    const loosePattern = coreTokens
      .map((token) => `\\b${buildFlexibleTokenPattern(token)}\\b`)
      .join("\\W+");

    strategies.push({
      label: "Core terms in order",
      patternPreview: coreTokens.join(" → "),
      ripgrepArgs: buildRipgrepArgs(loosePattern),
    });
  }

  const broadTokens = [...new Set([...coreTokens, ...orderedTokens])].slice(0, 4);

  if (broadTokens.length > 0) {
    const tokenPattern = broadTokens
      .map((token) => `\\b${buildFlexibleTokenPattern(token)}\\b`)
      .join("|");

    strategies.push({
      label: "Token shortlist",
      patternPreview: broadTokens.join(" | "),
      ripgrepArgs: buildRipgrepArgs(tokenPattern),
    });
  }

  if (strategies.length === 0) {
    const fallbackPattern = escapeRegex(rawQuery.trim());

    strategies.push({
      label: "Literal fallback",
      patternPreview: rawQuery.trim(),
      ripgrepArgs: buildRipgrepArgs(fallbackPattern),
    });
  }

  return strategies;
}

function buildFlexibleTokenPattern(token: string) {
  return token
    .split("")
    .map((character) => escapeRegex(character))
    .join("['’]*");
}

function buildRipgrepArgs(pattern: string): string[] {
  return [
    "-l",
    "-i",
    "-m",
    "1",
    "-P",
    pattern,
    TRANSCRIPTS_DIRECTORY,
  ];
}

async function shortlistCandidateFiles(
  strategies: CandidateStrategy[],
): Promise<string[]> {
  const seen = new Set<string>();
  const candidateFiles: string[] = [];

  for (const strategy of strategies) {
    if (candidateFiles.length >= MAX_CANDIDATE_FILES) {
      break;
    }

    const remaining = MAX_CANDIDATE_FILES - candidateFiles.length;
    const files = await runRipgrep(strategy.ripgrepArgs, remaining * 2);

    for (const file of files) {
      if (seen.has(file)) {
        continue;
      }

      seen.add(file);
      candidateFiles.push(file);

      if (candidateFiles.length >= MAX_CANDIDATE_FILES) {
        break;
      }
    }
  }

  return candidateFiles;
}

async function rankCandidateFiles(
  candidateFiles: string[],
  rawQuery: string,
  normalizedQuery: string,
  orderedTokens: string[],
  coreTokens: string[],
): Promise<SearchResult[]> {
  const queryTokenCount = normalizedQuery.split(" ").filter(Boolean).length;
  const preliminaryResults = await Promise.all(
    candidateFiles.map(async (filePath) => {
      const content = await getCachedFileContent(filePath);
      const searchable = buildSearchableText(content);
      const score = scoreCandidate(
        searchable.normalized,
        normalizedQuery,
        orderedTokens,
        coreTokens,
      );

      if (score.total <= 0) {
        return null;
      }

      const titleDetails = parseTitleDetails(filePath);
      const snippet = extractSnippet(
        content,
        searchable,
        score.anchorIndex,
        Math.max(rawQuery.length, normalizedQuery.length),
      );
      const normalizedTitle = normalizeForSearch(titleDetails.title);

      return {
        normalizedTitle,
        score,
        snippet,
        title: titleDetails.title,
        titleTokens: extractTitleTokens(normalizedTitle),
        year: titleDetails.year,
      };
    }),
  );

  const populatedResults = preliminaryResults.filter(
    (
      result,
    ): result is NonNullable<(typeof preliminaryResults)[number]> => result !== null,
  );
  const clusterTokenFrequencies = buildClusterTokenFrequencies(populatedResults);

  return populatedResults
    .map((result) => {
      const titleBias = scoreTitleBias(result.normalizedTitle, result.score.phraseHit);
      const clusterBias = scoreClusterBias(
        result.titleTokens,
        clusterTokenFrequencies,
        result.score.phraseHit,
      );
      const contextBias = scoreContextBias(result.snippet, result.score.phraseHit);
      const yearBias = scoreYearBias(
        result.year,
        result.score.phraseHit,
        queryTokenCount,
      );
      const finalScore =
        result.score.total + titleBias + clusterBias + contextBias + yearBias;

      return {
        explanation: describeMatch(result.score, titleBias, clusterBias, contextBias),
        matchType: result.score.matchType,
        score: finalScore,
        snippet: result.snippet,
        title: result.title,
        year: result.year,
      } satisfies SearchResult;
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, MAX_RETURNED_RESULTS);
}

type CandidateScore = {
  anchorIndex: number;
  fuzzyScore: number;
  matchType: SearchResult["matchType"];
  orderedCoverage: number;
  phraseHit: boolean;
  proximityScore: number;
  tokenCoverage: number;
  total: number;
};

function scoreCandidate(
  normalizedContent: string,
  normalizedQuery: string,
  orderedTokens: string[],
  coreTokens: string[],
): CandidateScore {
  const meaningfulTokens = coreTokens.length >= 2 ? coreTokens : orderedTokens;

  if (meaningfulTokens.length === 0) {
    return {
      anchorIndex: 0,
      fuzzyScore: 0,
      matchType: "Token shortlist",
      orderedCoverage: 0,
      phraseHit: false,
      proximityScore: 0,
      tokenCoverage: 0,
      total: 0,
    };
  }

  const phraseIndex = findPhraseIndex(normalizedContent, normalizedQuery);
  const matchedTokens = meaningfulTokens.filter((token) =>
    findTokenIndex(normalizedContent, token) >= 0,
  );

  const tokenCoverage = matchedTokens.length / meaningfulTokens.length;
  const orderedWindow = findOrderedWindow(normalizedContent, meaningfulTokens);
  const orderedCoverage = orderedWindow.matches / meaningfulTokens.length;
  const proximityScore =
    orderedWindow.matches > 1
      ? 1 / (1 + orderedWindow.span / 120)
      : orderedWindow.matches === 1
        ? 0.25
        : 0;

  const anchorIndex =
    phraseIndex >= 0
      ? phraseIndex
      : orderedWindow.start >= 0
        ? orderedWindow.start
        : findFirstTokenIndex(normalizedContent, matchedTokens);

  const fuzzyWindow = extractNormalizedWindow(
    normalizedContent,
    anchorIndex,
    normalizedQuery.length,
  );
  const fuzzyScore = diceCoefficient(normalizedQuery, fuzzyWindow);
  const phraseHit = phraseIndex >= 0;

  const total =
    (phraseHit ? 72 : 0) +
    tokenCoverage * 10 +
    orderedCoverage * 10 +
    proximityScore * 20 +
    fuzzyScore * 20;

  const adjustedTotal =
    phraseHit
      ? total
      : total * Math.max(0.2, proximityScore + fuzzyScore * 0.35);

  const matchType = phraseHit
    ? "Phrase match"
    : fuzzyScore >= 0.72 && orderedCoverage >= 0.5
      ? "Fuzzy + ordered"
      : orderedCoverage >= 0.66
        ? "Ordered token match"
        : "Token shortlist";

  return {
    anchorIndex,
    fuzzyScore,
    matchType,
    orderedCoverage,
    phraseHit,
    proximityScore,
    tokenCoverage,
    total: adjustedTotal,
  };
}

function findOrderedWindow(normalizedContent: string, tokens: string[]) {
  let cursor = 0;
  let matches = 0;
  let start = -1;
  let end = -1;

  for (const token of tokens) {
    const position = findTokenIndex(normalizedContent, token, cursor);

    if (position < 0) {
      break;
    }

    if (start < 0) {
      start = position;
    }

    end = position + token.length;
    cursor = end;
    matches += 1;
  }

  return {
    matches,
    span: start >= 0 && end >= 0 ? end - start : Number.POSITIVE_INFINITY,
    start,
  };
}

function findFirstTokenIndex(normalizedContent: string, tokens: string[]) {
  let best = -1;

  for (const token of tokens) {
    const position = findTokenIndex(normalizedContent, token);

    if (position >= 0 && (best < 0 || position < best)) {
      best = position;
    }
  }

  return best >= 0 ? best : 0;
}

function findPhraseIndex(normalizedContent: string, normalizedPhrase: string) {
  let cursor = 0;

  while (cursor < normalizedContent.length) {
    const position = normalizedContent.indexOf(normalizedPhrase, cursor);

    if (position < 0) {
      return -1;
    }

    const beforeBoundary = position === 0 || normalizedContent[position - 1] === " ";
    const afterIndex = position + normalizedPhrase.length;
    const afterBoundary =
      afterIndex === normalizedContent.length ||
      normalizedContent[afterIndex] === " ";

    if (beforeBoundary && afterBoundary) {
      return position;
    }

    cursor = position + 1;
  }

  return -1;
}

function findTokenIndex(normalizedContent: string, token: string, from = 0) {
  let cursor = from;

  while (cursor < normalizedContent.length) {
    const position = normalizedContent.indexOf(token, cursor);

    if (position < 0) {
      return -1;
    }

    const beforeBoundary = position === 0 || normalizedContent[position - 1] === " ";
    const afterIndex = position + token.length;
    const afterBoundary =
      afterIndex === normalizedContent.length ||
      normalizedContent[afterIndex] === " ";

    if (beforeBoundary && afterBoundary) {
      return position;
    }

    cursor = position + 1;
  }

  return -1;
}

function extractSnippet(
  rawContent: string,
  searchable: ReturnType<typeof buildSearchableText>,
  anchorIndex: number,
  queryLength: number,
): string {
  if (searchable.normalized.length === 0 || searchable.map.length === 0) {
    return "No snippet available for this transcript.";
  }

  const safeAnchor = Math.min(Math.max(anchorIndex, 0), searchable.map.length - 1);
  const startNormalized = Math.max(0, safeAnchor - 96);
  const endNormalized = Math.min(
    searchable.map.length - 1,
    safeAnchor + Math.max(queryLength + 120, 180),
  );
  const rawStart = searchable.map[startNormalized] ?? 0;
  const rawEnd = (searchable.map[endNormalized] ?? rawContent.length - 1) + 1;

  const snippet = rawContent
    .slice(rawStart, rawEnd)
    .replace(/\s+/g, " ")
    .trim();

  return `${rawStart > 0 ? "..." : ""}${snippet}${rawEnd < rawContent.length ? "..." : ""}`;
}

function extractNormalizedWindow(
  normalizedContent: string,
  anchorIndex: number,
  queryLength: number,
): string {
  const safeAnchor = Math.max(anchorIndex, 0);
  const start = Math.max(0, safeAnchor - 48);
  const end = Math.min(
    normalizedContent.length,
    safeAnchor + Math.max(queryLength + 48, 96),
  );

  return normalizedContent.slice(start, end);
}

function diceCoefficient(left: string, right: string): number {
  if (left === right) {
    return 1;
  }

  if (left.length < 2 || right.length < 2) {
    return 0;
  }

  const leftBigrams = toBigramMap(left);
  const rightBigrams = toBigramMap(right);
  let overlap = 0;

  for (const [bigram, count] of leftBigrams) {
    overlap += Math.min(count, rightBigrams.get(bigram) ?? 0);
  }

  return (2 * overlap) / (left.length - 1 + right.length - 1);
}

function toBigramMap(value: string): Map<string, number> {
  const bigrams = new Map<string, number>();

  for (let index = 0; index < value.length - 1; index += 1) {
    const bigram = value.slice(index, index + 2);
    bigrams.set(bigram, (bigrams.get(bigram) ?? 0) + 1);
  }

  return bigrams;
}

function describeMatch(
  score: CandidateScore,
  titleBias: number,
  clusterBias: number,
  contextBias: number,
) {
  if (score.phraseHit) {
    if (titleBias > 0 || clusterBias > 0) {
      return "Exact normalized phrase match found, with title-level origin signals boosting likely source films over commentary or derivative entries.";
    }

    return "Exact normalized phrase match found in the transcript with strong local overlap.";
  }

  if (score.matchType === "Fuzzy + ordered") {
    return "Ordered quote terms aligned closely enough that fuzzy similarity kept this result competitive.";
  }

  if (score.matchType === "Ordered token match") {
    if (contextBias > 0) {
      return "The transcript preserves the query terms in sequence and the surrounding passage looks more like direct scene dialogue than commentary.";
    }

    return "The transcript preserves the query terms in sequence, even though the wording is not an exact normalized phrase.";
  }

  return "The result surfaced from the broader token shortlist and stayed relevant after local overlap scoring.";
}

function extractTitleTokens(normalizedTitle: string) {
  return [...new Set(
    normalizedTitle
      .split(" ")
      .filter(
        (token) =>
          token.length >= 4 && !TITLE_CLUSTER_STOPWORDS.has(token),
      ),
  )];
}

function buildClusterTokenFrequencies(
  results: Array<{
    score: CandidateScore;
    titleTokens: string[];
  }>,
) {
  const frequencies = new Map<string, number>();

  for (const result of results) {
    if (!result.score.phraseHit) {
      continue;
    }

    for (const token of result.titleTokens) {
      frequencies.set(token, (frequencies.get(token) ?? 0) + 1);
    }
  }

  return frequencies;
}

function scoreTitleBias(normalizedTitle: string, phraseHit: boolean) {
  let score = 0;

  if (phraseHit && /\bepisode\b/.test(normalizedTitle)) {
    score += 8;
  }

  if (phraseHit && /\b(part|chapter)\b/.test(normalizedTitle)) {
    score += 4;
  }

  for (const penalty of DOCUMENTARY_TITLE_PENALTIES) {
    if (penalty.pattern.test(normalizedTitle)) {
      score -= penalty.value;
    }
  }

  return score;
}

function scoreClusterBias(
  titleTokens: string[],
  frequencies: Map<string, number>,
  phraseHit: boolean,
) {
  if (!phraseHit) {
    return 0;
  }

  let score = 0;

  for (const token of titleTokens) {
    const frequency = frequencies.get(token) ?? 0;

    if (frequency >= TITLE_CLUSTER_TOKEN_MIN_FREQUENCY) {
      score += frequency * 2.5;
    }
  }

  return score;
}

function scoreContextBias(snippet: string, phraseHit: boolean) {
  const normalizedSnippet = normalizeForSearch(snippet);
  const sentenceSegments = snippet
    .split(/[.!?…]+/)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .slice(0, 8);

  let score = 0;

  for (const segment of sentenceSegments) {
    const wordCount = normalizeForSearch(segment)
      .split(" ")
      .filter(Boolean).length;

    if (wordCount > 0 && wordCount <= 8) {
      score += 1.5;
    }

    if (wordCount >= 18) {
      score -= 2;
    }
  }

  for (const penalty of CONTEXT_META_PENALTIES) {
    const matches = normalizedSnippet.match(penalty.pattern);

    if (matches) {
      score -= matches.length * penalty.value;
    }
  }

  if (!phraseHit) {
    return score * 0.5;
  }

  return score;
}

function scoreYearBias(
  year: string,
  phraseHit: boolean,
  queryTokenCount: number,
) {
  if (!phraseHit || queryTokenCount < LONG_QUOTE_TOKEN_THRESHOLD) {
    return 0;
  }

  const numericYear = Number.parseInt(year, 10);

  if (!Number.isFinite(numericYear)) {
    return 0;
  }

  return Math.max(0, YEAR_BIAS_RECENCY_CUTOFF - numericYear) / YEAR_BIAS_DIVISOR;
}

function parseTitleDetails(filePath: string) {
  const fileName = path.basename(filePath);
  const match = fileName.match(/^(.*) _(\d{4})_ - full transcript\.txt$/);
  const titleToken = match?.[1] ?? fileName.replace(/ - full transcript\.txt$/, "");
  const title = titleToken.replaceAll("_", "'");

  return {
    title,
    year: match?.[2] ?? "Unknown",
  };
}

async function getCachedFileContent(filePath: string) {
  const cached = fileCache.get(filePath);

  if (cached) {
    remember(fileCache, filePath, cached, FILE_CACHE_LIMIT);
    return cached;
  }

  const content = await readFile(filePath, "utf8");
  remember(fileCache, filePath, content, FILE_CACHE_LIMIT);
  return content;
}

async function runRipgrep(args: string[], limit: number): Promise<string[]> {
  const binary = await resolveRipgrepBinary();

  if (!binary) {
    throw new Error("ripgrep is required for local transcript search but is not installed.");
  }

  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stderr = "";
    let buffer = "";
    let limited = false;
    const lines: string[] = [];

    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      buffer += chunk;

      while (buffer.includes("\n")) {
        const newlineIndex = buffer.indexOf("\n");
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);

        if (!line) {
          continue;
        }

        lines.push(line);

        if (lines.length >= limit) {
          limited = true;
          child.kill("SIGTERM");
          break;
        }
      }
    });

    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
    });

    child.on("error", reject);
    child.on("close", (code, signal) => {
      if (buffer.trim() && lines.length < limit) {
        lines.push(buffer.trim());
      }

      if (code === 0 || code === 1 || signal === "SIGTERM" || limited) {
        resolve(lines);
        return;
      }

      reject(new Error(stderr || `ripgrep exited with code ${String(code)}`));
    });
  });
}

async function resolveRipgrepBinary() {
  if (!ripgrepBinary) {
    ripgrepBinary = findRipgrepBinary();
  }

  return ripgrepBinary;
}

async function findRipgrepBinary() {
  const candidates = [
    process.env.RIPGREP_BINARY,
    process.env.HOME
      ? path.join(process.env.HOME, ".local", "bin", "rg")
      : undefined,
    process.env.HOME
      ? path.join(process.env.HOME, ".cargo", "bin", "rg")
      : undefined,
    "/opt/homebrew/bin/rg",
    "/usr/local/bin/rg",
    "/usr/bin/rg",
    ...(await findVsCodeRipgrepCandidates()),
    "rg",
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    if (candidate.includes(path.sep)) {
      try {
        await access(candidate, fsConstants.X_OK);
        return candidate;
      } catch {
        continue;
      }
    }

    const available = await new Promise<boolean>((resolve) => {
      const child = spawn(candidate, ["--version"], {
        stdio: "ignore",
      });

      child.on("error", () => resolve(false));
      child.on("close", (code) => resolve(code === 0));
    });

    if (available) {
      return candidate;
    }
  }

  return null;
}

async function findVsCodeRipgrepCandidates() {
  const homeDirectory = process.env.HOME;

  if (!homeDirectory) {
    return [];
  }

  const extensionsDirectory = path.join(homeDirectory, ".vscode", "extensions");

  try {
    const entries = await readdir(extensionsDirectory);

    return entries
      .filter((entry) => entry.startsWith("openai.chatgpt-"))
      .map((entry) =>
        path.join(
          extensionsDirectory,
          entry,
          "bin",
          "macos-aarch64",
          "rg",
        ),
      );
  } catch {
    return [];
  }
}

function remember<Value>(
  cache: Map<string, Value>,
  key: string,
  value: Value,
  limit: number,
) {
  if (cache.has(key)) {
    cache.delete(key);
  }

  cache.set(key, value);

  if (cache.size > limit) {
    const oldest = cache.keys().next().value;

    if (oldest) {
      cache.delete(oldest);
    }
  }
}
