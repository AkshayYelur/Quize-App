import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.quizHistory.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ items }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      topic,
      difficulty,
      totalQuestions,
      correct,
      wrong,
      scorePercent,
      questions,
    } = body;

    const saved = await prisma.quizHistory.create({
      data: {
        topic,
        difficulty,
        totalQuestions,
        correct,
        wrong,
        scorePercent,
        questions,
      },
    });

    return NextResponse.json({ success: true, id: saved.id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
