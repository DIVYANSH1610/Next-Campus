# NextCampus

A full-stack platform for discovering, comparing, and shortlisting Indian engineering colleges — built with Next.js, PostgreSQL, and a Retrieval-Augmented Generation (RAG) layer powered by Gemini.

## What it does

- **Explore** 28+ real Indian engineering colleges (IITs, NITs, IIITs, and top private/government institutions) with search, state, and type filters
- **Compare** up to 3 colleges side-by-side on fees, ratings, average and highest packages
- **Save** colleges to a personal dashboard (JWT-authenticated)
- **AI College Advisor** — a floating chat widget that answers natural-language questions ("which college has the best ROI under ₹2L fees?") grounded in real college data via vector search, not hallucinated
- **AI Insights** on every college detail page — ROI analysis and similar-college comparisons grounded in real numbers, plus a clearly-labeled "AI-speculated, unverified" section for general category-level inferences about campus life and activities
- **AI Verdict** on the Compare page — synthesizes the real stats of selected colleges into a grounded recommendation

## Tech stack

**Frontend:** Next.js 16 (App Router), React, TypeScript, Tailwind CSS, Framer Motion
**Backend:** Next.js API Routes, Prisma ORM
**Database:** PostgreSQL (Neon), with `pgvector` for embedding-based similarity search
**AI / RAG:** Google Gemini (`gemini-embedding-001` for embeddings, `gemini-flash-latest` for generation)
**Auth:** Manual JWT-based authentication with bcrypt password hashing

## Architecture: the RAG layer

```
User question
   ↓
Embed query (Gemini, 768-dim)
   ↓
Cosine-similarity search via pgvector (inside the same Postgres instance — no separate vector DB)
   ↓
Top-K matching colleges injected as context
   ↓
Gemini generates a grounded answer, citing real colleges only
```

`pgvector` runs directly inside the existing Neon Postgres database rather than a separate vector store (Pinecone, ChromaDB, etc.) — a deliberate infrastructure tradeoff appropriate for a dataset of this size, avoiding unnecessary infra sprawl.

AI-generated content is split into two clearly distinguished categories throughout the app:
- **Grounded** — derived only from real stored numbers (fees, packages, ratings), labeled "Grounded in real data"
- **Speculative** — general, hedged inferences about institution *categories* (not specific unverified claims about a named college), visually separated and explicitly labeled "AI-speculated, unverified"

## Getting started

### Prerequisites
- Node.js 18+
- A PostgreSQL database with the `pgvector` extension available (Neon supports this natively)
- A Gemini API key ([aistudio.google.com](https://aistudio.google.com))

### Setup

1. Clone and install:
   ```bash
   git clone <repo-url>
   cd next-campus
   npm install
   ```

2. Create `.env` (see `.env.example` if present, or the variables below):
   ```
   DATABASE_URL="postgresql://..."
   JWT_SECRET="<generate a strong random secret>"
   GEMINI_API_KEY="..."
   ```

3. Run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. Seed the database:
   ```bash
   npx prisma db seed
   ```

5. Generate embeddings for AI features:
   ```bash
   npx tsx scripts/generate-embeddings.ts
   ```

6. Run the dev server:
   ```bash
   npm run dev
   ```

## Project structure

```
src/
  app/
    api/
      ai/
        ask/[POST]          - RAG chat endpoint
        insights/[slug]     - Cached AI insights per college
        compare/[POST]      - AI comparison verdict
      auth/                 - Login / register
      colleges/             - College listing + detail API
      saved/                - Saved-college endpoints
    colleges/                - Explore + detail pages
    compare/                 - Compare page
    dashboard/               - User dashboard
  components/
    AIAdvisor.tsx            - Floating RAG chat widget
    AIInsights.tsx           - Per-college grounded + speculative insights
    CompareAIVerdict.tsx     - AI comparison summary
    Navbar.tsx
  lib/
    gemini.ts                - Gemini API wrapper (embeddings, generation, retry logic)
    prisma.ts                - Shared Prisma client
prisma/
  schema.prisma
  data/colleges.ts           - Seed data (28 colleges)
  migrations/
scripts/
  generate-embeddings.ts     - One-time/repeatable embedding generation
```

## Known limitations / next steps

- JWT is stored in `localStorage`; moving to httpOnly cookies is the standard hardening step before any real production use
- AI-speculated content (campus life, clubs, fests) is explicitly unverified — real enrichment would require sourced student reviews or verified institutional data
- No automated tests yet
- Not yet deployed to a live URL

## License

Personal/educational project.