import { auth } from '@/lib/auth';
import { analyzeWasteImage } from '@/lib/gemini';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const scanSchema = z.object({
  image: z.string().min(1, 'Image is required'),
});

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
    const validation = scanSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { image } = validation.data;

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not configured, using mock data');
      return NextResponse.json({
        wasteType: 'PLASTIC',
        confidence: 85,
        estimatedWeight: 0.5,
        description: 'Mock result: Plastic detected (API key not configured)',
        isMock: true,
      });
    }

    console.log('Processing waste scan request...');
    console.log('Image base64 length:', image.length);

    // Analyze image with Gemini AI
    const result = await analyzeWasteImage(image);

    console.log('Scan result:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Scan error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Gagal menganalisis gambar', 
        details: errorMessage,
        // Fallback result so user can still submit
        wasteType: 'ORGANIC',
        confidence: 30,
        estimatedWeight: 0.5,
        description: `Error: ${errorMessage}. Defaulting to organic.`,
        isFallback: true,
      },
      { status: 200 } // Return 200 so frontend can still use the fallback
    );
  }
}
