<!--
PROLOGUE COMMENT
Last updated: 2026-04-06
This draft turns the project brief into a submission-ready proposal and stays aligned with the presentation-focused homepage mockup in the Next.js app.
-->

# Query-Quote

**Team Members:** Aiden Barnard, Atharva Patil

## 1. Motivation and Background

Many movie lines are more memorable than the titles of the films they come from. A user may remember a short quote, an incomplete line, or a slightly incorrect version of a scene and still want to identify the original movie. That creates a practical information retrieval problem: the query is short, noisy, and often imprecise, while the relevant evidence is buried somewhere inside a long transcript.

Query-Quote is a movie-transcript retrieval system designed to help users search for films by the lines they remember. The system is worth building because it combines a clear real-world use case with a strong course connection to indexing, ranking, passage retrieval, approximate matching, and retrieval evaluation. In addition to finding the source movie, the project can help compare which retrieval methods work best when the query is punctuation-free, misspelled, or semantically similar rather than exact.

### Brief Related Work

This project builds on several well-established strands of information retrieval. Classic lexical retrieval models such as TF-IDF cosine similarity and BM25 remain strong baselines for ranking text documents and passages. Quote lookup also benefits from phrase-aware and positional retrieval because remembered lines often depend on local word order and nearby term proximity, not just bag-of-words overlap. Approximate string matching methods help recover results when a user misquotes a line or misspells a word. More recent semantic retrieval methods based on sentence embeddings can support paraphrase-style search when exact lexical overlap is weak. Query-Quote combines these ideas in a single movie-search setting with an emphasis on quote discovery.

## 2. Data Collection Plan

We plan to adopt an existing dataset rather than crawl a new one.

- **Dataset:** [Massive 59K+ Movie Transcripts Dataset](https://www.kaggle.com/datasets/fayaznoor10/movie-transcripts-59k)
- **Local copy in this repo:** `movie-transcripts-59k/`
- **Observed local size:** about 59,727 transcript files and roughly 2.4 GB
- **Original source listed by the dataset:** [subslikescript.com/movies](https://subslikescript.com/movies)
- **License note from the bundled dataset README:** custom, non-commercial research only

We will preprocess the transcript files into searchable units and metadata records. At minimum, we expect to parse movie title and year from filenames and then segment each transcript into passages or quote-sized windows so retrieval can happen below the full-document level. This passage-first design should make it easier to support quote search, phrase matching, and local context scoring.

## 3. Proposed System and Algorithms

### Core Retrieval

The first-stage retrieval system will use a classical inverted index over transcript text, where terms map to postings lists of documents or passage segments. We plan to implement and compare at least two lexical ranking baselines:

- TF-IDF vector space retrieval with cosine similarity
- BM25 ranking

These methods will provide a strong baseline and make it possible to compare score quality, ranking quality, and runtime tradeoffs.

### Passage-Level Indexing

Instead of indexing only full transcripts, we expect to index smaller searchable units such as passages, scenes, or utterance-like segments. Passage-level indexing should improve quote retrieval because memorable lines are usually local and do not require the full movie transcript to rank well.

### Quote-Specific Matching

To better support remembered dialogue, we plan to add quote-aware retrieval features:

- Phrase search through a positional index
- Proximity scoring so near-matches can still rank highly
- Punctuation-agnostic normalization to reduce failures caused by formatting differences
- Fuzzy matching for misspellings and misquotes

This part of the system is especially important because user input is likely to be noisy. For example, someone may omit punctuation, collapse words, or remember only part of a line.

### Optional Semantic Search

As an extension, we plan to add semantic retrieval with sentence embeddings. This would allow the system to surface relevant passages when the user remembers the meaning of a quote but not the exact wording. We currently view this as a second-stage or optional component rather than the only retrieval method.

## 4. Evaluation Plan

We will evaluate the retrieval system using standard ranked-retrieval metrics:

- MAP
- MRR
- nDCG@K
- Precision and recall style analysis

We plan to compare lexical baselines, phrase/proximity-aware retrieval, fuzzy matching, and any hybrid or semantic variants that are implemented. Evaluation queries will likely include exact quotes, lightly corrupted quotes, and intentionally noisy or incomplete quote fragments so we can measure how retrieval quality changes under realistic user behavior.

## 5. External Libraries, Frameworks, and Tools

### Python and Retrieval Stack

- **Pandas:** data loading and preprocessing
- **Pydantic:** structured models such as `Quote`, `Movie`, and `Character`
- **FastAPI:** backend API layer
- **NLTK:** stop-word removal and basic text preprocessing
- **Sentence-Transformers:** semantic search embeddings
- **Pyserini:** BM25 and inverted-index utilities
- **pytrec_eval:** ranked-retrieval evaluation
- **FAISS (optional):** efficient vector search if semantic indexing grows large
- **RapidFuzz:** fuzzy matching for misquotes and misspellings

### Frontend

- **Next.js:** web frontend
- **TypeScript / HTML / Tailwind CSS:** interactive UI and presentation layer

### Database

- **PostgreSQL:** metadata storage and query support for structured movie information

## 6. Expected Outcome

The main deliverable is an IR system that can retrieve likely movies from short remembered lines of dialogue. At a minimum, we want to understand how well classical lexical retrieval performs on movie transcripts and how much quote-aware enhancements improve the results. If time permits, we also want to explore semantic retrieval and an AI-style summary layer that explains why a result was returned.
