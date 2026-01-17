'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/FileUpload';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBanner from '@/components/ErrorBanner';
import { uploadScan } from '@/lib/api';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError(null);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError('Please select at least one file to upload.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await uploadScan(files);
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Small delay to show completion
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Redirect to results page
      router.push(`/results/${response.scanId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to upload files. Please try again.'
      );
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Upload Medical Scans
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Upload MRI or CT scan files for AI-powered analysis and diagnostic
            insights.
          </p>

          {error && (
            <ErrorBanner
              message={error}
              onDismiss={() => setError(null)}
            />
          )}

          <div className="mb-6">
            <FileUpload
              onFilesSelected={handleFilesSelected}
              maxFiles={50}
              maxSizeMB={500}
            />
          </div>

          {isUploading && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <LoadingSpinner size="sm" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Uploading files...
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                setFiles([]);
                setError(null);
                setUploadProgress(0);
              }}
              disabled={isUploading}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleSubmit}
              disabled={isUploading || files.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isUploading ? 'Uploading...' : 'Submit for Analysis'}
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            How it works
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>Upload your MRI or CT scan files (DICOM, NIfTI, or MHD format)</li>
            <li>Files are processed through normalization and compression</li>
            <li>AI analysis generates diagnostic insights and key findings</li>
            <li>View results with confidence scores and compressed previews</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
