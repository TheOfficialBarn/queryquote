/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * These regression cases turn a curated subset of famous lines from Parade's movie-quote roundup into repeatable local search checks, split between strict rank gates and exploratory corpus probes.
 */

export type QuoteRegressionCase = {
  expectedAnyOf: string[];
  maxRank?: number;
  mode: "exploratory" | "strict";
  note?: string;
  query: string;
  source: "parade" | "user";
};

export const quoteRegressionCases: QuoteRegressionCase[] = [
  {
    expectedAnyOf: ["Gone With the Wind"],
    maxRank: 1,
    mode: "strict",
    query: "Frankly, my dear, I don't give a damn.",
    source: "parade",
  },
  {
    expectedAnyOf: ["A League of Their Own"],
    maxRank: 1,
    mode: "strict",
    query: "There's no crying in baseball!",
    source: "parade",
  },
  {
    expectedAnyOf: ["Legally Blonde"],
    maxRank: 1,
    mode: "strict",
    query: "What, like it's hard?",
    source: "parade",
  },
  {
    expectedAnyOf: ["The Princess Bride"],
    maxRank: 1,
    mode: "strict",
    query: "Hello, my name is Inigo Montoya. You killed my father. Prepare to die.",
    source: "parade",
  },
  {
    expectedAnyOf: ["Star Wars Episode V - The Empire Strikes Back"],
    maxRank: 1,
    mode: "strict",
    query: "No, I am your father",
    source: "user",
  },
  {
    expectedAnyOf: ["The Terminator"],
    mode: "exploratory",
    note:
      "The phrase is ubiquitous across the corpus, so this stays as a ranking-observation case instead of a hard regression gate.",
    query: "I'll be back.",
    source: "parade",
  },
  {
    expectedAnyOf: ["A Few Good Men"],
    mode: "exploratory",
    note:
      "The expected source film does not currently surface reliably from the bundled transcript corpus.",
    query: "You can't handle the truth!",
    source: "parade",
  },
  {
    expectedAnyOf: ["Dirty Dancing"],
    mode: "exploratory",
    note:
      "Direct corpus scans did not locate Dirty Dancing's transcript line, so this is useful for observation but not for pass/fail enforcement.",
    query: "Nobody puts Baby in a corner.",
    source: "parade",
  },
  {
    expectedAnyOf: ["The Wizard of Oz"],
    mode: "exploratory",
    note:
      "The Wizard of Oz phrasing does not appear in the local transcript bundle, which makes this a corpus-gap probe rather than a ranking regression.",
    query: "Toto, I've a feeling we're not in Kansas anymore.",
    source: "parade",
  },
];
