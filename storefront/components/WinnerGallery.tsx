/**
 * Winner Gallery Component
 * Displays raffle winners with blockchain verification
 */

import Image from 'next/image';
import { getStrapiMediaUrl, formatStrapiDate } from '@/lib/strapi-utils';
import type { EnrichedWinnerAnnouncement } from '@/lib/data-fetcher';

interface WinnerGalleryProps {
  winners: EnrichedWinnerAnnouncement[];
}

export default function WinnerGallery({ winners }: WinnerGalleryProps) {
  if (winners.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Nenhum ganhador anunciado ainda.</p>
      </div>
    );
  }

  const featuredWinners = winners.filter((w) => w.featured);
  const allWinners = winners.filter((w) => !w.featured);

  return (
    <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-cyber-dark via-cyber-dark-100 to-cyber-dark">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-5xl font-display font-black uppercase tracking-wider mb-4 text-gradient-neon">
          Ganhadores
        </h2>
        <div className="h-1 w-32 mx-auto bg-gradient-cyber rounded-full shadow-neon-purple-sm" />
      </div>

      {/* Featured Winners */}
      {featuredWinners.length > 0 && (
        <div className="mb-16">
          <h3 className="text-2xl font-display font-bold mb-8 neon-text-purple uppercase tracking-wider border-l-4 border-neon-purple pl-4 shadow-neon-purple-sm">
            Destaques
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {featuredWinners.map((winner) => (
              <WinnerCard key={winner.id} winner={winner} featured />
            ))}
          </div>
        </div>
      )}

      {/* All Winners Grid */}
      {allWinners.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {allWinners.map((winner) => (
            <WinnerCard key={winner.id} winner={winner} />
          ))}
        </div>
      )}
    </section>
  );
}

interface WinnerCardProps {
  winner: EnrichedWinnerAnnouncement;
  featured?: boolean;
}

function WinnerCard({ winner, featured = false }: WinnerCardProps) {
  const photoUrl = getStrapiMediaUrl(winner.photo);

  return (
    <div
      className={`group relative overflow-hidden rounded-cyber-lg bg-cyber-dark-100 border-2 border-neon-purple/30 shadow-cyber transition-all duration-300 hover:border-neon-purple hover:shadow-neon-purple hover:-translate-y-1 ${
        featured ? 'md:col-span-1' : ''
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-cyber text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-neon-yellow to-neon-yellow/80 text-cyber-dark shadow-lg animate-glow-pulse">
          Destaque
        </div>
      )}

      {/* Winner Photo */}
      <div className="relative aspect-square overflow-hidden bg-gradient-cyber">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={winner.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 640px) 100vw, 25vw'}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-8xl animate-float">🎉</span>
          </div>
        )}

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark-100 via-transparent to-transparent" />

        {/* Verification Badge */}
        {winner.verificationStatus === 'verified' && (
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-cyber bg-neon-green px-3 py-1.5 text-xs font-bold text-cyber-dark shadow-neon-green backdrop-blur-sm">
            <svg
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="uppercase tracking-wider">Verificado</span>
          </div>
        )}
      </div>

      {/* Winner Info */}
      <div className="p-6">
        <h4 className="mb-2 text-xl font-bold text-white group-hover:text-gradient-cyber transition-all">{winner.name}</h4>

        <p className="mb-2 text-sm font-semibold neon-text-purple">{winner.raffleTitle}</p>

        <p className="mb-4 text-sm text-gray-cyber-300">{winner.prizeDescription}</p>

        {/* Location */}
        {(winner.city || winner.state) && (
          <p className="mb-3 text-xs text-gray-cyber-400 font-mono">
            {winner.city}
            {winner.city && winner.state && ', '}
            {winner.state}
          </p>
        )}

        {/* Testimonial */}
        {winner.testimonial && (
          <blockquote className="relative mb-4 pl-4 italic text-gray-cyber-200 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-cyber before:rounded-full">
            &ldquo;{winner.testimonial}&rdquo;
          </blockquote>
        )}

        {/* Date and Blockchain Verification */}
        <div className="flex items-center justify-between border-t border-neon-purple/20 pt-4">
          <span className="text-sm text-gray-cyber-400 font-mono">{formatStrapiDate(winner.winDate)}</span>

          {winner.verificationStatus === 'verified' && winner.blockchainLink && (
            <a
              href={winner.blockchainLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center gap-1 text-sm font-semibold text-neon-green hover:text-neon-green/80 transition-colors focus-cyber rounded-cyber"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <span className="text-xs uppercase tracking-wider group-hover/link:underline">
                Blockchain
              </span>
            </a>
          )}

          {winner.verificationStatus === 'pending' && (
            <span className="text-xs text-neon-yellow font-bold">⏳ Pendente</span>
          )}
        </div>
      </div>

      {/* Decorative neon border */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-cyber shadow-neon-purple-sm" />

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-neon-purple/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
