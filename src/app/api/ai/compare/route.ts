// src/app/api/ai/compare/route.ts
//
// Takes 2-3 college slugs from the Compare page and returns a grounded
// AI-written verdict synthesizing their real fees/package/rating numbers.
// Not cached (selection combinations are too varied to cache usefully).
// Reuses the same retry-with-backoff Gemini call as the rest of the app.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateComparisonVerdict } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { slugs } = await req.json();

    if (!Array.isArray(slugs) || slugs.length < 2 || slugs.length > 3) {
      return NextResponse.json(
        { error: "Provide 2-3 college slugs to compare." },
        { status: 400 }
      );
    }

    const colleges = await prisma.college.findMany({
      where: { slug: { in: slugs } },
    });

    if (colleges.length < 2) {
      return NextResponse.json(
        { error: "Could not find enough matching colleges." },
        { status: 404 }
      );
    }

    const verdict = await generateComparisonVerdict(colleges);

    return NextResponse.json({ verdict });
  } catch (err) {
    console.error("Compare AI failed:", err);
    return NextResponse.json(
      { error: "Failed to generate comparison. The AI service may be temporarily busy — try again in a moment." },
      { status: 500 }
    );
  }
}