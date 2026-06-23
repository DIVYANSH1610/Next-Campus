import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { exam, rank } = await req.json();

    if (!exam || !rank) {
      return NextResponse.json(
        { error: "Exam and rank required" },
        { status: 400 }
      );
    }

    // Fetch colleges that accept this exam
    const colleges = await prisma.college.findMany({
      where: {
        exams: {
          has: exam,
        },
      },
    });

    // Simple scoring logic (you can upgrade later)
    const filtered = colleges.filter((college) => {
      const cutoffScore = college.avgPackage * 1000; // fake logic baseline
      return rank < cutoffScore;
    });

    return NextResponse.json({
      total: filtered.length,
      colleges: filtered,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Prediction failed" },
      { status: 500 }
    );
  }
}