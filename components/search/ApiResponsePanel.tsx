/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This panel renders the live search API payload in a readable inspection view so the search page can show the raw response contract without dumping unstyled JSON into the layout.
 */

import type { SearchApiResponse } from "@/types/queryquote";

type ApiResponsePanelProps = {
  response: SearchApiResponse | null;
};

export function ApiResponsePanel({ response }: ApiResponsePanelProps) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-neutral-900/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
            API Response
          </p>
          <h3 className="mt-2 [font-family:var(--font-fraunces)] text-2xl text-neutral-100">
            Search payload
          </h3>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
          JSON
        </span>
      </div>

      <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-black/40 p-4">
        <pre className="max-h-[26rem] overflow-auto whitespace-pre-wrap break-words [font-family:var(--font-ibm-plex-mono)] text-[0.78rem] leading-6 text-neutral-300">
          {response
            ? JSON.stringify(response, null, 2)
            : JSON.stringify(
                {
                  query: "",
                  diagnostics: {
                    normalizedQuery: "",
                    strategies: [],
                    tokenization: {
                      normalizedTokens: [],
                      orderedTokens: [],
                      coreTokens: [],
                      filteredTokens: [],
                    },
                    scoreWeights: [],
                    rankingNotes: [],
                    elapsedMs: 0,
                  },
                  results: [],
                },
                null,
                2,
              )}
        </pre>
      </div>
    </article>
  );
}
