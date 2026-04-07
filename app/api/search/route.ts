/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This route exposes the local transcript search service to the homepage client without coupling UI components to filesystem and process-level search concerns, including the richer diagnostics needed for the professor-facing search page.
 */

import type { NextRequest } from "next/server";
import { searchMovieQuotes } from "@/lib/search/search-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";

  try {
    const response = await searchMovieQuotes(query);
    return Response.json(response);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unexpected search failure while querying the local transcript corpus.";

    return Response.json(
      {
        diagnostics: {
          elapsedMs: 0,
          normalizedQuery: "",
          rankingNotes: [],
          scoreWeights: [],
          tokenization: {
            coreTokens: [],
            filteredTokens: [],
            normalizedTokens: [],
            orderedTokens: [],
          },
          strategies: [],
        },
        error: message,
        query,
        results: [],
      },
      { status: 500 },
    );
  }
}
