import { ResultsResponse } from '@/lib/api';
import Image from 'next/image';

interface ResultCardProps {
  results: ResultsResponse;
}

export default function ResultCard({ results }: ResultCardProps) {
  const confidencePercentage = (results.confidence * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Disclaimer:</strong> This AI-generated analysis is for research and
          demonstration purposes only. It is not intended for diagnostic use and should
          not replace professional medical evaluation.
        </p>
      </div>

      {/* Diagnosis Summary */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Diagnostic Summary
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {results.diagnosisSummary}
        </p>
      </div>

      {/* Confidence and Key Findings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Confidence Indicator */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Confidence Score
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${results.confidence * 100}%` }}
                />
              </div>
            </div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {confidencePercentage}%
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Scan Metadata
          </h3>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-400">Modality:</dt>
              <dd className="font-medium text-gray-900 dark:text-gray-100">
                {results.metadata.modality}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-400">Slices Processed:</dt>
              <dd className="font-medium text-gray-900 dark:text-gray-100">
                {results.metadata.slicesProcessed}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-400">Compression Ratio:</dt>
              <dd className="font-medium text-gray-900 dark:text-gray-100">
                {(results.metadata.compressionRatio * 100).toFixed(1)}%
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Key Findings */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Key Findings
        </h3>
        <ul className="space-y-2">
          {results.keyFindings.map((finding, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
            >
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span>{finding}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Compressed Preview */}
      {results.compressedPreviewUrl && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Compressed Preview
          </h3>
          <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
            {results.compressedPreviewUrl === '/mock/compressed-image.png' ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-sm">Preview image placeholder</p>
                <p className="text-xs mt-1">In production, this would display the compressed scan</p>
              </div>
            ) : (
              <Image
                src={results.compressedPreviewUrl}
                alt="Compressed scan preview"
                fill
                className="object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
