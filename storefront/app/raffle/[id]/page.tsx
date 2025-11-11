'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Raffle } from '@/types';
import { raffleApi, blockchainApi } from '@/lib/medusa-client';
import RaffleTicketSelector from '@/components/RaffleTicketSelector';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatPrice, formatDateTime, percentage, getImageUrl } from '@/lib/utils';

/**
 * Raffle Detail Page
 *
 * Detailed view of a single raffle with:
 * - Hero image and information
 * - Ticket purchase section
 * - Progress tracking
 * - Countdown timer
 * - Blockchain verification (for drawn raffles)
 * - Winner announcement (if applicable)
 *
 * Client Component for interactivity.
 */

// Mock data matching the list page
const MOCK_RAFFLES: Raffle[] = [
  {
    id: 'raffle-001',
    title: 'PlayStation 5 + 2 Controles',
    description: 'Console PlayStation 5 versão disco com 2 controles DualSense wireless brancos. O console mais poderoso da Sony com gráficos incríveis em 4K e Ray Tracing. Inclui também acesso a todos os jogos do catálogo PlayStation Plus Extra por 3 meses!',
    image: null,
    start_date: '2025-01-01T00:00:00Z',
    end_date: '2025-02-01T00:00:00Z',
    draw_date: '2025-02-01T20:00:00Z',
    ticket_price: 1000,
    total_tickets: 1000,
    sold_tickets: 657,
    max_tickets_per_user: 10,
    status: 'active',
    prize_description: 'Console PlayStation 5 novo, na caixa, com 2 controles DualSense wireless brancos + 3 meses de PS Plus Extra',
    product_id: null,
    blockchain_hash: '0x1234567890abcdef',
    metadata: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'raffle-002',
    title: 'iPhone 15 Pro Max 256GB',
    description: 'iPhone 15 Pro Max na cor Titânio Natural com 256GB de armazenamento. O smartphone mais avançado da Apple com chip A17 Pro, câmera profissional de 48MP e tela Super Retina XDR de 6.7 polegadas.',
    image: null,
    start_date: '2025-01-05T00:00:00Z',
    end_date: '2025-02-05T00:00:00Z',
    draw_date: '2025-02-05T20:00:00Z',
    ticket_price: 2000,
    total_tickets: 500,
    sold_tickets: 423,
    max_tickets_per_user: 5,
    status: 'active',
    prize_description: 'iPhone 15 Pro Max Titânio Natural 256GB, novo, lacrado com nota fiscal',
    product_id: null,
    blockchain_hash: '0xabcdef1234567890',
    metadata: null,
    created_at: '2025-01-05T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'raffle-005',
    title: 'Xbox Series X + Game Pass Ultimate',
    description: 'Console Xbox Series X com 1 ano de Game Pass Ultimate. Vencedor: Ticket #347',
    image: null,
    start_date: '2024-12-01T00:00:00Z',
    end_date: '2024-12-25T00:00:00Z',
    draw_date: '2024-12-25T20:00:00Z',
    ticket_price: 1000,
    total_tickets: 800,
    sold_tickets: 800,
    max_tickets_per_user: 10,
    status: 'drawn',
    prize_description: 'Console Xbox Series X novo + 1 ano de Game Pass Ultimate com mais de 100 jogos inclusos',
    product_id: null,
    blockchain_hash: '0xfedcba9876543210',
    metadata: { winner_ticket: 347, winner_name: 'João S.' },
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-25T21:00:00Z',
  },
];

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(drawDate: string): TimeLeft | null {
  const difference = new Date(drawDate).getTime() - new Date().getTime();

  if (difference <= 0) {
    return null;
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function RaffleDetailPage() {
  const params = useParams();
  const raffleId = params.id as string;

  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    async function loadRaffle() {
      try {
        setLoading(true);
        const response = await raffleApi.getRaffle(raffleId);
        setRaffle(response.raffle);
      } catch (err) {
        console.error('Error loading raffle, using mock data:', err);
        // Fallback to mock data
        const mockRaffle = MOCK_RAFFLES.find((r) => r.id === raffleId);
        if (mockRaffle) {
          setRaffle(mockRaffle);
        } else {
          setError('Rifa não encontrada');
        }
      } finally {
        setLoading(false);
      }
    }

    loadRaffle();
  }, [raffleId]);

  // Countdown timer
  useEffect(() => {
    if (!raffle || raffle.status !== 'active') return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(raffle.draw_date));
    }, 1000);

    return () => clearInterval(timer);
  }, [raffle]);

  const handleAddToCart = async (quantity: number) => {
    console.log(`Adding ${quantity} tickets to cart`);
    // TODO: Implement cart integration
    alert(`${quantity} tickets adicionados ao carrinho!`);
  };

  const handleVerifyOnBlockchain = async () => {
    if (!raffle?.blockchain_hash) return;

    setVerifying(true);
    try {
      const result = await blockchainApi.verifyRaffle(raffle.id);
      alert('Rifa verificada com sucesso na blockchain!');
      console.log('Verification result:', result);
    } catch (err) {
      console.error('Verification error:', err);
      alert('Erro ao verificar na blockchain. Tente novamente.');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark-200 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !raffle) {
    return (
      <div className="min-h-screen bg-cyber-dark-200 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-neon-red/10 mb-6">
            <svg
              className="w-12 h-12 text-neon-red"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-3">
            {error || 'Rifa não encontrada'}
          </h2>
          <p className="text-gray-cyber-400 mb-8">
            Não foi possível encontrar esta rifa. Ela pode ter sido removida ou o ID está incorreto.
          </p>
          <Link
            href="/raffles"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-cyber text-white font-bold rounded-cyber hover:shadow-neon-purple transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Voltar para Rifas
          </Link>
        </div>
      </div>
    );
  }

  const progressPercentage = percentage(raffle.sold_tickets, raffle.total_tickets);
  const imageUrl = raffle.image ? getImageUrl(raffle.image) : '/images/raffle-placeholder.png';
  const isDrawn = raffle.status === 'drawn';
  const isActive = raffle.status === 'active';
  const winnerTicket = raffle.metadata?.winner_ticket;

  return (
    <main className="min-h-screen bg-cyber-dark-200">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-cyber-400">
          <Link href="/" className="hover:text-neon-purple transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/raffles" className="hover:text-neon-purple transition-colors">
            Rifas
          </Link>
          <span>/</span>
          <span className="text-white">{raffle.title}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative aspect-square rounded-cyber-lg overflow-hidden bg-cyber-dark-50 border border-neon-purple/20">
            <Image
              src={imageUrl}
              alt={raffle.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {isDrawn && (
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark-200 via-transparent to-transparent flex items-end justify-center pb-8">
                <div className="bg-neon-purple/90 backdrop-blur-sm px-6 py-3 rounded-full">
                  <span className="text-white font-bold text-lg">SORTEADO</span>
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-display-3 md:text-display-2 font-display font-bold text-white mb-4">
                {raffle.title}
              </h1>
              <p className="text-lg text-gray-cyber-300">{raffle.description}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cyber-dark-50 rounded-cyber p-4 border border-neon-purple/20">
                <div className="text-sm text-gray-cyber-400 mb-1">Preço do Ticket</div>
                <div className="text-2xl font-bold text-neon-purple">
                  {formatPrice(raffle.ticket_price)}
                </div>
              </div>

              <div className="bg-cyber-dark-50 rounded-cyber p-4 border border-neon-purple/20">
                <div className="text-sm text-gray-cyber-400 mb-1">Tickets Vendidos</div>
                <div className="text-2xl font-bold text-white">
                  {raffle.sold_tickets.toLocaleString('pt-BR')} /{' '}
                  {raffle.total_tickets.toLocaleString('pt-BR')}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-cyber-400">
                <span>Progresso</span>
                <span className="text-neon-purple font-bold">{progressPercentage}%</span>
              </div>
              <div className="relative w-full h-4 bg-cyber-dark-100 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-glow-pulse"></div>
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            {isActive && timeLeft && (
              <div className="bg-cyber-dark-50 rounded-cyber-lg border border-neon-blue/20 p-6">
                <h3 className="text-sm font-medium text-gray-cyber-400 mb-4">
                  Sorteio em: {formatDateTime(raffle.draw_date)}
                </h3>

                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Dias', value: timeLeft.days },
                    { label: 'Horas', value: timeLeft.hours },
                    { label: 'Min', value: timeLeft.minutes },
                    { label: 'Seg', value: timeLeft.seconds },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="bg-gradient-cyber text-white text-3xl font-bold rounded-cyber py-3 mb-2">
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <div className="text-xs text-gray-cyber-500">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ticket Selector or Winner Info */}
            {isActive ? (
              <RaffleTicketSelector raffle={raffle} onAddToCart={handleAddToCart} />
            ) : isDrawn && winnerTicket ? (
              <div className="bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 rounded-cyber-lg border border-neon-purple/50 p-6">
                <h3 className="text-2xl font-display font-bold text-white mb-4">
                  Vencedor Anunciado!
                </h3>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm text-gray-cyber-400 mb-1">Ticket Vencedor</div>
                    <div className="text-4xl font-bold text-neon-purple">#{winnerTicket}</div>
                  </div>
                  {raffle.metadata?.winner_name && (
                    <div>
                      <div className="text-sm text-gray-cyber-400 mb-1">Ganhador</div>
                      <div className="text-2xl font-bold text-white">
                        {raffle.metadata.winner_name}
                      </div>
                    </div>
                  )}
                </div>

                {raffle.blockchain_hash && (
                  <div className="space-y-3">
                    <button
                      onClick={handleVerifyOnBlockchain}
                      disabled={verifying}
                      className="w-full py-3 px-6 bg-cyber-dark-100 border border-neon-blue text-neon-blue font-bold rounded-cyber hover:bg-neon-blue/10 transition-all disabled:opacity-50"
                    >
                      {verifying ? 'Verificando...' : 'Verificar na Blockchain'}
                    </button>

                    <a
                      href={`https://polygonscan.com/tx/${raffle.blockchain_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-transparent border border-neon-purple/30 text-neon-purple font-medium rounded-cyber hover:border-neon-purple hover:bg-neon-purple/10 transition-all"
                    >
                      <span>Ver no PolygonScan</span>
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
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Prize Description */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-cyber-dark-50 rounded-cyber-lg border border-neon-purple/20 p-8">
          <h2 className="text-2xl font-display font-bold text-white mb-4">Sobre o Prêmio</h2>
          <p className="text-gray-cyber-300 text-lg leading-relaxed">{raffle.prize_description}</p>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-4 py-8 pb-16">
        <div className="bg-cyber-dark-50 rounded-cyber-lg border border-neon-blue/20 p-8">
          <h2 className="text-2xl font-display font-bold text-white mb-6">Como Funciona?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple font-bold text-xl border border-neon-purple/50">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Compre seus Tickets</h3>
              <p className="text-gray-cyber-400">
                Selecione a quantidade desejada e finalize a compra com PIX ou Mercado Pago.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue font-bold text-xl border border-neon-blue/50">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Aguarde o Sorteio</h3>
              <p className="text-gray-cyber-400">
                O sorteio é realizado automaticamente na data e hora marcadas.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green font-bold text-xl border border-neon-green/50">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Verificação Blockchain</h3>
              <p className="text-gray-cyber-400">
                O sorteio é verificado na blockchain Polygon, garantindo total transparência.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
