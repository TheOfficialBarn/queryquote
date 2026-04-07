/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This client component provides the rounded site navigation for the multi-page Query-Quote app shell, now expressed entirely with Tailwind utility classes.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    description: "Project framing and quick links",
    href: "/",
    label: "Overview",
  },
  {
    description: "Search the local transcript corpus",
    href: "/search",
    label: "Search",
  },
  {
    description: "Retrieval stack, dataset, and metrics",
    href: "/methods",
    label: "Methods",
  },
  {
    description: "Team, motivation, and scope",
    href: "/about",
    label: "About",
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
      <div className="flex h-full flex-col rounded-[2rem] border border-white/8 bg-black p-4 shadow-[0_18px_48px_rgba(0,0,0,0.34)] sm:p-5">
        <div className="rounded-[1.6rem] border border-white/8 bg-[#111111] px-4 py-4 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/62">
            Query-Quote
          </p>
          <h1 className="mt-3 [font-family:var(--font-fraunces)] text-3xl leading-none text-white">
            Movie quote retrieval workspace
          </h1>
          <p className="mt-3 text-sm leading-7 text-white/70">
            A small project shell for the search MVP, system notes, and proposal-facing pages.
          </p>
        </div>

        <nav
          aria-label="Primary"
          className="mt-4 flex gap-3 overflow-x-auto pb-1 lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:overflow-x-visible"
        >
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`min-w-56 rounded-[1.45rem] border px-4 py-4 transition-all duration-300 lg:min-w-0 ${
                  isActive
                    ? "border-white/12 bg-white text-black shadow-[0_18px_44px_rgba(0,0,0,0.28)]"
                    : "border-white/8 bg-[#171717] text-white hover:bg-[#1f1f1f]"
                }`}
                href={item.href}
              >
                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
                    isActive ? "text-black/60" : "text-white/58"
                  }`}
                >
                  {item.label}
                </p>
                <p
                  className={`mt-2 text-sm leading-6 ${
                    isActive ? "text-black/86" : "text-white/74"
                  }`}
                >
                  {item.description}
                </p>
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 rounded-[1.45rem] border border-white/8 bg-[#141414] px-4 py-4 text-sm leading-7 text-white/68">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/54">
            Local corpus
          </p>
          <p className="mt-2">
            The Kaggle transcript bundle is already included, so the `Search` page can hit the local corpus directly.
          </p>
        </div>
      </div>
    </aside>
  );
}
