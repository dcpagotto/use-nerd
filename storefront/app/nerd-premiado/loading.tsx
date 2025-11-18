/**
 * Nerd Premiado Loading State
 */

import LoadingSpinner from '@/components/LoadingSpinner';

export default function NerdPremiadoLoading() {
  return (
    <div className="min-h-screen bg-cyber-dark-200">
      <section className="relative overflow-hidden bg-gradient-to-b from-cyber-dark-200 via-cyber-dark-100 to-cyber-dark-200 py-20">
        <div className="absolute inset-0 bg-grid-cyber bg-grid-md opacity-20" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="neon-text-purple mb-4 font-display text-heading-1 md:text-display-2">
            Nerd Premiado
          </div>
          <p className="text-gray-cyber-300">Carregando ganhadores...</p>
        </div>
      </section>

      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    </div>
  );
}
