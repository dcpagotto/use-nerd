/**
 * Dynamic Page Loading State
 */

import LoadingSpinner from '@/components/LoadingSpinner';

export default function DynamicPageLoading() {
  return (
    <div className="min-h-screen bg-cyber-dark-200 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 h-12 w-3/4 animate-pulse rounded bg-gray-cyber-700" />
          </div>

          <div className="card-cyber-glow p-8 md:p-12">
            <div className="space-y-4">
              <div className="h-4 w-full animate-pulse rounded bg-gray-cyber-700" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-cyber-700" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-gray-cyber-700" />
            </div>

            <div className="mt-8 flex justify-center">
              <LoadingSpinner />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
