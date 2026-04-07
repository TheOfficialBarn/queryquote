/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-06
 * This page replaces the starter template with a componentized Query-Quote landing page that mirrors the proposal's IR scope without pretending the backend exists yet.
 */

import { DatasetEvaluationSection } from "@/components/home/DatasetEvaluationSection";
import { FooterNote } from "@/components/home/FooterNote";
import { HeroSection } from "@/components/home/HeroSection";
import { SearchMockup } from "@/components/home/SearchMockup";
import { SystemOverview } from "@/components/home/SystemOverview";
import {
  demoQueries,
  demoResults,
  evaluationMetrics,
  proposalStats,
  retrievalCapabilities,
  toolGroups,
} from "@/data/queryquote-content";

export default function Home() {
  return (
    <main className="page-shell pb-8">
      <HeroSection stats={proposalStats} />
      <SearchMockup queries={demoQueries} results={demoResults} />
      <SystemOverview capabilities={retrievalCapabilities} />
      <DatasetEvaluationSection metrics={evaluationMetrics} tools={toolGroups} />
      <FooterNote />
    </main>
  );
}
