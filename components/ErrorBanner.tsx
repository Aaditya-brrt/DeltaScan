'use client';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export default function ErrorBanner({ message, onRetry, onDismiss }: ErrorBannerProps) {
  return (
    <div
      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4"
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-red-400 text-xl">⚠️</span>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Error
          </h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            {message}
          </p>
          {(onRetry || onDismiss) && (
            <div className="mt-3 flex gap-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-sm font-medium text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100 underline"
                >
                  Retry
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-sm font-medium text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100 underline"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
