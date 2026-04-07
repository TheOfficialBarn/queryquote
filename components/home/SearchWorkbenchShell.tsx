/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This client wrapper mounts the interactive search workbench without server-rendering its markup, which avoids development-time hydration drift while keeping the surrounding page server-rendered, and now forwards server-loaded regression cases and initial query state into the client console.
 */

"use client";

import dynamic from "next/dynamic";
import type { DemoQueryVariant, SearchTestCase } from "@/types/queryquote";

type SearchWorkbenchShellProps = {
  initialQuery?: string;
  sampleQueries: DemoQueryVariant[];
  testCases?: SearchTestCase[];
};

const SearchWorkbenchClient = dynamic(
  () =>
    import("@/components/home/SearchWorkbenchClient").then(
      (module) => module.SearchWorkbenchClient,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-[2rem] border border-white/10 bg-neutral-900/85 p-8 text-sm leading-7 text-neutral-400 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        Loading the live search workbench...
      </div>
    ),
  },
);

export function SearchWorkbenchShell({
  initialQuery,
  sampleQueries,
  testCases = [],
}: SearchWorkbenchShellProps) {
  return (
    <SearchWorkbenchClient
      initialQuery={initialQuery}
      sampleQueries={sampleQueries}
      testCases={testCases}
    />
  );
}
