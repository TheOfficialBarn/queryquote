/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * These route cards give the overview page a compact way to advertise the dedicated pages now available in the app shell, using Tailwind-only card styling.
 */

import Link from "next/link";

const routeCards = [
  {
    description: "Run quote lookups against the bundled transcript corpus and inspect ranked snippets.",
    href: "/search",
    label: "Search Page",
  },
  {
    description: "Review the retrieval stack, dataset assumptions, planned tooling, and evaluation metrics.",
    href: "/methods",
    label: "Methods Page",
  },
  {
    description: "Read the project motivation, team context, and the brief related-work framing.",
    href: "/about",
    label: "About Page",
  },
];

export function RouteCards() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="grid gap-4 lg:grid-cols-3">
        {routeCards.map((card) => (
          <Link
            key={card.href}
            className="rounded-[1.8rem] border border-white/10 bg-neutral-900/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
            href={card.href}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Explore
            </p>
            <h3 className="mt-3 [font-family:var(--font-fraunces)] text-3xl leading-tight text-neutral-100">
              {card.label}
            </h3>
            <p className="mt-4 text-sm leading-7 text-neutral-400">{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
