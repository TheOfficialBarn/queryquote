/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-06
 * This page now presents a real search MVP alongside the proposal content, keeping the live transcript search isolated to the search section while the rest of the page remains server-rendered.
 */

import { DatasetEvaluationSection } from "@/components/home/DatasetEvaluationSection";
import { FooterNote } from "@/components/home/FooterNote";
import { HeroSection } from "@/components/home/HeroSection";
import { SearchMockup } from "@/components/home/SearchMockup";
import { SystemOverview } from "@/components/home/SystemOverview";
import {
  demoQueries,
  evaluationMetrics,
  proposalStats,
  retrievalCapabilities,
  toolGroups,
} from "@/data/queryquote-content";

export default function Home() {
  return (
    <main className="page-shell pb-8">
      <HeroSection stats={proposalStats} />
      <SearchMockup queries={demoQueries} />
      <SystemOverview capabilities={retrievalCapabilities} />
      <DatasetEvaluationSection metrics={evaluationMetrics} tools={toolGroups} />
      <FooterNote />
    </main>
  );
}
