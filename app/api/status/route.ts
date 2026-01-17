import { NextRequest, NextResponse } from 'next/server';

// Mock status endpoint
// TODO: Replace with actual backend integration
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const scanId = searchParams.get('scanId');

    if (!scanId) {
      return NextResponse.json(
        { error: 'scanId parameter is required' },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 200));

    // In a real implementation, this would query the backend job status
    // For now, we'll use a simple time-based progression
    // This matches the logic in lib/api.ts for consistency

    // Generate mock status based on scanId and time
    // For demo purposes, we'll use a hash of the scanId to determine start time
    const hash = scanId.split('-').pop() || '';
    const baseTime = parseInt(hash, 36) % 10000; // Use part of ID as seed
    const elapsed = (Date.now() - baseTime) % 60000; // Modulo to keep it reasonable

    let stage: 'queued' | 'normalizing' | 'compressing' | 'analyzing' | 'completed' | 'error';
    let progress: number;
    let etaSeconds: number | null;

    if (scanId.includes('error')) {
      stage = 'error';
      progress = 0.5;
      etaSeconds = null;
    } else if (elapsed < 5000) {
      stage = 'queued';
      progress = 0.05;
      etaSeconds = Math.ceil((60000 - elapsed) / 1000);
    } else if (elapsed < 15000) {
      stage = 'normalizing';
      progress = 0.05 + ((elapsed - 5000) / 10000) * 0.25;
      etaSeconds = Math.ceil((60000 - elapsed) / 1000);
    } else if (elapsed < 35000) {
      stage = 'compressing';
      progress = 0.3 + ((elapsed - 15000) / 20000) * 0.3;
      etaSeconds = Math.ceil((60000 - elapsed) / 1000);
    } else if (elapsed < 55000) {
      stage = 'analyzing';
      progress = 0.6 + ((elapsed - 35000) / 20000) * 0.35;
      etaSeconds = Math.ceil((60000 - elapsed) / 1000);
    } else {
      stage = 'completed';
      progress = 1.0;
      etaSeconds = null;
    }

    return NextResponse.json({
      scanId,
      stage,
      progress: Math.min(progress, 1.0),
      etaSeconds,
      errorMessage: stage === 'error' ? 'Processing failed: Unable to analyze scan data.' : null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch status', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
