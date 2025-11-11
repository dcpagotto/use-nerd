import { Metadata } from 'next';
import { Suspense } from 'react';
import RaffleCard from '@/components/RaffleCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { raffleApi } from '@/lib/medusa-client';
import { Raffle } from '@/types';

/**
 * Raffles List Page
 *
 * Displays all active raffles in a responsive grid.
 * Features filtering by status and skeleton loading states.
 * Server Component with server-side data fetching.
 */

export const metadata: Metadata = {
  title: 'Rifas Ativas | USE Nerd',
  description:
    'Participe de rifas verificadas na blockchain. Ganhe prêmios incríveis com transparência garantida pela tecnologia Polygon.',
  keywords: 'rifas, sorteios, blockchain, polygon, prêmios, concursos',
  openGraph: {
    title: 'Rifas Ativas | USE Nerd',
    description:
      'Participe de rifas verificadas na blockchain. Ganhe prêmios incríveis com transparência garantida.',
    type: 'website',
  },
};

// Mock data for development (remove when backend is ready)
const MOCK_RAFFLES: Raffle[] = [
  {
    id: 'raffle-001',
    title: 'PlayStation 5 + 2 Controles',
    description: 'Console PlayStation 5 versão disco com 2 controles DualSense wireless',
    image: null,
    start_date: '2025-01-01T00:00:00Z',
    end_date: '2025-02-01T00:00:00Z',
    draw_date: '2025-02-01T20:00:00Z',
    ticket_price: 1000, // R$ 10.00 in cents
    total_tickets: 1000,
    sold_tickets: 657,
    max_tickets_per_user: 10,
    status: 'active',
    prize_description:
      'Console PlayStation 5 novo, na caixa, com 2 controles DualSense wireless brancos',
    product_id: null,
    blockchain_hash: '0x1234567890abcdef',
    metadata: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'raffle-002',
    title: 'iPhone 15 Pro Max 256GB',
    description: 'iPhone 15 Pro Max Titânio Natural com 256GB',
    image: null,
    start_date: '2025-01-05T00:00:00Z',
    end_date: '2025-02-05T00:00:00Z',
    draw_date: '2025-02-05T20:00:00Z',
    ticket_price: 2000, // R$ 20.00 in cents
    total_tickets: 500,
    sold_tickets: 423,
    max_tickets_per_user: 5,
    status: 'active',
    prize_description: 'iPhone 15 Pro Max Titânio Natural 256GB, novo, lacrado',
    product_id: null,
    blockchain_hash: '0xabcdef1234567890',
    metadata: null,
    created_at: '2025-01-05T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'raffle-003',
    title: 'Setup Gamer Completo',
    description: 'PC Gamer RTX 4060 + Monitor 144Hz + Periféricos',
    image: null,
    start_date: '2025-01-10T00:00:00Z',
    end_date: '2025-02-20T00:00:00Z',
    draw_date: '2025-02-20T20:00:00Z',
    ticket_price: 5000, // R$ 50.00 in cents
    total_tickets: 300,
    sold_tickets: 89,
    max_tickets_per_user: 10,
    status: 'active',
    prize_description:
      'PC Gamer completo com RTX 4060, Ryzen 5 5600, 16GB RAM, SSD 1TB + Monitor 144Hz + Teclado e Mouse Gamer',
    product_id: null,
    blockchain_hash: null,
    metadata: null,
    created_at: '2025-01-10T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'raffle-004',
    title: 'Vale Presente R$ 5.000',
    description: 'Crédito de R$ 5.000 para usar na loja USE Nerd',
    image: null,
    start_date: '2024-12-20T00:00:00Z',
    end_date: '2025-01-10T00:00:00Z',
    draw_date: '2025-01-10T20:00:00Z',
    ticket_price: 1500, // R$ 15.00 in cents
    total_tickets: 500,
    sold_tickets: 500,
    max_tickets_per_user: 10,
    status: 'closed',
    prize_description: 'Vale presente de R$ 5.000 para usar em qualquer produto da loja',
    product_id: null,
    blockchain_hash: '0x9876543210fedcba',
    metadata: null,
    created_at: '2024-12-20T00:00:00Z',
    updated_at: '2025-01-10T00:00:00Z',
  },
  {
    id: 'raffle-005',
    title: 'Xbox Series X + Game Pass Ultimate',
    description: 'Console Xbox Series X com 1 ano de Game Pass Ultimate',
    image: null,
    start_date: '2024-12-01T00:00:00Z',
    end_date: '2024-12-25T00:00:00Z',
    draw_date: '2024-12-25T20:00:00Z',
    ticket_price: 1000, // R$ 10.00 in cents
    total_tickets: 800,
    sold_tickets: 800,
    max_tickets_per_user: 10,
    status: 'drawn',
    prize_description: 'Console Xbox Series X novo + 1 ano de Game Pass Ultimate',
    product_id: null,
    blockchain_hash: '0xfedcba9876543210',
    metadata: { winner_ticket: 347, winner_name: 'João S.' },
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-25T21:00:00Z',
  },
];

