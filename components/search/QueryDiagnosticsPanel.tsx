/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This panel breaks the query into the same token views used by the ranking pipeline and compares the current lookup against any matching regression case, making the professor-facing search page explain both input processing and current success criteria.
 */

import type { SearchApiResponse, SearchTestCase } from "@/types/queryquote";

type QueryDiagnosticsPanelProps = {
  activeTestCase: SearchTestCase | null;
  response: SearchApiResponse | null;
  requestError: string | null;
};

const tokenGroups = [
  {
    description: "The fully normalized quote after punctuation folding and apostrophe cleanup.",
    key: "normalizedTokens",
    label: "Normalized tokens",
  },
  {
    description: "Unique quote terms kept in left-to-right order for ordered phrase matching.",
    key: "orderedTokens",
    label: "Ordered tokens",
  },
  {
    description: "Longer non-stopword terms that carry most of the lexical meaning.",
    key: "coreTokens",
    label: "Core tokens",
  },
  {
    description: "Short or stopword-like tokens that were filtered out of the core view.",
    key: "filteredTokens",
    label: "Filtered tokens",
  },
] as const;

export function QueryDiagnosticsPanel({
  activeTestCase,
  response,
  requestError,
}: QueryDiagnosticsPanelProps) {
  const topResult = response?.results[0] ?? null;
  const topResultMatchesExpectation =
    activeTestCase && topResult
      ? normalizeTitle(topResult.title) === normalizeTitle(activeTestCase.movie) &&
        topResult.year === String(activeTestCase.year)
      : false;

  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-neutral-900/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
            Query diagnostics
          </p>
          <h3 className="mt-2 [font-family:var(--font-fraunces)] text-2xl text-neutral-100">
            Tokenization and evaluation context
          </h3>
        </div>
        <div className="rounded-[1.2rem] border border-white/10 bg-neutral-800 px-4 py-3 text-right">
          <p className="font-mono text-lg text-neutral-100">
            {response?.diagnostics.searchedFiles ?? 0}
          </p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            shortlisted files
          </p>
        </div>
      </div>

      {activeTestCase ? (
        <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-neutral-800/80 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Regression case
              </p>
              <p className="mt-2 text-sm leading-7 text-neutral-300">
                Expected top hit: <span className="font-semibold text-neutral-100">{activeTestCase.movie}</span> ({activeTestCase.year})
              </p>
              <p className="mt-1 text-sm leading-7 text-neutral-400">
                This quote came from `tests/tests.csv`, which now acts as the page’s built-in evaluation set.
              </p>
            </div>
            <span
              className={`rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                requestError
                  ? "border-red-400/30 bg-red-500/10 text-red-200"
                  : topResult
                    ? topResultMatchesExpectation
                      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                      : "border-amber-400/30 bg-amber-500/10 text-amber-200"
                    : "border-white/10 bg-white/5 text-neutral-300"
              }`}
            >
              {requestError
                ? "request error"
                : topResult
                  ? topResultMatchesExpectation
                    ? "top-1 matches expected film"
                    : "top-1 diverges from expected film"
                  : "awaiting result"}
            </span>
          </div>

          {topResult && !topResultMatchesExpectation ? (
            <p className="mt-4 text-sm leading-7 text-neutral-400">
              Current top result is <span className="font-semibold text-neutral-100">{topResult.title}</span> ({topResult.year}). This usually means the quote is reused across multiple films, the transcript phrasing appears in commentary-like material, or the heuristic tie-breakers are still too weak.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {tokenGroups.map((group) => {
          const values = response?.diagnostics.tokenization[group.key] ?? [];

          return (
            <section
              key={group.key}
              className="rounded-[1.4rem] border border-white/10 bg-neutral-800/70 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                {group.label}
              </p>
              <p className="mt-2 text-sm leading-7 text-neutral-400">{group.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {values.length ? (
                  values.map((token) => (
                    <span
                      key={`${group.key}-${token}`}
                      className="rounded-full border border-white/10 bg-black/30 px-3 py-2 [font-family:var(--font-ibm-plex-mono)] text-xs text-neutral-200"
                    >
                      {token}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs text-neutral-400">
                    No tokens yet
                  </span>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}

function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
