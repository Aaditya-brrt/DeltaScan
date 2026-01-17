import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ScanAI
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Medical Imaging Dashboard
            </span>
          </Link>
          <nav>
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Upload Scans
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