async function getRaffles(): Promise<Raffle[]> {
  try {
    const response = await raffleApi.getActiveRaffles();
    return response.raffles || [];
  } catch (error) {
    console.error('Error fetching raffles, using mock data:', error);
    // Return mock data if backend is not available
    return MOCK_RAFFLES;
  }
}

function RafflesContent({ raffles }: { raffles: Raffle[] }) {
  const activeRaffles = raffles.filter((r) => r.status === 'active' || r.status === 'closed');
  const drawnRaffles = raffles.filter((r) => r.status === 'drawn');

  if (raffles.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-neon-purple/10 mb-6">
          <svg
            className="w-12 h-12 text-neon-purple"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-3">Nenhuma Rifa Disponível</h2>
        <p className="text-gray-cyber-400 max-w-md mx-auto">
          Não há rifas ativas no momento. Volte em breve para participar de novos sorteios
          incríveis!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Active raffles */}
      {activeRaffles.length > 0 && (
        <section>
          <h2 className="text-3xl font-display font-bold text-white mb-8">
            Rifas Ativas
            <span className="ml-4 text-lg text-neon-purple">({activeRaffles.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeRaffles.map((raffle) => (
              <RaffleCard key={raffle.id} raffle={raffle} />
            ))}
          </div>
        </section>
      )}

      {/* Drawn raffles */}
      {drawnRaffles.length > 0 && (
        <section>
          <h2 className="text-3xl font-display font-bold text-white mb-8">
            Rifas Finalizadas
            <span className="ml-4 text-lg text-neon-purple">({drawnRaffles.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drawnRaffles.map((raffle) => (
              <RaffleCard key={raffle.id} raffle={raffle} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function RafflesLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-cyber-dark-50 rounded-cyber-lg border border-neon-purple/20 overflow-hidden animate-pulse"
        >
          <div className="w-full aspect-video bg-cyber-dark-100"></div>
          <div className="p-5 space-y-4">
            <div className="h-6 bg-cyber-dark-100 rounded w-3/4"></div>
            <div className="h-4 bg-cyber-dark-100 rounded w-full"></div>
            <div className="h-4 bg-cyber-dark-100 rounded w-2/3"></div>
            <div className="h-8 bg-cyber-dark-100 rounded w-1/2"></div>
            <div className="h-2 bg-cyber-dark-100 rounded w-full"></div>
            <div className="h-10 bg-cyber-dark-100 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function RafflesPage() {
  const raffles = await getRaffles();

  return (
    <main className="min-h-screen bg-cyber-dark-200">
      {/* Hero section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid-cyber bg-grid-md opacity-20"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-dark-200/50 to-cyber-dark-200"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-display-2 md:text-display-1 font-display font-bold text-white mb-6">
            Rifas{' '}
            <span className="text-transparent bg-clip-text bg-gradient-cyber">Blockchain</span>
          </h1>

          <p className="text-xl text-gray-cyber-300 max-w-3xl mx-auto mb-8">
            Participe de rifas verificadas na blockchain Polygon. Total transparência e segurança
            garantida.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-neon-purple">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Verificado na Blockchain</span>
            </div>

            <div className="flex items-center gap-2 text-neon-blue">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">100% Seguro</span>
            </div>

            <div className="flex items-center gap-2 text-neon-green">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Pagamento Seguro</span>
            </div>
          </div>
        </div>
      </section>

      {/* Raffles content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <Suspense fallback={<RafflesLoading />}>
          <RafflesContent raffles={raffles} />
        </Suspense>
      </section>

      {/* Info section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-cyber-dark-50 rounded-cyber-lg border border-neon-blue/20 p-8">
          <h2 className="text-2xl font-display font-bold text-white mb-6">Como Funciona?</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple font-bold border border-neon-purple/50">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Escolha sua Rifa</h3>
                <p className="text-gray-cyber-400">
                  Navegue pelas rifas disponíveis e escolha a que mais te interessa.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple font-bold border border-neon-purple/50">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Compre seus Tickets</h3>
                <p className="text-gray-cyber-400">
                  Selecione a quantidade de tickets que deseja comprar e finalize a compra com PIX
                  ou Mercado Pago.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple font-bold border border-neon-purple/50">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Aguarde o Sorteio</h3>
                <p className="text-gray-cyber-400">
                  O sorteio é realizado na blockchain Polygon, garantindo total transparência e
                  aleatoriedade. Você pode verificar o resultado na blockchain!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
