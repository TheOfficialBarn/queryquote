/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This route summarizes the project motivation, team, related-work framing, and immediate deliverables in a dedicated about page.
 */

import { FooterNote } from "@/components/home/FooterNote";
import { PageLead } from "@/components/site/PageLead";

const aboutPanels = [
  {
    body:
      "Query-Quote exists for the common case where someone remembers a line more clearly than the movie title. The project asks whether a quote-oriented retrieval pipeline can recover the right film even when the user misquotes, drops punctuation, or only remembers part of the line.",
    title: "Motivation",
  },
  {
    body:
      "The work is being built by Aiden Barnard and Atharva Patil as an EECS 767 information retrieval project. The current repo already includes the Kaggle transcript corpus, a live local search MVP, and the proposal draft in PROPOSAL.md.",
    title: "Team And Scope",
  },
  {
    body:
      "The project sits on top of standard IR ideas: inverted indexes, lexical ranking with TF-IDF and BM25, positional and phrase matching, fuzzy repair, and optional semantic retrieval as a second-stage extension instead of a baseline replacement.",
    title: "Related Work Framing",
  },
  {
    body:
      "Near-term deliverables are straightforward: stabilize ranking quality on famous quotes, keep the search UI usable, and preserve a proposal-friendly explanation of the dataset, ranking stack, and evaluation metrics.",
    title: "Current Phase",
  },
];

export default function AboutPage() {
  return (
    <main className="page-shell pb-8">
      <PageLead
        eyebrow="About"
        title="Query-Quote is a movie search project built around remembered dialogue."
        description="This page captures the project motivation and the concise literature framing behind the system, without forcing a reader to reverse-engineer the intent from the UI alone."
      />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid gap-4 lg:grid-cols-2">
          {aboutPanels.map((panel) => (
            <article key={panel.title} className="panel rounded-[1.85rem] p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-cool">
                About
              </p>
              <h3 className="mt-3 [font-family:var(--font-display)] text-3xl leading-tight text-foreground">
                {panel.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted">{panel.body}</p>
            </article>
          ))}
        </div>
      </section>

      <FooterNote />
    </main>
  );
}
