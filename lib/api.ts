// API Client for MRI/CT Scan Dashboard
// TODO: Replace with actual backend URL when backend is implemented
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Type definitions for API responses
export interface UploadResponse {
  scanId: string;
  message: string;
}

export type ProcessingStage = 
  | 'queued' 
  | 'normalizing' 
  | 'compressing' 
  | 'analyzing' 
  | 'completed' 
  | 'error';

export interface StatusResponse {
  scanId: string;
  stage: ProcessingStage;
  progress: number; // 0.0 to 1.0
  etaSeconds: number | null;
  errorMessage: string | null;
}

export interface ResultsResponse {
  scanId: string;
  diagnosisSummary: string;
  confidence: number; // 0.0 to 1.0
  keyFindings: string[];
  compressedPreviewUrl: string;
  metadata: {
    modality: 'MRI' | 'CT';
    slicesProcessed: number;
    compressionRatio: number;
  };
}

// In-memory state to track mock scan processing
const mockScanStates: Map<string, {
  startTime: number;
  stage: ProcessingStage;
  progress: number;
}> = new Map();

// Helper to generate random UUID
function generateScanId(): string {
  return `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to calculate mock progress based on elapsed time
function calculateMockProgress(scanId: string): { stage: ProcessingStage; progress: number } {
  const state = mockScanStates.get(scanId);
  if (!state) {
    return { stage: 'queued', progress: 0 };
  }

  const elapsed = (Date.now() - state.startTime) / 1000; // seconds
  const totalDuration = 60; // 60 seconds total processing time

  if (elapsed < 5) {
    return { stage: 'queued', progress: 0.05 };
  } else if (elapsed < 15) {
    const progress = 0.05 + ((elapsed - 5) / 10) * 0.25;
    return { stage: 'normalizing', progress: Math.min(progress, 0.3) };
  } else if (elapsed < 35) {
    const progress = 0.3 + ((elapsed - 15) / 20) * 0.3;
    return { stage: 'compressing', progress: Math.min(progress, 0.6) };
  } else if (elapsed < 55) {
    const progress = 0.6 + ((elapsed - 35) / 20) * 0.35;
    return { stage: 'analyzing', progress: Math.min(progress, 0.95) };
  } else {
    return { stage: 'completed', progress: 1.0 };
  }
}

/**
 * Upload scan files to the backend
 * @param files - FileList or File[] to upload
 * @returns Promise with scanId and message
 */
export async function uploadScan(files: FileList | File[]): Promise<UploadResponse> {
  // TODO: Replace with actual API call
  // const formData = new FormData();
  // Array.from(files).forEach((file) => {
  //   formData.append('files', file);
  // });
  // const response = await fetch(`${API_BASE_URL}/api/upload`, {
  //   method: 'POST',
  //   body: formData,
  // });
  // if (!response.ok) throw new Error('Upload failed');
  // return response.json();

  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const scanId = generateScanId();
      mockScanStates.set(scanId, {
        startTime: Date.now(),
        stage: 'queued',
        progress: 0,
      });
      resolve({
        scanId,
        message: 'Upload successful. Processing started.',
      });
    }, 800);
  });
}

/**
 * Get the current processing status for a scan
 * @param scanId - The scan ID to check status for
 * @returns Promise with current status
 */
export async function getStatus(scanId: string): Promise<StatusResponse> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/api/status?scanId=${scanId}`);
  // if (!response.ok) throw new Error('Failed to fetch status');
  // return response.json();

  // Mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const state = mockScanStates.get(scanId);
      if (!state) {
        reject(new Error('Scan not found'));
        return;
      }

      // Simulate error for specific scan IDs (for testing)
      if (scanId.includes('error')) {
        resolve({
          scanId,
          stage: 'error',
          progress: 0.5,
          etaSeconds: null,
          errorMessage: 'Processing failed: Unable to analyze scan data.',
        });
        return;
      }

      const { stage, progress } = calculateMockProgress(scanId);
      const remaining = Math.max(0, 60 - (Date.now() - state.startTime) / 1000);

      // Update stored state
      state.stage = stage;
      state.progress = progress;

      resolve({
        scanId,
        stage,
        progress,
        etaSeconds: stage === 'completed' ? null : Math.ceil(remaining),
        errorMessage: null,
      });
    }, 300);
  });
}

/**
 * Get the final results for a completed scan
 * @param scanId - The scan ID to get results for
 * @returns Promise with diagnostic results
 */
export async function getResults(scanId: string): Promise<ResultsResponse> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/api/results?scanId=${scanId}`);
  // if (!response.ok) throw new Error('Failed to fetch results');
  // return response.json();

  // Mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const state = mockScanStates.get(scanId);
      if (!state) {
        reject(new Error('Scan not found'));
        return;
      }

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

      const diagnosis = mockDiagnoses[Math.floor(Math.random() * mockDiagnoses.length)];
      const modality: 'MRI' | 'CT' = Math.random() > 0.5 ? 'MRI' : 'CT';

      resolve({
        scanId,
        diagnosisSummary: diagnosis.summary,
        confidence: diagnosis.confidence,
        keyFindings: diagnosis.findings,
        compressedPreviewUrl: '/mock/compressed-image.png', // Placeholder image
        metadata: {
          modality,
          slicesProcessed: modality === 'MRI' ? 256 : 512,
          compressionRatio: 0.15 + Math.random() * 0.1, // 15-25% compression
        },
      });
    }, 500);
  });
}
