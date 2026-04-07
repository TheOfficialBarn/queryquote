/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This route gives the live quote search workbench its own page so users can focus on retrieval without scrolling through unrelated project sections.
 */

import { FooterNote } from "@/components/home/FooterNote";
import { SearchMockup } from "@/components/home/SearchMockup";
import { PageLead } from "@/components/site/PageLead";
import { demoQueries } from "@/data/queryquote-content";

export default function SearchPage() {
  return (
    <main className="relative overflow-x-clip pb-8">
      <PageLead
        eyebrow="Search"
        title="Run quote lookups against the local movie transcript corpus."
        description="This page isolates the retrieval workbench so you can test remembered lines, fuzzy variants, and punctuation-free fragments without the rest of the project homepage competing for space."
      />
      <SearchMockup queries={demoQueries} />
      <FooterNote />
    </main>
  );
}
