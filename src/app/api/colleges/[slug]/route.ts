import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const college = await prisma.college.findUnique({
    where: {
      slug,
    },
    include: {
      courses: true,
      reviews: true,
    },
  });

  if (!college) {
    return NextResponse.json(
      {
        success: false,
        message: "College not found",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({
    success: true,
    data: college,
  });
}