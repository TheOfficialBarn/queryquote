/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This client wrapper mounts the interactive search workbench without server-rendering its markup, which avoids development-time hydration drift while keeping the surrounding page server-rendered.
 */

"use client";

import dynamic from "next/dynamic";
import type { DemoQueryVariant } from "@/types/queryquote";

type SearchWorkbenchShellProps = {
  sampleQueries: DemoQueryVariant[];
};

const SearchWorkbenchClient = dynamic(
  () =>
    import("@/components/home/SearchWorkbenchClient").then(
      (module) => module.SearchWorkbenchClient,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="panel rounded-[2rem] p-8 text-sm leading-7 text-muted">
        Loading the live search workbench...
      </div>
    ),
  },
);

export function SearchWorkbenchShell({
  sampleQueries,
}: SearchWorkbenchShellProps) {
  return <SearchWorkbenchClient sampleQueries={sampleQueries} />;
}
