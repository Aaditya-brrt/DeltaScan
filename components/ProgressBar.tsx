interface ProgressBarProps {
  progress: number; // 0.0 to 1.0
  label?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({ 
  progress, 
  label, 
  showPercentage = true 
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, progress * 100));

  // Color based on progress level
  const getColorClass = () => {
    if (progress < 0.3) return 'bg-blue-500';
    if (progress < 0.7) return 'bg-blue-600';
    return 'bg-green-500';
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          {showPercentage && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full ${getColorClass()} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {!label && showPercentage && (
        <div className="mt-1 text-right">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
}
