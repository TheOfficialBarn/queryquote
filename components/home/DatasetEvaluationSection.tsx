/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This section ties the product presentation back to the actual course project scope by summarizing the dataset, evaluation plan, and planned libraries, now using Tailwind-only neutral card styling.
 */

import { SectionIntro } from "@/components/home/SectionIntro";
import type { EvaluationMetric, ToolGroup } from "@/types/queryquote";

type DatasetEvaluationSectionProps = {
  metrics: EvaluationMetric[];
  tools: ToolGroup[];
};

export function DatasetEvaluationSection({
  metrics,
  tools,
}: DatasetEvaluationSectionProps) {
  return (
    <section
      id="evaluation"
      className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
    >
      <SectionIntro
        eyebrow="Dataset And Evaluation"
        title="The project scope is narrow enough to evaluate carefully and broad enough to compare multiple retrieval strategies."
        description="The homepage intentionally stays honest about the current phase: the backend is still planned, but the corpus, ranking baselines, evaluation metrics, and software stack are already defined."
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-6">
          <article className="rounded-[1.9rem] border border-white/10 bg-neutral-900/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Dataset plan
            </p>
            <h3 className="mt-3 [font-family:var(--font-fraunces)] text-3xl leading-tight text-neutral-100">
              Kaggle transcript corpus, stored locally and treated as a passage retrieval collection.
            </h3>
            <div className="mt-5 space-y-4 text-sm leading-7 text-neutral-400">
              <p>
                The repo already contains the Kaggle
                {" "}
                <a
                  className="font-semibold text-neutral-100 underline underline-offset-4"
                  href="https://www.kaggle.com/datasets/fayaznoor10/movie-transcripts-59k"
                  target="_blank"
                  rel="noreferrer"
                >
                  Massive 59K+ Movie Transcripts Dataset
                </a>
                , which the dataset README describes as a non-commercial research resource sourced from
                {" "}
                <a
                  className="font-semibold text-neutral-100 underline underline-offset-4"
                  href="https://subslikescript.com/movies"
                  target="_blank"
                  rel="noreferrer"
                >
                  subslikescript.com/movies
                </a>
                .
              </p>
              <p>
                Instead of only indexing full transcripts, the plan is to split each movie into smaller searchable passages or scene-like windows so short remembered quotes can compete fairly in ranking.
              </p>
              <p>
                Filename metadata will provide an initial movie title and year layer, with richer structured metadata added later if the project needs it.
              </p>
            </div>
          </article>

          <article className="rounded-[1.9rem] border border-white/10 bg-neutral-900/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Planned libraries
            </p>
            <div className="mt-5 grid gap-5">
              {tools.map((toolGroup) => (
                <div key={toolGroup.category}>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-100">
                    {toolGroup.category}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {toolGroup.items.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full border border-white/10 bg-neutral-800 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-300"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <article className="rounded-[1.9rem] border border-white/10 bg-neutral-900/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
            Evaluation plan
          </p>
          <h3 className="mt-3 [font-family:var(--font-fraunces)] text-3xl leading-tight text-neutral-100">
            Measure whether quote-aware retrieval actually improves how fast users find the right film.
          </h3>

          <div className="mt-6 space-y-4">
            {metrics.map((metric) => (
              <div
                key={metric.name}
                className="rounded-[1.5rem] border border-white/10 bg-neutral-800/80 p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="[font-family:var(--font-fraunces)] text-2xl text-neutral-100">
                    {metric.name}
                  </p>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
                    metric
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-neutral-400">
                  {metric.purpose}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-neutral-800 p-5 text-sm leading-7 text-neutral-400">
            Planned query sets will include exact quotes, punctuation-free versions, typo-heavy misquotes, and partial remembered lines so the comparison reflects how people actually search for dialogue.
          </div>
        </article>
      </div>
    </section>
  );
}
