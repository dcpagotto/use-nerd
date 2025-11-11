import { Raffle } from '@/types';

/**
 * Mock Data for Development and Testing
 *
 * This file contains sample raffle data for use during development
 * before the backend API is fully implemented.
 *
 * Usage:
 * - Import MOCK_RAFFLES in your components/pages
 * - Use as fallback when API calls fail
 * - Remove or disable when backend is ready
 */

export const MOCK_RAFFLES: Raffle[] = [
  {
    id: 'raffle-001',
    title: 'PlayStation 5 + 2 Controles',
    description:
      'Console PlayStation 5 versão disco com 2 controles DualSense wireless brancos. O console mais poderoso da Sony com gráficos incríveis em 4K e Ray Tracing. Inclui também acesso a todos os jogos do catálogo PlayStation Plus Extra por 3 meses!',
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
      'Console PlayStation 5 novo, na caixa, com 2 controles DualSense wireless brancos + 3 meses de PS Plus Extra',
    product_id: null,
    blockchain_hash: '0x1234567890abcdef1234567890abcdef12345678',
    metadata: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'raffle-002',
    title: 'iPhone 15 Pro Max 256GB',
    description:
      'iPhone 15 Pro Max na cor Titânio Natural com 256GB de armazenamento. O smartphone mais avançado da Apple com chip A17 Pro, câmera profissional de 48MP e tela Super Retina XDR de 6.7 polegadas.',
    image: null,
    start_date: '2025-01-05T00:00:00Z',
    end_date: '2025-02-05T00:00:00Z',
    draw_date: '2025-02-05T20:00:00Z',
    ticket_price: 2000, // R$ 20.00 in cents
    total_tickets: 500,
    sold_tickets: 423,
    max_tickets_per_user: 5,
    status: 'active',
    prize_description: 'iPhone 15 Pro Max Titânio Natural 256GB, novo, lacrado com nota fiscal',
    product_id: null,
    blockchain_hash: '0xabcdef1234567890abcdef1234567890abcdef12',
    metadata: null,
    created_at: '2025-01-05T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'raffle-003',
    title: 'Setup Gamer Completo',
    description:
      'PC Gamer de última geração com RTX 4060 + Monitor 144Hz + Periféricos RGB. Processador Ryzen 5 5600, 16GB RAM DDR4, SSD NVMe 1TB, placa de vídeo RTX 4060 8GB. Monitor LG UltraGear 27" 144Hz 1ms. Teclado mecânico Redragon K552 RGB e Mouse Logitech G203.',
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
      'PC Gamer completo: Ryzen 5 5600, RTX 4060 8GB, 16GB RAM, SSD 1TB NVMe + Monitor LG UltraGear 27" 144Hz + Teclado mecânico RGB + Mouse Gamer',
    product_id: null,
    blockchain_hash: null,
    metadata: null,
    created_at: '2025-01-10T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'raffle-004',
    title: 'Vale Presente R$ 5.000',
    description:
      'Crédito de R$ 5.000 para usar na loja USE Nerd. Compre qualquer produto disponível em nosso catálogo: computadores, periféricos, consoles, jogos, camisetas, decoração geek e muito mais!',
    image: null,
    start_date: '2024-12-20T00:00:00Z',
    end_date: '2025-01-10T00:00:00Z',
    draw_date: '2025-01-10T20:00:00Z',
    ticket_price: 1500, // R$ 15.00 in cents
    total_tickets: 500,
    sold_tickets: 500,
    max_tickets_per_user: 10,
    status: 'closed',
    prize_description:
      'Vale presente de R$ 5.000 para usar em qualquer produto da loja, sem restrições',
    product_id: null,
    blockchain_hash: '0x9876543210fedcba9876543210fedcba98765432',
    metadata: null,
    created_at: '2024-12-20T00:00:00Z',
    updated_at: '2025-01-10T00:00:00Z',
  },
  {
    id: 'raffle-005',
    title: 'Xbox Series X + Game Pass Ultimate',
    description:
      'Console Xbox Series X com 1 ano de Game Pass Ultimate. O Xbox mais potente já criado, com resolução 4K a 60fps e até 120fps. Inclui 1 ano completo de Xbox Game Pass Ultimate com mais de 100 jogos AAA inclusos, Xbox Live Gold e xCloud para jogar na nuvem.',
    image: null,
    start_date: '2024-12-01T00:00:00Z',
    end_date: '2024-12-25T00:00:00Z',
    draw_date: '2024-12-25T20:00:00Z',
    ticket_price: 1000, // R$ 10.00 in cents
    total_tickets: 800,
    sold_tickets: 800,
    max_tickets_per_user: 10,
    status: 'drawn',
    prize_description:
      'Console Xbox Series X novo + 1 ano de Game Pass Ultimate com mais de 100 jogos AAA inclusos',
    product_id: null,
    blockchain_hash: '0xfedcba9876543210fedcba9876543210fedcba98',
    metadata: {
      winner_ticket: 347,
      winner_name: 'João S.',
      winner_wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      draw_transaction: '0xfedcba9876543210fedcba9876543210fedcba98',
    },
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-25T21:00:00Z',
  },
  {
    id: 'raffle-006',
    title: 'Nintendo Switch OLED + Jogos',
    description:
      'Nintendo Switch OLED branco com 3 jogos: The Legend of Zelda: Tears of the Kingdom, Super Mario Odyssey e Mario Kart 8 Deluxe. Console com tela OLED de 7 polegadas para cores vibrantes e contraste incrível.',
    image: null,
    start_date: '2025-01-12T00:00:00Z',
    end_date: '2025-02-10T00:00:00Z',
    draw_date: '2025-02-10T20:00:00Z',
    ticket_price: 800, // R$ 8.00 in cents
    total_tickets: 600,
    sold_tickets: 234,
    max_tickets_per_user: 10,
    status: 'active',
    prize_description:
      'Nintendo Switch OLED branco + The Legend of Zelda: Tears of the Kingdom + Super Mario Odyssey + Mario Kart 8 Deluxe',
    product_id: null,
    blockchain_hash: null,
    metadata: null,
    created_at: '2025-01-12T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'raffle-007',
    title: 'Cadeira Gamer ThunderX3 RGB',
    description:
      'Cadeira gamer profissional ThunderX3 TC3 com iluminação RGB, ajuste de altura, reclinação até 180 graus, almofadas para lombar e pescoço, braços 4D ajustáveis. Suporta até 150kg. Ideal para longas sessões de jogo ou trabalho.',
    image: null,
    start_date: '2025-01-08T00:00:00Z',
    end_date: '2025-02-15T00:00:00Z',
    draw_date: '2025-02-15T20:00:00Z',
    ticket_price: 500, // R$ 5.00 in cents
    total_tickets: 400,
    sold_tickets: 187,
    max_tickets_per_user: 15,
    status: 'active',
    prize_description:
      'Cadeira gamer ThunderX3 TC3 RGB com reclinação 180°, braços 4D, almofadas ergonômicas e iluminação RGB',
    product_id: null,
    blockchain_hash: null,
    metadata: null,
    created_at: '2025-01-08T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'raffle-008',
    title: 'Meta Quest 3 128GB',
    description:
      'Headset de realidade virtual e mista Meta Quest 3 com 128GB. Experiência imersiva de RV de última geração com passthrough colorido em alta resolução. Jogue, trabalhe e explore mundos virtuais com a tecnologia mais avançada da Meta.',
    image: null,
    start_date: '2025-01-15T00:00:00Z',
    end_date: '2025-02-28T00:00:00Z',
    draw_date: '2025-02-28T20:00:00Z',
    ticket_price: 3000, // R$ 30.00 in cents
    total_tickets: 250,
    sold_tickets: 98,
    max_tickets_per_user: 5,
    status: 'active',
    prize_description:
      'Meta Quest 3 128GB novo, com controles Touch Plus inclusos e garantia oficial Meta',
    product_id: null,
    blockchain_hash: null,
    metadata: null,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
];

/**
 * Helper function to get a single raffle by ID
 */
export function getMockRaffleById(id: string): Raffle | undefined {
  return MOCK_RAFFLES.find((raffle) => raffle.id === id);
}

/**
 * Helper function to get raffles by status
 */
export function getMockRafflesByStatus(
  status: Raffle['status'] | Raffle['status'][]
): Raffle[] {
  const statuses = Array.isArray(status) ? status : [status];
  return MOCK_RAFFLES.filter((raffle) => statuses.includes(raffle.status));
}

/**
 * Helper function to get active raffles
 */
export function getMockActiveRaffles(): Raffle[] {
  return getMockRafflesByStatus(['active', 'closed']);
}

/**
 * Helper function to get drawn raffles
 */
export function getMockDrawnRaffles(): Raffle[] {
  return getMockRafflesByStatus('drawn');
}
