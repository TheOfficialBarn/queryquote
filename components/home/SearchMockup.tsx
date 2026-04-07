/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-06
 * This section turns the project description into a concrete search experience by showing how a noisy quote could flow through normalization and ranking.
 */

import { SectionIntro } from "@/components/home/SectionIntro";
import type { DemoQueryVariant, DemoSearchResult } from "@/types/queryquote";

type SearchMockupProps = {
  queries: DemoQueryVariant[];
  results: DemoSearchResult[];
};

export function SearchMockup({ queries, results }: SearchMockupProps) {
  return (
    <section
      id="search-mockup"
      className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
    >
      <SectionIntro
        eyebrow="Static Search Mockup"
        title="A quote search interface that makes noisy recall feel recoverable."
        description="The current site stays presentation-only, but the mockup is structured like a real retrieval flow: the query is normalized, candidate passages are ranked, and the top results explain why they surfaced."
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="panel panel--dark rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            <span>Search console</span>
            <span>Passage-level ranking</span>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff8f70]" />
            <span className="h-3 w-3 rounded-full bg-[#f8c15a]" />
            <span className="h-3 w-3 rounded-full bg-[#6bd08c]" />
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
              Current query
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-lg text-white sm:text-xl">
                &gt; may the force b with you
              </p>
              <span className="inline-flex w-fit rounded-full border border-[#ffb38f]/25 bg-[#ffb38f]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffd7c3]">
                typo-safe retrieval
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {queries.map((query) => (
              <article
                key={query.label}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f3c7ae]">
                    {query.label}
                  </p>
                  <span className="rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/55">
                    search stage
                  </span>
                </div>
                <p className="mt-4 font-mono text-sm leading-7 text-white/90">
                  {query.value}
                </p>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  {query.tactic}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {results.map((result) => (
            <article key={result.rank} className="panel rounded-[1.75rem] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-cool">
                    Rank {result.rank}
                  </p>
                  <h3 className="mt-2 [font-family:var(--font-display)] text-3xl text-foreground">
                    {result.title}
                  </h3>
                  <p className="mt-1 text-sm uppercase tracking-[0.14em] text-muted">
                    {result.year}
                  </p>
                </div>
                <div className="rounded-[1.2rem] border border-border bg-surface-strong px-4 py-3 text-right">
                  <p className="font-mono text-xl text-foreground">{result.score}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-cool">
                    {result.matchMode}
                  </p>
                </div>
              </div>

              <blockquote className="mt-5 rounded-[1.35rem] border border-border/90 bg-white/55 px-5 py-4 [font-family:var(--font-display)] text-2xl leading-tight text-foreground">
                {result.snippet}
              </blockquote>

              <p className="mt-4 text-sm leading-7 text-muted">
                {result.explanation}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
