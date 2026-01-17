'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getStatus, getResults, StatusResponse, ResultsResponse } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProgressBar from '@/components/ProgressBar';
import StatusBadge from '@/components/StatusBadge';
import ResultCard from '@/components/ResultCard';
import ErrorBanner from '@/components/ErrorBanner';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const scanId = params.scanId as string;

  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [results, setResults] = useState<ResultsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!scanId) {
      setError('Invalid scan ID');
      setIsLoading(false);
      return;
    }

    let pollInterval: NodeJS.Timeout;
    let isMounted = true;

    const pollStatus = async () => {
      try {
        const statusData = await getStatus(scanId);
        if (!isMounted) return;

        setStatus(statusData);
        setError(null);

        // If completed, fetch results
        if (statusData.stage === 'completed' && !results) {
          try {
            const resultsData = await getResults(scanId);
            if (isMounted) {
              setResults(resultsData);
              setIsLoading(false);
            }
          } catch (err) {
            if (isMounted) {
              setError(
                err instanceof Error
                  ? err.message
                  : 'Failed to fetch results'
              );
              setIsLoading(false);
            }
          }
        }

        // If error, stop polling
        if (statusData.stage === 'error') {
          setIsLoading(false);
          if (pollInterval) {
            clearInterval(pollInterval);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to fetch status'
          );
          setIsLoading(false);
        }
      }
    };

    // Initial status fetch
    pollStatus();

    // Poll every 2-3 seconds while processing
    pollInterval = setInterval(() => {
      if (status?.stage === 'completed' || status?.stage === 'error') {
        clearInterval(pollInterval);
        return;
      }
      pollStatus();
    }, 2500);

    return () => {
      isMounted = false;
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [scanId, results, status?.stage]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setStatus(null);
    setResults(null);
    // Trigger re-fetch by updating a dependency
    window.location.reload();
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium mb-4 inline-flex items-center gap-1"
          >
            ← Back to Upload
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Scan Analysis Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Scan ID: <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{scanId}</code>
          </p>
        </div>

        {error && (
          <ErrorBanner
            message={error}
            onRetry={handleRetry}
          />
        )}

        {isLoading && !status && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <LoadingSpinner size="lg" label="Loading scan status..." />
          </div>
        )}

        {status && status.stage !== 'completed' && status.stage !== 'error' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center gap-6">
              <LoadingSpinner size="lg" />
              <div className="w-full max-w-md">
                <div className="flex justify-center mb-4">
                  <StatusBadge stage={status.stage} />
                </div>
                <ProgressBar
                  progress={status.progress}
                  label="Processing progress"
                  showPercentage={true}
                />
                {status.etaSeconds !== null && (
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                    Estimated time remaining: {formatTime(status.etaSeconds)}
                  </p>
                )}
              </div>
              <div className="text-center text-sm text-gray-500 dark:text-gray-500">
                {status.stage === 'queued' && 'Your scan is queued for processing...'}
                {status.stage === 'normalizing' && 'Normalizing scan data for analysis...'}
                {status.stage === 'compressing' && 'Compressing scan data...'}
                {status.stage === 'analyzing' && 'Running AI analysis on scan data...'}
              </div>
            </div>
          </div>
        )}

        {status && status.stage === 'error' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-center">
              <StatusBadge stage="error" />
              {status.errorMessage && (
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                  {status.errorMessage}
                </p>
              )}
              <button
                onClick={handleRetry}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Retry Processing
              </button>
            </div>
          </div>
        )}

        {results && (
          <div className="mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Analysis Complete
                </h2>
                <StatusBadge stage="completed" />
              </div>
              <ResultCard results={results} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
