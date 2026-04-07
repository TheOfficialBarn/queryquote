/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * The system overview breaks the planned IR pipeline into distinct retrieval phases so the homepage mirrors the proposal's algorithmic structure, using Tailwind-only card styling.
 */

import { SectionIntro } from "@/components/home/SectionIntro";
import type { RetrievalCapability } from "@/types/queryquote";

type SystemOverviewProps = {
  capabilities: RetrievalCapability[];
};

export function SystemOverview({ capabilities }: SystemOverviewProps) {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <SectionIntro
        eyebrow="System Overview"
        title="The retrieval stack stays grounded in core IR methods before adding smarter quote handling."
        description="Query-Quote starts with explainable lexical retrieval, then layers in passage segmentation, phrase awareness, and typo-tolerant matching. Semantic retrieval is treated as an extension, not a substitute for the baseline."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {capabilities.map((capability, index) => (
          <article key={capability.title} className="rounded-[1.85rem] border border-white/10 bg-neutral-900/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
                  {capability.phase}
                </p>
                <h3 className="mt-3 [font-family:var(--font-fraunces)] text-3xl leading-tight text-neutral-100">
                  {capability.title}
                </h3>
              </div>
              <span className="rounded-full border border-white/10 bg-neutral-800 px-3 py-2 font-mono text-sm text-neutral-100">
                0{index + 1}
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-neutral-400">
              {capability.summary}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {capability.details.map((detail) => (
                <span
                  key={detail}
                  className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-300"
                >
                  {detail}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
