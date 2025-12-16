import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get single quiz
// PUT - Update quiz
// DELETE - Delete quiz
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const quiz = await prisma.educationQuiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error('Get quiz error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { question, options, correctAnswer, category, pointsReward } = body;

    // Convert correctAnswer index to text if needed
    let correctAnswerText = correctAnswer;
    if (typeof correctAnswer === 'number' && options) {
      correctAnswerText = options[correctAnswer];
    }

    const quiz = await prisma.educationQuiz.update({
      where: { id },
      data: {
        ...(question && { question }),
        ...(options && { options }),
        ...(correctAnswerText && { correctAnswer: correctAnswerText }),
        ...(category && { category }),
        ...(pointsReward !== undefined && { pointsReward }),
      },
    });

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error('Update quiz error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.educationQuiz.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Quiz deleted' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
