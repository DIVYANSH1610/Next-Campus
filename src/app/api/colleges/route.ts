import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || "";
  const state = searchParams.get("state") || "";
  const type = searchParams.get("type") || "";

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 9;

  const skip = (page - 1) * limit;

  const whereClause: any = {
    ...(search && {
      name: {
        contains: search,
        mode: "insensitive",
      },
    }),

    ...(state && {
      state: {
        contains: state,
        mode: "insensitive",
      },
    }),

    ...(type && {
      type: {
        equals: type,
        mode: "insensitive",
      },
    }),
  };

  const [list, total] = await Promise.all([
    prisma.college.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        rating: "desc",
      },
    }),

    prisma.college.count({
      where: whereClause,
    }),
  ]);

  return NextResponse.json({
    success: true,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    count: list.length,
    data: list,
  });
}