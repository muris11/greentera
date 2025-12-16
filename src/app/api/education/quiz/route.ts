import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// GET - Get random quizzes
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    // Get quizzes user hasn't attempted
    const attemptedQuizIds = await prisma.quizAttempt.findMany({
      where: { userId: session.user.id },
      select: { quizId: true },
    });

    const quizzes = await prisma.educationQuiz.findMany({
      where: {
        id: { notIn: attemptedQuizIds.map((a) => a.quizId) },
      },
      take: limit,
      select: {
        id: true,
        question: true,
        options: true,
        pointsReward: true,
        category: true,
      },
    });

    // Shuffle quizzes
    const shuffled = quizzes.sort(() => Math.random() - 0.5);

    return NextResponse.json({
      quizzes: shuffled,
      totalAvailable: shuffled.length,
    });
  } catch (error) {
    console.error('Quiz error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

const submitSchema = z.object({
  quizId: z.string(),
  answer: z.string(),
});

// POST - Submit quiz answer
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = submitSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { quizId, answer } = validation.data;

    // Check if already attempted
    const existingAttempt = await prisma.quizAttempt.findUnique({
      where: {
        userId_quizId: {
          userId: session.user.id,
          quizId,
        },
      },
    });

    if (existingAttempt) {
      return NextResponse.json(
        { error: 'Anda sudah mengerjakan kuis ini' },
        { status: 400 }
      );
    }

    // Get quiz
    const quiz = await prisma.educationQuiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Kuis tidak ditemukan' },
        { status: 404 }
      );
    }

    const isCorrect = answer === quiz.correctAnswer;

    // Create attempt and update points if correct
    await prisma.$transaction([
      prisma.quizAttempt.create({
        data: {
          userId: session.user.id,
          quizId,
          isCorrect,
        },
      }),
      ...(isCorrect
        ? [
            prisma.user.update({
              where: { id: session.user.id },
              data: {
                points: { increment: quiz.pointsReward },
              },
            }),
          ]
        : []),
    ]);

    return NextResponse.json({
      isCorrect,
      correctAnswer: quiz.correctAnswer,
      pointsEarned: isCorrect ? quiz.pointsReward : 0,
      message: isCorrect
        ? `Benar! Anda mendapat +${quiz.pointsReward} poin`
        : `Salah. Jawaban yang benar: ${quiz.correctAnswer}`,
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
