// src/app/api/ai/ask/route.ts
//
// RAG pipeline:
// 1. Embed the user's question (Gemini, query mode)
// 2. Cosine-similarity search against College.embedding via pgvector
// 3. Build a context block from the top-K matches
// 4. Generate a grounded answer (Gemini), citing real colleges only

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { embedText, generateAnswer } from "@/lib/gemini";

type MatchedCollege = {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: string | null;
  fees: number;
  rating: number;
  avgPackage: number;
  highestPackage: number;
  description: string;
  exams: string[];
  distance: number;
};

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "A 'question' string is required." },
        { status: 400 }
      );
    }

    // 1. Embed the question.
    const queryVector = await embedText(question, "RETRIEVAL_QUERY");
    const vectorLiteral = `[${queryVector.join(",")}]`;

    // 2. Top-5 nearest colleges by cosine distance.
    // The <=> operator is pgvector's cosine-distance operator.
    const matches = await prisma.$queryRawUnsafe<MatchedCollege[]>(
      `
      SELECT
        id, name, slug, city, state, type, fees, rating,
        "avgPackage", "highestPackage", description, exams,
        embedding <=> $1::vector AS distance
      FROM "College"
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> $1::vector
      LIMIT 5
      `,
      vectorLiteral
    );

    if (matches.length === 0) {
      return NextResponse.json({
        answer:
          "I don't have enough indexed college data yet to answer that. Try again once embeddings have been generated.",
        sources: [],
      });
    }

    // 3. Build context block for the LLM.
    const context = matches
      .map(
        (c) =>
          `- ${c.name} (${c.type ?? "Unknown"}, ${c.city}, ${c.state}): fees ₹${c.fees.toLocaleString(
            "en-IN"
          )}, rating ${c.rating}/5, avg package ₹${c.avgPackage.toLocaleString(
            "en-IN"
          )}, highest package ₹${c.highestPackage.toLocaleString(
            "en-IN"
          )}, exams: ${c.exams.join(", ")}. ${c.description}`
      )
      .join("\n\n");

    // 4. Generate grounded answer.
    const answer = await generateAnswer(question, context);

    return NextResponse.json({
      answer,
      sources: matches.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        city: c.city,
        state: c.state,
      })),
    });
  } catch (err) {
    console.error("RAG query failed:", err);
    return NextResponse.json(
      { error: "Failed to process question." },
      { status: 500 }
    );
  }
}