/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-06
 * This section now wraps the live search workbench so the homepage presents a real MVP search flow instead of only static demo cards.
 */

import { SectionIntro } from "@/components/home/SectionIntro";
import { SearchWorkbenchClient } from "@/components/home/SearchWorkbenchClient";
import type { DemoQueryVariant } from "@/types/queryquote";

type SearchMockupProps = {
  queries: DemoQueryVariant[];
};

export function SearchMockup({ queries }: SearchMockupProps) {
  return (
    <section
      id="search-mockup"
      className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
    >
      <SectionIntro
        eyebrow="Live Search MVP"
        title="The homepage can now search the bundled transcript corpus directly."
        description="This search workbench runs against the local 59K+ transcript dataset. It shortlists candidate files on disk, normalizes the quote, and reranks results with ordered-token and fuzzy overlap signals so misquotes still have a chance to recover."
      />
      <SearchWorkbenchClient sampleQueries={queries} />
    </section>
  );
}
