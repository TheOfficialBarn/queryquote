/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This section wraps the live search workbench and now accepts server-provided regression fixtures plus an optional prefilled query so the dedicated search page can present both an MVP search flow and an evaluation surface.
 */

import { SearchWorkbenchShell } from "@/components/home/SearchWorkbenchShell";
import { SectionIntro } from "@/components/home/SectionIntro";
import type { DemoQueryVariant, SearchTestCase } from "@/types/queryquote";

type SearchMockupProps = {
  initialQuery?: string;
  queries: DemoQueryVariant[];
  testCases?: SearchTestCase[];
};

export function SearchMockup({
  initialQuery,
  queries,
  testCases = [],
}: SearchMockupProps) {
  return (
    <section
      id="search-mockup"
      className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
    >
      <SectionIntro
        eyebrow="Live Search MVP"
        title="The search page now exposes both retrieval results and retrieval reasoning."
        description="This workbench runs against the local 59K+ transcript dataset, then surfaces the same intermediate views an IR evaluator would want to inspect: tokenization, candidate-generation strategies, heuristic score weights, expected test cases, and the raw API payload."
      />
      <SearchWorkbenchShell
        initialQuery={initialQuery}
        sampleQueries={queries}
        testCases={testCases}
      />
    </section>
  );
}
