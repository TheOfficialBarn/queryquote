/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * The hero frames Query-Quote as a retrieval product first, while surfacing the course context, team, and the core system signals immediately, now using Tailwind-only shell and card styling.
 */

import Link from "next/link";
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
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900/85 p-8 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-[0.74rem] font-bold uppercase tracking-[0.28em] text-neutral-400">
                EECS 767 Project
              </p>
              <h1 className="[font-family:var(--font-fraunces)] text-5xl leading-none text-neutral-100 sm:text-6xl lg:text-7xl">
                Find the movie from the line you remember.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-neutral-400 sm:text-xl">
                Query-Quote is a quote-aware movie search system that combines
                lexical retrieval, phrase and proximity matching, fuzzy repair,
                and optional semantic search over a 59K+ transcript corpus.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {heroPills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/10 bg-neutral-800 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300"
                >
                  {pill}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_18px_36px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:-translate-y-0.5"
                href="/search"
              >
                View search mockup
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-full border border-white/8 bg-[#242424] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#2d2d2d]"
                href="/methods"
              >
                Review dataset and metrics
              </Link>
            </div>

            <div className="grid gap-4 border-t border-white/10 pt-6 text-sm text-neutral-400 sm:grid-cols-3">
              <div>
                <p className="font-semibold uppercase tracking-[0.18em] text-neutral-300">
                  Team
                </p>
                <p className="mt-2">Aiden Barnard</p>
                <p>Atharva Patil</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.18em] text-neutral-300">
                  Dataset
                </p>
                <p className="mt-2">Kaggle movie transcripts (59K+)</p>
                <p>Non-commercial research only</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.18em] text-neutral-300">
                  Deliverables
                </p>
                <p className="mt-2">Proposal draft in PROPOSAL.md</p>
                <p>Homepage mockup in the Next.js app</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="grid gap-4">
          <div className="rounded-[2rem] border border-white/10 bg-neutral-900/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Example remembered queries
            </p>
            <div className="mt-5 space-y-3 [font-family:var(--font-fraunces)] text-2xl text-neutral-100 sm:text-3xl">
              <p>&quot;may the force b with you&quot;</p>
              <p className="text-neutral-300">
                &quot;frankly my dear i dont give a dam&quot;
              </p>
              <p className="text-neutral-500">&quot;ill be back&quot;</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-[1.75rem] border border-white/10 bg-neutral-900/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <p className="[font-family:var(--font-fraunces)] text-3xl text-neutral-100">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-300">
                  {stat.label}
                </p>
                <p className="mt-3 text-sm leading-7 text-neutral-400">{stat.note}</p>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
