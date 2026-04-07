/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This panel packages the ranking heuristics into compact IR-oriented cards so the search page explains candidate generation and reranking decisions in language a course evaluator can inspect quickly.
 */

import type { SearchApiResponse } from "@/types/queryquote";

type SearchTheoryPanelProps = {
  response: SearchApiResponse | null;
};

export function SearchTheoryPanel({ response }: SearchTheoryPanelProps) {
  const scoreWeights = response?.diagnostics.scoreWeights ?? [];
  const rankingNotes = response?.diagnostics.rankingNotes ?? [];
  const strategies = response?.diagnostics.strategies ?? [];

  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-neutral-900/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
        IR Theory View
      </p>
      <h3 className="mt-2 [font-family:var(--font-fraunces)] text-2xl text-neutral-100">
        Candidate generation and reranking
      </h3>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <section className="rounded-[1.4rem] border border-white/10 bg-neutral-800/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Candidate generation
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {strategies.length ? (
              strategies.map((strategy) => (
                <span
                  key={`${strategy.label}-${strategy.patternPreview}`}
                  className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-200"
                >
                  {strategy.label}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs text-neutral-400">
                Run a query to inspect the active shortlist passes.
              </span>
            )}
          </div>
        </section>

        <section className="rounded-[1.4rem] border border-white/10 bg-neutral-800/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Ranking notes
          </p>
          <div className="mt-4 space-y-3">
            {rankingNotes.length ? (
              rankingNotes.map((note) => (
                <p key={note} className="text-sm leading-7 text-neutral-400">
                  {note}
                </p>
              ))
            ) : (
              <p className="text-sm leading-7 text-neutral-400">
                Run a query to inspect the current ranking explanation.
              </p>
            )}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {scoreWeights.length ? (
          scoreWeights.map((weight) => (
            <section
              key={weight.label}
              className="rounded-[1.4rem] border border-white/10 bg-neutral-800/70 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    {weight.label}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-neutral-400">
                    {weight.purpose}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 [font-family:var(--font-ibm-plex-mono)] text-xs text-neutral-200">
                  {weight.weight}
                </span>
              </div>
            </section>
          ))
        ) : (
          <section className="rounded-[1.4rem] border border-white/10 bg-neutral-800/70 p-5 xl:col-span-2">
            <p className="text-sm leading-7 text-neutral-400">
              No score-weight diagnostics are available until a query runs.
            </p>
          </section>
        )}
      </div>
    </article>
  );
}
