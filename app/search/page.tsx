/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This route now loads the curated CSV regression set and optional query-string state so the dedicated search page can function as both a live demo and an evaluation console for the retrieval pipeline.
 */

import { FooterNote } from "@/components/home/FooterNote";
import { SearchMockup } from "@/components/home/SearchMockup";
import { PageLead } from "@/components/site/PageLead";
import { demoQueries } from "@/data/queryquote-content";
import { loadSearchTests } from "@/lib/tests/load-search-tests";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string | string[] | undefined;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const [{ q }, searchTests] = await Promise.all([searchParams, loadSearchTests()]);
  const initialQuery = Array.isArray(q) ? q[0] : q;

  return (
    <main className="relative overflow-x-clip pb-8">
      <PageLead
        eyebrow="Search"
        title="Run quote lookups against the local movie transcript corpus and inspect the pipeline."
        description="This page isolates the retrieval workbench so you can test remembered lines, fuzzy variants, and punctuation-free fragments while also inspecting tokenization, candidate-generation passes, ranking heuristics, the raw API payload, and the curated regression cases loaded from tests/tests.csv."
      />
      <SearchMockup
        initialQuery={initialQuery}
        queries={demoQueries}
        testCases={searchTests}
      />
      <FooterNote />
    </main>
  );
}
