/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This client component turns the landing-page mockup into a real search workbench while keeping all retrieval and filesystem work in the server route, with explicit request-state handling and a gradient-treated console shell whose border now matches the rest of the site's cards.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import type { DemoQueryVariant, SearchApiResponse } from "@/types/queryquote";

type SearchWorkbenchClientProps = {
  sampleQueries: DemoQueryVariant[];
};

export function SearchWorkbenchClient({
  sampleQueries,
}: SearchWorkbenchClientProps) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<SearchApiResponse | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const activeControllerRef = useRef<AbortController | null>(null);

  async function searchRequest(nextQuery: string) {
    const trimmedQuery = nextQuery.trim();

    if (!trimmedQuery) {
      setResponse(null);
      setRequestError("Enter a quote fragment to search.");
      return;
    }

    activeControllerRef.current?.abort();
    const controller = new AbortController();
    activeControllerRef.current = controller;

    setRequestError(null);
    setIsLoading(true);

    try {
      const searchResponse = await fetch(
        `/api/search?q=${encodeURIComponent(trimmedQuery)}`,
        {
          signal: controller.signal,
        },
      );
      const payload = (await searchResponse.json()) as SearchApiResponse;

      setResponse(payload);
      setRequestError(searchResponse.ok ? null : payload.error ?? "Search failed.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setRequestError("Search failed before the local API returned a response.");
      setResponse(null);
    } finally {
      if (activeControllerRef.current === controller) {
        activeControllerRef.current = null;
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    return () => {
      activeControllerRef.current?.abort();
    };
  }, []);

  function submitSearch(nextQuery: string) {
    void searchRequest(nextQuery);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-950/70 via-neutral-950/85 to-orange-950/70" />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            <span>Live search console</span>
            <span>Disk-backed transcript retrieval</span>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-white/80" />
            <span className="h-3 w-3 rounded-full bg-white/45" />
            <span className="h-3 w-3 rounded-full bg-white/20" />
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch(query);
            }}
          >
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
                Quote query
              </span>
              <input
                className="mt-3 h-14 w-full rounded-[1.6rem] border border-white/10 bg-white/6 px-5 text-base text-white outline-none transition-colors duration-300 placeholder:text-white/35 focus:border-white/30"
                enterKeyHint="search"
                name="query"
                placeholder="Type a remembered line, misquote, or punctuation-free fragment."
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
              />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button
                className="inline-flex min-w-44 items-center justify-center gap-2 rounded-full border border-white/10 bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_12px_28px_rgba(0,0,0,0.2)] transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-neutral-200 hover:shadow-[0_16px_32px_rgba(0,0,0,0.24)] disabled:cursor-not-allowed disabled:bg-neutral-500 disabled:text-neutral-900 disabled:shadow-none"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? <span className="inline-block h-4 w-4 flex-none animate-spin rounded-full border-2 border-white/20 border-t-white" aria-hidden="true" /> : null}
                {isLoading ? "Searching corpus..." : "Search transcripts"}
              </button>
              <span className="text-sm leading-7 text-white/55">
                Uses ripgrep to shortlist local transcript files, then reranks them
                with normalized phrase and fuzzy overlap scoring.
              </span>
            </div>
          </form>

          <div className="mt-6 grid gap-4">
            {sampleQueries.map((sampleQuery) => (
              <button
                key={sampleQuery.label}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-left transition-colors duration-300 hover:bg-white/[0.08]"
                disabled={isLoading}
                type="button"
                onClick={() => {
                  setQuery(sampleQuery.value);
                  submitSearch(sampleQuery.value);
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/58">
                    {sampleQuery.label}
                  </p>
                  <span className="rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/55">
                    sample search
                  </span>
                </div>
                <p className="mt-4 font-mono text-sm leading-7 text-white/90">
                  {sampleQuery.value}
                </p>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  {sampleQuery.tactic}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid max-h-[72rem] gap-4 overflow-hidden lg:grid-rows-[auto_minmax(0,1fr)]">
        <article className="rounded-[1.75rem] border border-white/10 bg-neutral-900/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
                Search diagnostics
              </p>
              <h3 className="mt-2 [font-family:var(--font-fraunces)] text-3xl text-neutral-100">
                {response?.diagnostics.normalizedQuery || "Waiting for query"}
              </h3>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-neutral-800 px-4 py-3 text-right">
              <p className="font-mono text-xl text-neutral-100">
                {response?.diagnostics.elapsedMs ?? 0}ms
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                query time
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {(response?.diagnostics.strategies ?? []).map((strategy) => (
              <span
                key={`${strategy.label}-${strategy.patternPreview}`}
                className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-300"
              >
                {strategy.label}: {strategy.patternPreview}
              </span>
            ))}
          </div>

          <p className="mt-5 text-sm leading-7 text-neutral-400">
            {response
              ? `Searched ${response.diagnostics.searchedFiles ?? 0} candidate transcript files from the local corpus and returned the highest-scoring matches.`
              : "Run a query to see how normalization and candidate-generation strategies behave on the local corpus."}
          </p>

          {requestError ? (
            <p className="mt-4 rounded-[1.2rem] border border-white/10 bg-[#1b1b1b] px-4 py-3 text-sm leading-7 text-white/72">
              {requestError}
            </p>
          ) : null}
        </article>

        {response?.results.length ? (
          <div className="grid max-h-full gap-4 overflow-y-auto pr-1">
            {response.results.map((result, index) => (
              <article key={`${result.title}-${result.year}-${index}`} className="rounded-[1.75rem] border border-white/10 bg-neutral-900/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
                      Rank {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 [font-family:var(--font-fraunces)] text-3xl text-neutral-100">
                      {result.title}
                    </h3>
                    <p className="mt-1 text-sm uppercase tracking-[0.14em] text-neutral-400">
                      {result.year}
                    </p>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/10 bg-neutral-800 px-4 py-3 text-right">
                    <p className="font-mono text-xl text-neutral-100">
                      {result.score.toFixed(1)}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                      {result.matchType}
                    </p>
                  </div>
                </div>

                <blockquote className="mt-5 rounded-[1.35rem] border border-white/10 bg-neutral-800/80 px-5 py-4 [font-family:var(--font-fraunces)] text-2xl leading-tight text-neutral-100">
                  {result.snippet}
                </blockquote>

                <p className="mt-4 text-sm leading-7 text-neutral-400">
                  {result.explanation}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <article className="rounded-[1.75rem] border border-white/10 bg-neutral-900/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <p className="text-sm leading-7 text-neutral-400">
              No results have been returned yet. Try one of the sample queries or
              enter a memorable line from a movie transcript.
            </p>
          </article>
        )}
      </div>
    </div>
  );
}
