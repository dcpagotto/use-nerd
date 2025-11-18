/**
 * Blog Loading State
 */

import LoadingSpinner from '@/components/LoadingSpinner';

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-cyber-dark-200 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="neon-text-purple mb-4 font-display text-heading-1">
            Blog & Notícias
          </div>
          <p className="text-gray-cyber-300 text-lg">Carregando posts...</p>
        </div>

        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      </div>
    </div>
  );
}
