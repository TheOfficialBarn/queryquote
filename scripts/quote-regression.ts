/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This script exercises the live search API against a curated quote set so strict ranking regressions and exploratory corpus probes can be checked quickly from the terminal.
 */

import { quoteRegressionCases } from "../data/quote-regression-cases";

type SearchApiResponse = {
  error?: string;
  results: Array<{
    title: string;
    year: string;
  }>;
};

const DEFAULT_BASE_URL = process.env.QUERYQUOTE_BASE_URL ?? "http://localhost:3000";

async function main() {
  let failures = 0;
  let strictPasses = 0;
  let exploratoryChecks = 0;

  console.log(`Running quote regressions against ${DEFAULT_BASE_URL}`);

  for (const testCase of quoteRegressionCases) {
    let response: Response;

    try {
      response = await fetch(
        `${DEFAULT_BASE_URL}/api/search?q=${encodeURIComponent(testCase.query)}`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown connection failure";

      console.error("FAIL unable to reach the local search API.");
      console.error(`  target: ${DEFAULT_BASE_URL}`);
      console.error(`  reason: ${message}`);
      console.error("  Start `npm run dev` first, then rerun `npm run test:quotes`.");
      process.exitCode = 1;
      return;
    }

    if (!response.ok) {
      console.error(`FAIL ${testCase.query}`);
      console.error(`  API responded with status ${response.status}.`);
      failures += 1;
      continue;
    }

    const payload = (await response.json()) as SearchApiResponse;

    if (payload.error) {
      console.error(`FAIL ${testCase.query}`);
      console.error(`  API error: ${payload.error}`);
      failures += 1;
      continue;
    }

    const matchIndex = payload.results.findIndex((result) =>
      testCase.expectedAnyOf.some(
        (expectedTitle) =>
          normalizeTitle(result.title) === normalizeTitle(expectedTitle),
      ),
    );
    const matchRank = matchIndex >= 0 ? matchIndex + 1 : null;
    const topSummary = payload.results
      .slice(0, 3)
      .map((result, index) => `${index + 1}. ${result.title} (${result.year})`)
      .join(" | ");

    if (testCase.mode === "exploratory") {
      exploratoryChecks += 1;
      const observed =
        matchRank === null
          ? "expected source not returned"
          : `expected source at rank ${String(matchRank)}`;

      console.log(`CHECK [${testCase.source}] ${observed} :: ${testCase.query}`);
      console.log(`  top: ${topSummary}`);

      if (testCase.note) {
        console.log(`  note: ${testCase.note}`);
      }

      continue;
    }

    const passed = matchRank !== null && matchRank <= (testCase.maxRank ?? 0);

    if (passed) {
      strictPasses += 1;
      console.log(
        `PASS [${testCase.source}] rank ${String(matchRank)} <= ${String(testCase.maxRank ?? 0)} :: ${testCase.query}`,
      );
      console.log(`  top: ${topSummary}`);
      continue;
    }

    failures += 1;
    console.error(
      `FAIL [${testCase.source}] expected one of [${testCase.expectedAnyOf.join(", ")}] within top ${String(testCase.maxRank)} :: ${testCase.query}`,
    );
    console.error(
      `  actual rank: ${matchRank === null ? "not returned" : String(matchRank)}`,
    );
    console.error(`  top: ${topSummary}`);
  }

  if (failures > 0) {
    console.error(
      `Strict quote regressions failed: ${String(failures)} failing, ${String(strictPasses)} passing, ${String(exploratoryChecks)} exploratory checks.`,
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `All strict quote regressions passed (${String(strictPasses)} total). Exploratory checks recorded: ${String(exploratoryChecks)}.`,
  );
}

function normalizeTitle(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

void main();
