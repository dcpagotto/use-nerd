/**
 * Enhanced Medusa Client for Raffle Module
 * Type-safe client for raffle-specific endpoints
 */

import { getMedusaBackendUrl } from './medusa-client';
import type {
  Raffle,
  RaffleTicket,
  RaffleDraw,
  RaffleStats,
  RaffleListResponse,
  RaffleResponse,
  RaffleTicketListResponse,
  RaffleTicketResponse,
  RaffleDrawResponse,
  RaffleStatsResponse,
  WinnerInfo,
  WinnerListResponse,
  BlockchainVerification,
  BlockchainVerificationResponse,
  RaffleQueryParams,
  TicketQueryParams,
  MedusaErrorResponse,
} from './types/medusa';

// ============================================
// Configuration
// ============================================

const BACKEND_URL = getMedusaBackendUrl();

// ============================================
// Error Handling
// ============================================

export class MedusaAPIError extends Error {
  constructor(
    message: string,
    public code: string,
    public type: string,
    public status: number
  ) {
    super(message);
    this.name = 'MedusaAPIError';
  }
}

// ============================================
// Generic Fetch Function
// ============================================

async function medusaFetch<T>(
  endpoint: string,
  options?: RequestInit & { revalidate?: number }
): Promise<T> {
  const url = `${BACKEND_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  // Add publishable key if available
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
  if (publishableKey) {
    headers['x-publishable-api-key'] = publishableKey;
  }

  // Extract revalidate option for Next.js
  const { revalidate, ...fetchOptions } = options || {};
  const nextOptions = revalidate !== undefined ? { next: { revalidate } } : {};

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      ...nextOptions,
      headers,
    });

    if (!response.ok) {
      const errorData: MedusaErrorResponse = await response.json().catch(() => ({
        error: {
          code: 'unknown_error',
          message: response.statusText,
          type: 'api_error',
        },
      }));

      throw new MedusaAPIError(
        errorData.error.message,
        errorData.error.code,
        errorData.error.type,
        response.status
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof MedusaAPIError) {
      throw error;
    }

    // Network or parsing error
    throw new MedusaAPIError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'network_error',
      'network',
      500
    );
  }
}

// ============================================
// Build Query String
// ============================================

function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(`${key}[]`, String(v)));
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        searchParams.append(`${key}[${subKey}]`, String(subValue));
      });
    } else {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

// ============================================
// Raffles API
// ============================================

/**
 * Get all raffles with optional filtering
 * @param params - Query parameters for filtering
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getRaffles(
  params?: RaffleQueryParams,
  revalidate: number = 60
): Promise<RaffleListResponse> {
  const queryString = params ? buildQueryString(params) : '';
  return medusaFetch<RaffleListResponse>(`/store/raffles${queryString}`, { revalidate });
}

/**
 * Get active raffles only
 * @param limit - Maximum number of results
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getActiveRaffles(
  limit: number = 10,
  revalidate: number = 30
): Promise<RaffleListResponse> {
  return getRaffles(
    {
      filters: { status: 'active' },
      limit,
      sort: 'created_at:desc',
    },
    revalidate
  );
}

/**
 * Get completed raffles with winners
 * @param limit - Maximum number of results
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getCompletedRaffles(
  limit: number = 10,
  revalidate: number = 60
): Promise<RaffleListResponse> {
  return getRaffles(
    {
      filters: { status: 'completed' },
      limit,
      sort: 'winner_drawn_at:desc',
    },
    revalidate
  );
}

/**
 * Get a single raffle by ID
 * @param id - Raffle ID
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getRaffleById(
  id: string,
  revalidate: number = 60
): Promise<RaffleResponse> {
  return medusaFetch<RaffleResponse>(`/store/raffles/${id}`, { revalidate });
}

/**
 * Get raffle statistics
 * @param id - Raffle ID
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getRaffleStats(
  id: string,
  revalidate: number = 30
): Promise<RaffleStatsResponse> {
  return medusaFetch<RaffleStatsResponse>(`/store/raffles/${id}/stats`, { revalidate });
}

// ============================================
// Raffle Tickets API
// ============================================

/**
 * Get raffle tickets with optional filtering
 * @param params - Query parameters for filtering
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getRaffleTickets(
  params?: TicketQueryParams,
  revalidate: number = 60
): Promise<RaffleTicketListResponse> {
  const queryString = params ? buildQueryString(params) : '';
  return medusaFetch<RaffleTicketListResponse>(`/store/raffle-tickets${queryString}`, {
    revalidate,
  });
}

/**
 * Get tickets for a specific raffle
 * @param raffleId - Raffle ID
 * @param limit - Maximum number of results
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getTicketsByRaffle(
  raffleId: string,
  limit: number = 100,
  revalidate: number = 60
): Promise<RaffleTicketListResponse> {
  return getRaffleTickets({ raffle_id: raffleId, limit }, revalidate);
}

/**
 * Get tickets for a specific customer
 * @param customerId - Customer ID
 * @param limit - Maximum number of results
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getTicketsByCustomer(
  customerId: string,
  limit: number = 100,
  revalidate: number = 30
): Promise<RaffleTicketListResponse> {
  return getRaffleTickets({ customer_id: customerId, limit }, revalidate);
}

/**
 * Get a single ticket by ID
 * @param id - Ticket ID
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getTicketById(
  id: string,
  revalidate: number = 60
): Promise<RaffleTicketResponse> {
  return medusaFetch<RaffleTicketResponse>(`/store/raffle-tickets/${id}`, { revalidate });
}

/**
 * Purchase raffle tickets (requires authentication)
 * @param raffleId - Raffle ID
 * @param quantity - Number of tickets to purchase
 * @param cartId - Optional cart ID to associate tickets with
 */
export async function purchaseRaffleTickets(
  raffleId: string,
  quantity: number,
  cartId?: string
): Promise<RaffleTicketListResponse> {
  return medusaFetch<RaffleTicketListResponse>(`/store/raffles/${raffleId}/tickets`, {
    method: 'POST',
    body: JSON.stringify({ quantity, cart_id: cartId }),
  });
}

// ============================================
// Winners API
// ============================================

/**
 * Get recent raffle winners
 * @param limit - Maximum number of results
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getRaffleWinners(
  limit: number = 10,
  revalidate: number = 60
): Promise<WinnerListResponse> {
  return medusaFetch<WinnerListResponse>(`/store/raffles/winners?limit=${limit}`, {
    revalidate,
  });
}

/**
 * Get winner for a specific raffle
 * @param raffleId - Raffle ID
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getRaffleWinner(
  raffleId: string,
  revalidate: number = 60
): Promise<WinnerInfo | null> {
  try {
    const response = await medusaFetch<{ winner: WinnerInfo }>(
      `/store/raffles/${raffleId}/winner`,
      { revalidate }
    );
    return response.winner;
  } catch (error) {
    if (error instanceof MedusaAPIError && error.status === 404) {
      return null; // No winner yet
    }
    throw error;
  }
}

// ============================================
// Blockchain Verification API
// ============================================

/**
 * Verify raffle on blockchain
 * @param raffleId - Raffle ID
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function verifyRaffleOnBlockchain(
  raffleId: string,
  revalidate: number = 300
): Promise<BlockchainVerificationResponse> {
  return medusaFetch<BlockchainVerificationResponse>(
    `/store/raffles/${raffleId}/verify`,
    { revalidate }
  );
}

/**
 * Get transaction status on blockchain
 * @param txHash - Transaction hash
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getTransactionStatus(
  txHash: string,
  revalidate: number = 300
): Promise<{
  transaction: {
    hash: string;
    status: 'pending' | 'confirmed' | 'failed';
    block_number?: number;
    confirmations?: number;
  };
}> {
  return medusaFetch<any>(`/store/blockchain/transaction/${txHash}`, { revalidate });
}

/**
 * Get blockchain explorer URL for a transaction
 * @param txHash - Transaction hash
 * @param network - Network (polygon or mumbai)
 * @returns Explorer URL
 */
export function getBlockchainExplorerUrl(
  txHash: string,
  network: 'polygon' | 'mumbai' = 'polygon'
): string {
  const baseUrl =
    network === 'polygon' ? 'https://polygonscan.com' : 'https://mumbai.polygonscan.com';

  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Get blockchain explorer URL for a contract
 * @param contractAddress - Contract address
 * @param network - Network (polygon or mumbai)
 * @returns Explorer URL
 */
export function getContractExplorerUrl(
  contractAddress: string,
  network: 'polygon' | 'mumbai' = 'polygon'
): string {
  const baseUrl =
    network === 'polygon' ? 'https://polygonscan.com' : 'https://mumbai.polygonscan.com';

  return `${baseUrl}/address/${contractAddress}`;
}

// ============================================
// Raffle Draws API
// ============================================

/**
 * Get draw information for a raffle
 * @param raffleId - Raffle ID
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getRaffleDraw(
  raffleId: string,
  revalidate: number = 60
): Promise<RaffleDrawResponse | null> {
  try {
    return await medusaFetch<RaffleDrawResponse>(`/store/raffles/${raffleId}/draw`, {
      revalidate,
    });
  } catch (error) {
    if (error instanceof MedusaAPIError && error.status === 404) {
      return null; // No draw yet
    }
    throw error;
  }
}

// ============================================
// Unified Enhanced Medusa Client Export
// ============================================

export const medusaEnhancedClient = {
  raffles: {
    list: getRaffles,
    getActive: getActiveRaffles,
    getCompleted: getCompletedRaffles,
    getById: getRaffleById,
    getStats: getRaffleStats,
  },
  tickets: {
    list: getRaffleTickets,
    getByRaffle: getTicketsByRaffle,
    getByCustomer: getTicketsByCustomer,
    getById: getTicketById,
    purchase: purchaseRaffleTickets,
  },
  winners: {
    list: getRaffleWinners,
    getByRaffle: getRaffleWinner,
  },
  blockchain: {
    verify: verifyRaffleOnBlockchain,
    getTransactionStatus,
    getExplorerUrl: getBlockchainExplorerUrl,
    getContractUrl: getContractExplorerUrl,
  },
  draws: {
    getByRaffle: getRaffleDraw,
  },
};

export default medusaEnhancedClient;
