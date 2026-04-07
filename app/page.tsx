/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This overview page now acts as the landing route inside the multi-page shell, focusing on the project framing while linking users into dedicated search and methods pages.
 */

import { FooterNote } from "@/components/home/FooterNote";
import { HeroSection } from "@/components/home/HeroSection";
import { RouteCards } from "@/components/site/RouteCards";
import { proposalStats } from "@/data/queryquote-content";

export default function Home() {
  return (
    <main className="page-shell pb-8">
      <HeroSection stats={proposalStats} />
      <RouteCards />
      <FooterNote />
    </main>
  );
}
