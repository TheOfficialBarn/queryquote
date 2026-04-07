/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This server-only loader reads the professor's quote regression cases from tests/tests.csv so the search page can surface a curated evaluation set without duplicating fixture data in the UI.
 */

import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import type { SearchTestCase } from "@/types/queryquote";

const SEARCH_TESTS_PATH = path.join(process.cwd(), "tests", "tests.csv");

export async function loadSearchTests(): Promise<SearchTestCase[]> {
  const rawCsv = await readFile(SEARCH_TESTS_PATH, "utf8");

  return rawCsv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(1)
    .map(parseCsvLine)
    .map(([quote, movie, year]) => ({
      movie,
      quote,
      year: Number(year),
    }))
    .filter((testCase) => testCase.quote && testCase.movie && Number.isFinite(testCase.year));
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (inQuotes && line[index + 1] === '"') {
        currentValue += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === "," && !inQuotes) {
      values.push(currentValue);
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue);
  return values;
}
