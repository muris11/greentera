import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - List all quizzes (admin)
// POST - Create new quiz
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const quizzes = await prisma.educationQuiz.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error('Fetch quizzes error:', error);
    return NextResponse.json(
      { error: 'Database error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { question, options, correctAnswer, category, pointsReward } = body;

    if (!question || !options || correctAnswer === undefined) {
      return NextResponse.json(
        { error: 'Question, options, and correct answer are required' },
        { status: 400 }
      );
    }

    // correctAnswer should be the text of the correct option
    const correctAnswerText = typeof correctAnswer === 'number' 
      ? options[correctAnswer] 
      : correctAnswer;

    const quiz = await prisma.educationQuiz.create({
      data: {
        question,
        options,
        correctAnswer: correctAnswerText,
        category: category || 'Umum',
        pointsReward: pointsReward || 10,
      },
    });

    return NextResponse.json({ quiz }, { status: 201 });
  } catch (error) {
    console.error('Create quiz error:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}
