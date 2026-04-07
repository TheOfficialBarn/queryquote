/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This route groups the retrieval approach, dataset plan, and evaluation notes into a dedicated methods page for the project shell.
 */

import { DatasetEvaluationSection } from "@/components/home/DatasetEvaluationSection";
import { FooterNote } from "@/components/home/FooterNote";
import { SystemOverview } from "@/components/home/SystemOverview";
import { PageLead } from "@/components/site/PageLead";
import {
  evaluationMetrics,
  retrievalCapabilities,
  toolGroups,
} from "@/data/queryquote-content";

export default function MethodsPage() {
  return (
    <main className="page-shell pb-8">
      <PageLead
        eyebrow="Methods"
        title="The system is organized around classical IR baselines before smarter quote repair."
        description="This page collects the retrieval architecture, the passage-indexing direction, the local corpus assumptions, and the evaluation plan in one place so the technical approach can be reviewed without the search UI getting in the way."
      />
      <SystemOverview capabilities={retrievalCapabilities} />
      <DatasetEvaluationSection metrics={evaluationMetrics} tools={toolGroups} />
      <FooterNote />
    </main>
  );
}
