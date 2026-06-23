import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = verifyToken(token);

    const { collegeId } = await req.json();

    await prisma.savedCollege.deleteMany({
      where: {
        userId: decoded.userId,
        collegeId,
      },
    });

    return NextResponse.json({
      message: "College removed",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to remove college" },
      { status: 500 }
    );
  }
}