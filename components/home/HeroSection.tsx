/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-06
 * The hero frames Query-Quote as a retrieval product first, while surfacing the course context, team, and the core system signals immediately.
 */

import type { ProposalStat } from "@/types/queryquote";

type HeroSectionProps = {
  stats: ProposalStat[];
};

const heroPills = [
  "Punctuation-agnostic",
  "Misquote-tolerant",
  "Passage indexed",
  "Semantic-ready",
];

export function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="px-4 pb-8 pt-8 sm:px-6 sm:pb-10 sm:pt-10 lg:px-8 lg:pb-12 lg:pt-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <div className="panel fade-rise overflow-hidden rounded-[2rem] p-8 sm:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="section-kicker">EECS 767 Project</p>
              <h1 className="[font-family:var(--font-display)] text-5xl leading-none text-foreground sm:text-6xl lg:text-7xl">
                Find the movie from the line you remember.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted sm:text-xl">
                Query-Quote is a quote-aware movie search system that combines
                lexical retrieval, phrase and proximity matching, fuzzy repair,
                and optional semantic search over a 59K+ transcript corpus.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {heroPills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-border bg-surface-strong px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-cool"
                >
                  {pill}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform duration-300 hover:-translate-y-0.5"
                href="#search-mockup"
              >
                View search mockup
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors duration-300 hover:bg-surface-strong"
                href="#evaluation"
              >
                Review dataset and metrics
              </a>
            </div>

            <div className="grid gap-4 border-t border-border/80 pt-6 text-sm text-muted sm:grid-cols-3">
              <div>
                <p className="font-semibold uppercase tracking-[0.18em] text-accent-cool">
                  Team
                </p>
                <p className="mt-2">Aiden Barnard</p>
                <p>Atharva Patil</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.18em] text-accent-cool">
                  Dataset
                </p>
                <p className="mt-2">Kaggle movie transcripts (59K+)</p>
                <p>Non-commercial research only</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.18em] text-accent-cool">
                  Deliverables
                </p>
                <p className="mt-2">Proposal draft in PROPOSAL.md</p>
                <p>Homepage mockup in the Next.js app</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="grid gap-4 fade-rise-delay">
          <div className="panel rounded-[2rem] p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-cool">
              Example remembered queries
            </p>
            <div className="mt-5 space-y-3 [font-family:var(--font-display)] text-2xl text-foreground sm:text-3xl">
              <p>&quot;may the force b with you&quot;</p>
              <p className="text-foreground/75">
                &quot;frankly my dear i dont give a dam&quot;
              </p>
              <p className="text-foreground/60">&quot;ill be back&quot;</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((stat) => (
              <article key={stat.label} className="panel rounded-[1.75rem] p-6">
                <p className="[font-family:var(--font-display)] text-3xl text-foreground">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent-cool">
                  {stat.label}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted">{stat.note}</p>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
