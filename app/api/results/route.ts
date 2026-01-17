import { NextRequest, NextResponse } from 'next/server';

// Mock results endpoint
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
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

    // In a real implementation, this would fetch results from the backend
    // Generate mock diagnostic results
    const mockDiagnoses = [
      {
        summary: 'No significant abnormalities detected. Brain structures appear normal with no evidence of mass effect, hemorrhage, or acute infarction. Ventricular system is within normal limits.',
        confidence: 0.92,
        findings: [
          'Normal brain parenchyma',
          'No mass lesions identified',
          'Ventricular system normal',
          'No evidence of acute pathology',
        ],
      },
      {
        summary: 'Mild cerebral atrophy noted with slight prominence of the sulci and ventricles. No acute intracranial abnormality. Small chronic lacunar infarct in the left basal ganglia region.',
        confidence: 0.87,
        findings: [
          'Mild age-related cerebral atrophy',
          'Chronic lacunar infarct in left basal ganglia',
          'No acute hemorrhage or mass effect',
          'Ventricular prominence within normal limits',
        ],
      },
      {
        summary: 'Focal area of increased T2 signal in the periventricular white matter, consistent with demyelinating changes. No mass effect or enhancement. Recommend clinical correlation.',
        confidence: 0.79,
        findings: [
          'Periventricular white matter hyperintensities',
          'Possible demyelinating process',
          'No mass effect',
          'Clinical correlation recommended',
        ],
      },
    ];

    // Use scanId to deterministically select a diagnosis (for consistency)
    const diagnosisIndex = parseInt(scanId.split('-').pop()?.substr(0, 2) || '0', 36) % mockDiagnoses.length;
    const diagnosis = mockDiagnoses[diagnosisIndex];
    const modality: 'MRI' | 'CT' = scanId.charCodeAt(scanId.length - 1) % 2 === 0 ? 'MRI' : 'CT';

    return NextResponse.json({
      scanId,
      diagnosisSummary: diagnosis.summary,
      confidence: diagnosis.confidence,
      keyFindings: diagnosis.findings,
      compressedPreviewUrl: '/mock/compressed-image.png', // Placeholder - in real app, this would be a real image URL
      metadata: {
        modality,
        slicesProcessed: modality === 'MRI' ? 256 : 512,
        compressionRatio: 0.15 + (parseInt(scanId.split('-').pop()?.substr(0, 1) || '5', 36) % 10) / 100,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch results', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
