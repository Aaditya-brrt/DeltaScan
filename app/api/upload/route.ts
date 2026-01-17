import { NextRequest, NextResponse } from 'next/server';

// Mock upload endpoint
// TODO: Replace with actual backend integration
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');

    // Simulate upload processing delay
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    // Generate a mock scan ID
    const scanId = `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // In a real implementation, files would be uploaded to storage
    // and a processing job would be queued

    return NextResponse.json({
      scanId,
      message: 'Upload successful. Processing started.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Upload failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
