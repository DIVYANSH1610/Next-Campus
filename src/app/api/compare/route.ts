import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const college1 =
    searchParams.get("college1");

  const college2 =
    searchParams.get("college2");

  if (!college1 || !college2) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Two colleges are required",
      },
      { status: 400 }
    );
  }

  const [first, second] =
    await Promise.all([
      prisma.college.findUnique({
        where: {
          slug: college1,
        },
      }),

      prisma.college.findUnique({
        where: {
          slug: college2,
        },
      }),
    ]);

  return NextResponse.json({
    success: true,
    data: {
      first,
      second,
    },
  });
}