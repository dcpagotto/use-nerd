import Link from 'next/link';
import Image from 'next/image';
import { Raffle } from '@/types';
import { formatPrice, formatDate, percentage, getImageUrl } from '@/lib/utils';

/**
 * RaffleCard Component
 *
 * Reusable card component for displaying raffle information in lists and grids.
 * Features cyberpunk styling with neon borders and glow effects.
 *
 * @param raffle - Raffle data to display
 */

interface RaffleCardProps {
  raffle: Raffle;
}

// Status badge configuration
const statusConfig = {
  draft: {
    label: 'Rascunho',
    className: 'bg-gray-cyber-700 text-gray-cyber-300',
  },
  active: {
    label: 'Ativo',
    className: 'bg-neon-green/20 text-neon-green border border-neon-green/50',
  },
  closed: {
    label: 'Encerrado',
    className: 'bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/50',
  },
  drawn: {
    label: 'Sorteado',
    className: 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-neon-red/20 text-neon-red border border-neon-red/50',
  },
};

export default function RaffleCard({ raffle }: RaffleCardProps) {
  const progressPercentage = percentage(raffle.sold_tickets, raffle.total_tickets);
  const status = statusConfig[raffle.status] || statusConfig.draft;
  const imageUrl = raffle.image ? getImageUrl(raffle.image) : '/images/raffle-placeholder.png';

  return (
    <Link
      href={`/raffle/${raffle.id}`}
      className="group block bg-cyber-dark-50 rounded-cyber-lg border border-neon-purple/20 overflow-hidden transition-all duration-300 hover:border-neon-purple hover:shadow-neon-purple-sm"
    >
      {/* Image */}
      <div className="relative w-full aspect-video overflow-hidden bg-cyber-dark-100">
        <Image
          src={imageUrl}
          alt={raffle.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`
              px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
              backdrop-blur-sm
              ${status.className}
            `}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-display font-bold text-white group-hover:text-neon-purple transition-colors line-clamp-2">
          {raffle.title}
        </h3>

        {/* Prize description */}
        <p className="text-sm text-gray-cyber-400 line-clamp-2">
          {raffle.prize_description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-neon-purple">
            {formatPrice(raffle.ticket_price)}
          </span>
          <span className="text-sm text-gray-cyber-500">por ticket</span>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-cyber-400">
              {raffle.sold_tickets.toLocaleString('pt-BR')} de {raffle.total_tickets.toLocaleString('pt-BR')} tickets vendidos
            </span>
            <span className="text-neon-purple font-bold">{progressPercentage}%</span>
          </div>

          <div className="relative w-full h-2 bg-cyber-dark-100 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-glow-pulse"></div>
            </div>
          </div>
        </div>

        {/* Draw date */}
        <div className="flex items-center gap-2 text-sm text-gray-cyber-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Sorteio: {formatDate(raffle.draw_date)}</span>
        </div>

        {/* CTA Button */}
        <button
          className="
            w-full py-3 px-6 rounded-cyber
            bg-gradient-cyber text-white font-bold
            transition-all duration-300
            hover:shadow-neon-purple
            group-hover:scale-105
          "
          aria-label={`Ver detalhes da rifa ${raffle.title}`}
        >
          Ver Detalhes
        </button>
      </div>
    </Link>
  );
}
