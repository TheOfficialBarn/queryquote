/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-06
 * Shared normalization helpers keep the quote search pipeline consistent across candidate generation, scoring, and snippet extraction.
 */

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "has",
  "have",
  "he",
  "her",
  "his",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "me",
  "may",
  "my",
  "of",
  "on",
  "or",
  "our",
  "so",
  "that",
  "the",
  "their",
  "them",
  "they",
  "this",
  "to",
  "was",
  "we",
  "were",
  "what",
  "when",
  "with",
  "would",
  "you",
  "your",
]);

type SearchableText = {
  map: number[];
  normalized: string;
};

export function buildSearchableText(input: string): SearchableText {
  let normalized = "";
  let previousWasSpace = true;
  const map: number[] = [];

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];

    if (/[a-z0-9]/i.test(character)) {
      normalized += character.toLowerCase();
      map.push(index);
      previousWasSpace = false;
      continue;
    }

    if (!previousWasSpace) {
      normalized += " ";
      map.push(index);
      previousWasSpace = true;
    }
  }

  if (normalized.endsWith(" ")) {
    normalized = normalized.slice(0, -1);
    map.pop();
  }

  return {
    map,
    normalized,
  };
}

export function normalizeForSearch(input: string): string {
  return buildSearchableText(input).normalized;
}

export function getOrderedTokens(input: string): string[] {
  return uniqueTokens(normalizeForSearch(input).split(" ").filter((token) => token.length >= 2));
}

export function getCoreTokens(input: string): string[] {
  return uniqueTokens(
    normalizeForSearch(input)
      .split(" ")
      .filter((token) => token.length >= 3 && !STOPWORDS.has(token)),
  );
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function uniqueTokens(tokens: string[]): string[] {
  return [...new Set(tokens)];
}
