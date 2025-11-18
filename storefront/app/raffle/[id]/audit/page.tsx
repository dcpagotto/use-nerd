'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  verifyRaffleOnChain,
  getRaffleDrawDetails,
  getRaffleTickets,
  getTransactionReceipt,
  getBlock,
  formatAddress,
  formatMatic,
  getExplorerTxUrl,
  getExplorerAddressUrl,
  getExplorerBlockUrl,
  isBlockchainAccessible,
} from '@/lib/web3-client';

/**
 * Blockchain Audit Page
 *
 * Public transparency page showing blockchain verification for a raffle.
 * NO wallet connection - read-only blockchain queries.
 *
 * Shows:
 * - On-chain raffle data (total tickets, tickets sold, status)
 * - Draw details (Chainlink VRF request ID, random words, winner)
 * - Transaction links to PolygonScan
 * - Blockchain health status
 * - Public verification badges
 */

interface RaffleData {
  verified: boolean;
  raffleId: string;
  totalTickets: number;
  ticketsSold: number;
  status: string;
  drawTimestamp: Date | null;
  error?: string;
}

interface DrawData {
  raffleId: string;
  vrfRequestId: string;
  randomWord: string | null;
  winnerTicketNumber: number;
  winnerAddress: string;
  timestamp: Date | null;
  transactionHash: string;
}

interface TicketData {
  ticketNumber: number;
  orderId: string;
  customerId: string;
  timestamp: Date | null;
  isWinner: boolean;
}

