/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-06
 * The root layout now sets project-specific metadata and a more intentional type system for the Query-Quote presentation site.
 */

import type { Metadata } from "next";
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
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
