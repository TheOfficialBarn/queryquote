/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This panel turns tests/tests.csv into an interactive regression browser so the search page can demonstrate curated quote cases, expected answers, and repeatable professor-facing experiments.
 */

import type { SearchTestCase } from "@/types/queryquote";

type RegressionCasesPanelProps = {
  activeQuote: string;
  isLoading: boolean;
  testCases: SearchTestCase[];
  onSelectCase: (quote: string) => void;
};

export function RegressionCasesPanel({
  activeQuote,
  isLoading,
  testCases,
  onSelectCase,
}: RegressionCasesPanelProps) {
  const uniqueMovieCount = new Set(testCases.map((testCase) => testCase.movie)).size;
  const years = testCases.map((testCase) => testCase.year);
  const minYear = years.length ? Math.min(...years) : 0;
  const maxYear = years.length ? Math.max(...years) : 0;

  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-neutral-900/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
            Regression set
          </p>
          <h3 className="mt-2 [font-family:var(--font-fraunces)] text-2xl text-neutral-100">
            tests/tests.csv
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-400">
            These quotes are the curated evaluation cases currently bundled with the repo. Use them to probe franchise ambiguity, parody matches, and whether the engine retrieves the expected film instead of merely a related title.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatPill label="cases" value={String(testCases.length)} />
          <StatPill label="movies" value={String(uniqueMovieCount)} />
          <StatPill
            label="years"
            value={years.length ? `${minYear}-${maxYear}` : "n/a"}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {testCases.map((testCase) => {
          const isActive = activeQuote.trim() === testCase.quote.trim();

          return (
            <button
              key={`${testCase.movie}-${testCase.quote}`}
              className={`rounded-[1.35rem] border p-5 text-left transition-colors duration-300 ${
                isActive
                  ? "border-white/20 bg-white/10"
                  : "border-white/10 bg-neutral-800/70 hover:bg-neutral-800"
              }`}
              disabled={isLoading}
              type="button"
              onClick={() => {
                onSelectCase(testCase.quote);
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Expected film
                </p>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-neutral-400">
                  {testCase.year}
                </span>
              </div>
              <p className="mt-3 text-base font-semibold leading-7 text-neutral-100">
                {testCase.movie}
              </p>
              <p className="mt-4 [font-family:var(--font-ibm-plex-mono)] text-sm leading-7 text-neutral-300">
                {testCase.quote}
              </p>
            </button>
          );
        })}
      </div>
    </article>
  );
}

type StatPillProps = {
  label: string;
  value: string;
};

function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-neutral-800 px-4 py-3 text-right">
      <p className="font-mono text-lg text-neutral-100">{value}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
        {label}
      </p>
    </div>
  );
}
