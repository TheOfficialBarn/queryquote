/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * The root layout now wraps the site in a shared multi-page shell with a rounded sidebar so search, methods, and about content can live on dedicated routes, while explicitly setting the document shell with fixed hex background colors.
 */

import type { Metadata } from "next";
import { SidebarNav } from "@/components/site/SidebarNav";
import { Fraunces, IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const displayFont = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Query-Quote",
  description:
    "Query-Quote is a movie transcript retrieval project focused on finding films from memorable dialogue, misquotes, and punctuation-free queries.",
  applicationName: "Query-Quote",
  keywords: [
    "information retrieval",
    "movie transcripts",
    "BM25",
    "TF-IDF",
    "semantic search",
    "quote retrieval",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} h-full bg-[#111111] antialiased`}
    >
      <body className="min-h-full bg-[#111111] text-foreground">
        <div className="mx-auto min-h-screen max-w-400 px-3 py-3 sm:px-4 lg:px-5">
          <div className="grid min-h-[calc(100vh-1.5rem)] gap-4 lg:grid-cols-[18.5rem_minmax(0,1fr)]">
            <SidebarNav />
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
