import { ProcessingStage } from '@/lib/api';

interface StatusBadgeProps {
  stage: ProcessingStage;
}

export default function StatusBadge({ stage }: StatusBadgeProps) {
  const getStageConfig = () => {
    switch (stage) {
      case 'queued':
        return {
          label: 'Queued',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
          icon: '⏳',
        };
      case 'normalizing':
        return {
          label: 'Normalizing',
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          icon: '🔄',
        };
      case 'compressing':
        return {
          label: 'Compressing',
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
          icon: '📦',
        };
      case 'analyzing':
        return {
          label: 'Analyzing',
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          icon: '🤖',
        };
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          icon: '✅',
        };
      case 'error':
        return {
          label: 'Error',
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          icon: '❌',
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
          icon: '❓',
        };
    }
  };

  const config = getStageConfig();

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
