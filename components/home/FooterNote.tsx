/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * The footer closes each route by clarifying that the current deliverable is a polished multi-page project shell around the local search MVP rather than a fully shipped retrieval backend, using Tailwind-only neutral styling.
 */

export function FooterNote() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-neutral-900/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Current phase
            </p>
            <p className="max-w-3xl text-sm leading-7 text-neutral-400">
              This site is a polished multi-page project shell for Query-Quote,
              with a live local search MVP plus dedicated methods and about
              pages. The full written draft lives in{" "}
              <code className="rounded bg-neutral-800 px-2 py-1 text-neutral-100">
                PROPOSAL.md
              </code>
              , while the local corpus lives in{" "}
              <code className="rounded bg-neutral-800 px-2 py-1 text-neutral-100">
                movie-transcripts-59k/
              </code>
              .
            </p>
          </div>

          <div className="text-sm leading-7 text-neutral-400 lg:text-right">
            <p className="font-semibold text-neutral-100">Team</p>
            <p>Aiden Barnard</p>
            <p>Atharva Patil</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
