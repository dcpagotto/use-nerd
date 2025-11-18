/**
 * Global Loading State
 * Displayed while pages are loading
 */

import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cyber-dark-200">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-cyber-300">Carregando...</p>
      </div>
    </div>
  );
}