export default function RaffleAuditPage() {
  const params = useParams();
  const router = useRouter();
  const raffleId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [blockchainAccessible, setBlockchainAccessible] = useState(false);
  const [raffleData, setRaffleData] = useState<RaffleData | null>(null);
  const [drawData, setDrawData] = useState<DrawData | null>(null);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'draw' | 'tickets'>('overview');

  // Smart contract details (will be configured later)
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_RAFFLE_CONTRACT_ADDRESS || '0x...';
  const CONTRACT_ABI = []; // Will be populated when contract is deployed

  useEffect(() => {
    loadBlockchainData();
  }, [raffleId]);

  const loadBlockchainData = async () => {
    setLoading(true);

    try {
      // Check blockchain accessibility
      const accessible = await isBlockchainAccessible();
      setBlockchainAccessible(accessible);

      if (!accessible) {
        console.warn('Blockchain not accessible');
        return;
      }

      // Verify raffle on-chain
      const raffle = await verifyRaffleOnChain(raffleId, CONTRACT_ADDRESS, CONTRACT_ABI);
      setRaffleData(raffle);

      // If raffle has been drawn, fetch draw details
      if (raffle.verified && raffle.status === 'completed') {
        try {
          const draw = await getRaffleDrawDetails(raffleId, CONTRACT_ADDRESS, CONTRACT_ABI);
          setDrawData(draw);
        } catch (error) {
          console.error('Error fetching draw details:', error);
        }
      }

      // Fetch some example tickets (in production, would be paginated)
      // For now, we'll just show placeholder data
      setTickets([]);
    } catch (error) {
      console.error('Error loading blockchain data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-cyber-300">Carregando dados da blockchain...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-2 text-neon-purple hover:text-neon-blue transition-colors"
            >
              ← Voltar
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="neon-text-purple mb-2 font-display text-display-2">
                  Auditoria Blockchain
                </h1>
                <p className="text-gray-cyber-300">
                  Transparência total verificada na blockchain Polygon
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      blockchainAccessible ? 'bg-neon-green shadow-neon-green' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-sm text-gray-cyber-400">
                    {blockchainAccessible ? 'Blockchain Online' : 'Blockchain Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Blockchain Status Warning */}
          {!blockchainAccessible && (
            <div className="mb-8 rounded-cyber border border-yellow-500/30 bg-yellow-500/10 p-6">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-yellow-500">
                ⚠️ Blockchain Temporariamente Indisponível
              </h3>
              <p className="text-sm text-gray-cyber-300">
                Não foi possível conectar à blockchain Polygon. Os dados abaixo podem estar
                desatualizados. Tente novamente em alguns momentos.
              </p>
            </div>
          )}

          {/* Smart Contract Not Deployed Yet */}
          {blockchainAccessible && (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x...') && (
            <div className="mb-8 rounded-cyber border border-neon-blue/30 bg-neon-blue/10 p-6">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-neon-blue">
                ℹ️ Smart Contract em Desenvolvimento
              </h3>
              <p className="mb-4 text-sm text-gray-cyber-300">
                O smart contract de rifas ainda não foi implantado na blockchain Polygon.
                Esta página está pronta e começará a exibir dados reais assim que o contrato
                for publicado (Phase 2-3).
              </p>
              <div className="rounded-cyber bg-cyber-dark-100 p-4">
                <p className="mb-2 text-xs font-semibold text-gray-cyber-300">
                  Funcionalidades que estarão disponíveis:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-cyber-400">
                  <li>Verificação on-chain de todas as rifas</li>
                  <li>Detalhes de sorteios com Chainlink VRF</li>
                  <li>Histórico completo de tickets vendidos</li>
                  <li>Links diretos para PolygonScan</li>
                  <li>Transparência e auditoria pública</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="mb-8 flex gap-2 border-b border-gray-cyber-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'border-b-2 border-neon-purple text-neon-purple'
                  : 'text-gray-cyber-400 hover:text-white'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('draw')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'draw'
                  ? 'border-b-2 border-neon-purple text-neon-purple'
                  : 'text-gray-cyber-400 hover:text-white'
              }`}
            >
              Sorteio (VRF)
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'tickets'
                  ? 'border-b-2 border-neon-purple text-neon-purple'
                  : 'text-gray-cyber-400 hover:text-white'
              }`}
            >
              Tickets
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Verification Badge */}
                <div className="card-cyber-glow p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-cyber">
                      <span className="text-3xl">✓</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white">
                        {raffleData?.verified ? 'Verificado na Blockchain' : 'Aguardando Verificação'}
                      </h2>
                      <p className="text-sm text-gray-cyber-400">
                        {raffleData?.verified
                          ? 'Esta rifa foi registrada e pode ser auditada publicamente'
                          : 'Esta rifa ainda não foi registrada na blockchain'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Raffle Stats */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="card-cyber-glow p-6">
                    <p className="mb-2 text-sm text-gray-cyber-400">Total de Tickets</p>
                    <p className="text-3xl font-bold text-white">
                      {raffleData?.totalTickets || 0}
                    </p>
                  </div>

                  <div className="card-cyber-glow p-6">
                    <p className="mb-2 text-sm text-gray-cyber-400">Tickets Vendidos</p>
                    <p className="text-3xl font-bold text-neon-purple">
                      {raffleData?.ticketsSold || 0}
                    </p>
                  </div>

                  <div className="card-cyber-glow p-6">
                    <p className="mb-2 text-sm text-gray-cyber-400">Status</p>
                    <p className="text-3xl font-bold text-neon-blue">
                      {raffleData?.status || 'Pendente'}
                    </p>
                  </div>
                </div>

                {/* Contract Information */}
                <div className="card-cyber-glow p-6">
                  <h3 className="mb-4 text-xl font-semibold text-white">
                    Informações do Smart Contract
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-cyber border border-gray-cyber-700 bg-cyber-dark-100 p-4">
                      <span className="text-sm text-gray-cyber-400">Network</span>
                      <span className="font-mono text-sm text-white">Polygon Mainnet</span>
                    </div>
                    <div className="flex items-center justify-between rounded-cyber border border-gray-cyber-700 bg-cyber-dark-100 p-4">
                      <span className="text-sm text-gray-cyber-400">Chain ID</span>
                      <span className="font-mono text-sm text-white">137</span>
                    </div>
                    <div className="flex items-center justify-between rounded-cyber border border-gray-cyber-700 bg-cyber-dark-100 p-4">
                      <span className="text-sm text-gray-cyber-400">Contract Address</span>
                      <a
                        href={getExplorerAddressUrl(CONTRACT_ADDRESS)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-neon-purple hover:text-neon-blue transition-colors"
                      >
                        {formatAddress(CONTRACT_ADDRESS)} →
                      </a>
                    </div>
                    <div className="flex items-center justify-between rounded-cyber border border-gray-cyber-700 bg-cyber-dark-100 p-4">
                      <span className="text-sm text-gray-cyber-400">Raffle ID</span>
                      <span className="font-mono text-sm text-white">{raffleId}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Draw Tab */}
            {activeTab === 'draw' && (
              <div className="space-y-6">
                {drawData ? (
                  <>
                    {/* VRF Information */}
                    <div className="card-cyber-glow p-6">
                      <h3 className="mb-4 text-xl font-semibold text-white">
                        Chainlink VRF - Aleatoriedade Verificável
                      </h3>
                      <p className="mb-6 text-sm text-gray-cyber-400">
                        O sorteio foi realizado usando Chainlink VRF (Verifiable Random Function),
                        garantindo que o resultado é verdadeiramente aleatório e não pode ser
                        manipulado.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-cyber border border-gray-cyber-700 bg-cyber-dark-100 p-4">
                          <span className="text-sm text-gray-cyber-400">VRF Request ID</span>
                          <span className="font-mono text-sm text-white">
                            {formatAddress(drawData.vrfRequestId)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-cyber border border-gray-cyber-700 bg-cyber-dark-100 p-4">
                          <span className="text-sm text-gray-cyber-400">Random Word</span>
                          <span className="font-mono text-sm text-neon-purple">
                            {drawData.randomWord
                              ? `${drawData.randomWord.substring(0, 16)}...`
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-cyber border border-gray-cyber-700 bg-cyber-dark-100 p-4">
                          <span className="text-sm text-gray-cyber-400">Ticket Vencedor</span>
                          <span className="font-mono text-xl font-bold text-neon-green">
                            #{drawData.winnerTicketNumber}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-cyber border border-gray-cyber-700 bg-cyber-dark-100 p-4">
                          <span className="text-sm text-gray-cyber-400">Endereço Vencedor</span>
                          <a
                            href={getExplorerAddressUrl(drawData.winnerAddress)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-sm text-neon-purple hover:text-neon-blue transition-colors"
                          >
                            {formatAddress(drawData.winnerAddress)} →
                          </a>
                        </div>
                        {drawData.transactionHash && (
                          <div className="flex items-center justify-between rounded-cyber border border-gray-cyber-700 bg-cyber-dark-100 p-4">
                            <span className="text-sm text-gray-cyber-400">Transaction Hash</span>
                            <a
                              href={getExplorerTxUrl(drawData.transactionHash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-sm text-neon-purple hover:text-neon-blue transition-colors"
                            >
                              {formatAddress(drawData.transactionHash)} →
                            </a>
                          </div>
                        )}
                        {drawData.timestamp && (
                          <div className="flex items-center justify-between rounded-cyber border border-gray-cyber-700 bg-cyber-dark-100 p-4">
                            <span className="text-sm text-gray-cyber-400">Data do Sorteio</span>
                            <span className="text-sm text-white">
                              {drawData.timestamp.toLocaleString('pt-BR')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* What is Chainlink VRF */}
                    <div className="rounded-cyber border border-neon-blue/30 bg-neon-blue/10 p-6">
                      <h4 className="mb-3 text-lg font-semibold text-neon-blue">
                        O que é Chainlink VRF?
                      </h4>
                      <p className="mb-3 text-sm text-gray-cyber-300">
                        Chainlink VRF (Verifiable Random Function) é um gerador de números
                        aleatórios verificável on-chain. Ele fornece uma prova criptográfica
                        de que o número aleatório não foi manipulado.
                      </p>
                      <p className="text-sm text-gray-cyber-400">
                        Isso garante que nossos sorteios são justos, transparentes e
                        completamente imunes a manipulação - nem mesmo nós podemos
                        influenciar o resultado!
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="card-cyber-glow p-12 text-center">
                    <div className="mb-4 text-6xl">🎲</div>
                    <h3 className="mb-2 text-xl font-semibold text-white">
                      Sorteio Ainda Não Realizado
                    </h3>
                    <p className="text-gray-cyber-400">
                      Os detalhes do sorteio aparecerão aqui quando o sorteio for realizado.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tickets Tab */}
            {activeTab === 'tickets' && (
              <div className="card-cyber-glow p-6">
                <h3 className="mb-4 text-xl font-semibold text-white">
                  Histórico de Tickets (On-Chain)
                </h3>
                {tickets.length > 0 ? (
                  <div className="space-y-2">
                    {tickets.map((ticket, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-cyber border border-gray-cyber-700 bg-cyber-dark-100 p-4"
                      >
                        <div>
                          <p className="font-mono text-white">Ticket #{ticket.ticketNumber}</p>
                          <p className="text-xs text-gray-cyber-400">
                            Order: {formatAddress(ticket.orderId)}
                          </p>
                        </div>
                        <div className="text-right">
                          {ticket.isWinner && (
                            <span className="rounded-full bg-neon-green px-3 py-1 text-xs font-bold text-black">
                              VENCEDOR
                            </span>
                          )}
                          {ticket.timestamp && (
                            <p className="mt-1 text-xs text-gray-cyber-400">
                              {ticket.timestamp.toLocaleString('pt-BR')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-gray-cyber-400">
                      Nenhum ticket encontrado on-chain ainda. Tickets aparecerão aqui quando
                      forem registrados na blockchain.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-12 rounded-cyber border border-gray-cyber-700 bg-cyber-dark-100 p-6">
            <h4 className="mb-3 text-lg font-semibold text-white">
              Sobre a Auditoria Blockchain
            </h4>
            <p className="mb-3 text-sm text-gray-cyber-300">
              Esta página mostra dados públicos verificáveis diretamente da blockchain Polygon.
              Qualquer pessoa pode auditar essas informações de forma independente.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://polygonscan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-cyber border border-neon-purple/30 bg-neon-purple/10 px-4 py-2 text-sm text-neon-purple hover:bg-neon-purple/20 transition-colors"
              >
                Ver no PolygonScan →
              </a>
              <a
                href="https://chain.link/vrf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-cyber border border-neon-blue/30 bg-neon-blue/10 px-4 py-2 text-sm text-neon-blue hover:bg-neon-blue/20 transition-colors"
              >
                Sobre Chainlink VRF →
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
