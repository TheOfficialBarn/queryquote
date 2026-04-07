/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This client wrapper mounts the interactive search workbench without server-rendering its markup, which avoids development-time hydration drift while keeping the surrounding page server-rendered, with Tailwind-only loading state styling.
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
      <div className="rounded-[2rem] border border-white/10 bg-neutral-900/85 p-8 text-sm leading-7 text-neutral-400 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl">
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
