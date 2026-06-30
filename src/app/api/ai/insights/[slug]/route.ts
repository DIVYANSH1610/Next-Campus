// src/app/api/ai/insights/[slug]/route.ts
//
// Returns cached AI insights if recent (<30 days), otherwise:
// 1. Fetches the college
// 2. Uses pgvector to retrieve its 3 most similar colleges (RAG)
// 3. Calls Gemini to generate grounded + clearly-labeled-speculative insights
// 4. Caches the result on the College row

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCollegeInsights } from "@/lib/gemini";

const CACHE_DAYS = 30;

type SimilarCollege = {
  name: string;
  fees: number;
  avgPackage: number;
  rating: number;
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const college = await prisma.college.findUnique({ where: { slug } });

  if (!college) {
    return NextResponse.json({ error: "College not found" }, { status: 404 });
  }

  // Serve cache if fresh enough AND matches the current insights shape.
  if (college.aiInsights && college.aiInsightsGeneratedAt) {
    const ageMs = Date.now() - college.aiInsightsGeneratedAt.getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    const cached = JSON.parse(college.aiInsights);
    const hasCurrentShape = cached?.speculative?.technicalClubs !== undefined;

    if (ageDays < CACHE_DAYS && hasCurrentShape) {
      return NextResponse.json({
        insights: cached,
        cached: true,
      });
    }
  }

  // No fresh cache — regenerate via RAG.
  try {
    const similar = await prisma.$queryRawUnsafe<SimilarCollege[]>(
      `
      SELECT name, fees, "avgPackage", rating
      FROM "College"
      WHERE id != $1 AND embedding IS NOT NULL
      ORDER BY embedding <=> (SELECT embedding FROM "College" WHERE id = $1)
      LIMIT 3
      `,
      college.id
    );

    const insights = await generateCollegeInsights(college, similar);

    await prisma.college.update({
      where: { id: college.id },
      data: {
        aiInsights: JSON.stringify(insights),
        aiInsightsGeneratedAt: new Date(),
      },
    });

    return NextResponse.json({ insights, cached: false });
  } catch (err) {
    console.error("Failed to generate insights:", err);

    // Fall back to stale cache if generation fails and we have one.
    if (college.aiInsights) {
      return NextResponse.json({
        insights: JSON.parse(college.aiInsights),
        cached: true,
        stale: true,
      });
    }

    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}