/**
 * Active Raffles Component
 * Displays active raffles from Medusa
 */

import Link from 'next/link';
import type { Raffle } from '@/lib/types/medusa';
import { formatStrapiDate } from '@/lib/strapi-utils';

interface ActiveRafflesProps {
  raffles: Raffle[];
}

export default function ActiveRaffles({ raffles }: ActiveRafflesProps) {
  if (raffles.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Nenhuma rifa ativa no momento. Volte em breve!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {raffles.map((raffle) => (
        <RaffleCard key={raffle.id} raffle={raffle} />
      ))}
    </div>
  );
}

function RaffleCard({ raffle }: { raffle: Raffle }) {
  const ticketsSold = raffle.tickets_sold || 0;
  const totalTickets = raffle.total_tickets;
  const percentageSold = (ticketsSold / totalTickets) * 100;

  return (
    <Link
      href={`/rifas/${raffle.id}`}
      className="group relative overflow-hidden rounded-cyber-lg bg-cyber-dark-100 border-2 border-neon-purple/20 shadow-cyber transition-all duration-300 hover:border-neon-purple hover:shadow-neon-purple hover:-translate-y-2 focus-cyber"
    >
      {/* Raffle Image */}
      <div className="relative aspect-video overflow-hidden bg-gradient-cyber">
        {raffle.image_url ? (
          <img
            src={raffle.image_url}
            alt={raffle.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-6xl animate-float">🎫</span>
          </div>
        )}

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark-100 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute right-3 top-3 rounded-cyber bg-neon-green px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-cyber-dark shadow-neon-green backdrop-blur-sm">
          Ativa
        </div>
      </div>

      {/* Raffle Info */}
      <div className="p-5">
        <h3 className="mb-2 text-xl font-bold text-white line-clamp-2 group-hover:text-gradient-cyber transition-all">
          {raffle.title}
        </h3>

        {raffle.description && (
          <p className="mb-4 text-sm text-gray-cyber-300 line-clamp-2">{raffle.description}</p>
        )}

        {/* Prize Value */}
        {raffle.prize_value && (
          <div className="mb-3 flex items-center gap-2 p-3 rounded-cyber bg-neon-purple/5 border border-neon-purple/20">
            <span className="text-sm text-gray-cyber-300">Premio:</span>
            <span className="text-lg font-black text-gradient-cyber">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(raffle.prize_value / 100)}
            </span>
          </div>
        )}

        {/* Ticket Price */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-cyber-400">Valor do bilhete:</span>
          <span className="text-2xl font-black text-gradient-neon">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(raffle.ticket_price / 100)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="mb-2 flex justify-between text-xs text-gray-cyber-400 font-mono">
            <span>{ticketsSold} vendidos</span>
            <span>{totalTickets - ticketsSold} disponíveis</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-cyber-dark-50 border border-neon-purple/20">
            <div
              className="h-full rounded-full bg-gradient-cyber shadow-neon-purple-sm transition-all duration-500"
              style={{ width: `${Math.min(percentageSold, 100)}%` }}
            />
          </div>
          <div className="mt-2 text-center text-xs font-bold text-neon-purple uppercase tracking-wider">
            {percentageSold.toFixed(1)}% vendidos
          </div>
        </div>

        {/* Draw Date */}
        {raffle.draw_date && (
          <div className="mt-4 border-t border-neon-purple/20 pt-3 text-center">
            <span className="text-xs text-gray-cyber-400 uppercase tracking-wider">Sorteio em:</span>
            <p className="text-sm font-bold text-white font-mono mt-1">
              {formatStrapiDate(raffle.draw_date)}
            </p>
          </div>
        )}
      </div>

      {/* Hover Effect - Neon Border */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-cyber transition-all duration-300 group-hover:h-2 shadow-neon-purple-sm" />

      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-neon-blue/20 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Link>
  );
}
