import Medusa from '@medusajs/js-sdk';

/**
 * Medusa JS SDK Client Configuration
 *
 * This client is used to interact with the Medusa backend API.
 * It handles authentication, cart management, orders, and custom modules.
 */

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

// Initialize Medusa client
export const medusaClient = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === 'development',
  publishableKey: MEDUSA_PUBLISHABLE_KEY,
});

/**
 * Helper to check if Medusa client is properly configured
 */
export function isMedusaConfigured(): boolean {
  return !!MEDUSA_PUBLISHABLE_KEY;
}

/**
 * Get Medusa backend URL
 */
export function getMedusaBackendUrl(): string {
  return MEDUSA_BACKEND_URL;
}

/**
 * Medusa API helper functions
 */

/**
 * Get all products with optional filters
 */
export async function getProducts(params?: {
  limit?: number;
  offset?: number;
  category_id?: string;
  collection_id?: string;
  tags?: string[];
}) {
  try {
    const response = await medusaClient.store.product.list(params);
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Get a single product by ID
 */
export async function getProduct(id: string) {
  try {
    const response = await medusaClient.store.product.retrieve(id);
    return response;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
}

/**
 * Get or create a cart
 */
export async function getOrCreateCart(cartId?: string) {
  try {
    if (cartId) {
      const response = await medusaClient.store.cart.retrieve(cartId);
      return response;
    }
    const response = await medusaClient.store.cart.create({
      region_id: process.env.NEXT_PUBLIC_MEDUSA_REGION_ID,
    });
    return response;
  } catch (error) {
    console.error('Error managing cart:', error);
    throw error;
  }
}

/**
 * Add item to cart
 */
export async function addToCart(cartId: string, variantId: string, quantity: number = 1) {
  try {
    const response = await medusaClient.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity,
    });
    return response;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

/**
 * Update cart line item
 */
export async function updateCartItem(cartId: string, lineId: string, quantity: number) {
  try {
    const response = await medusaClient.store.cart.updateLineItem(cartId, lineId, {
      quantity,
    });
    return response;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(cartId: string, lineId: string) {
  try {
    const response = await medusaClient.store.cart.deleteLineItem(cartId, lineId);
    return response;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

/**
 * Get product collections
 */
export async function getCollections(params?: { limit?: number; offset?: number }) {
  try {
    const response = await medusaClient.store.collection.list(params);
    return response;
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
}

/**
 * Get product categories
 */
export async function getCategories(params?: { limit?: number; offset?: number }) {
  try {
    const response = await medusaClient.store.category.list(params);
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Get regions (for Brazilian market - BRL currency)
 */
export async function getRegions() {
  try {
    const response = await medusaClient.store.region.list();
    return response;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
}

/**
 * Custom module API calls
 * These will be implemented as the custom modules are developed
 */

// Raffle Module
export const raffleApi = {
  /**
   * Get active raffles
   */
  async getActiveRaffles() {
    try {
      const response = await fetch(`${MEDUSA_BACKEND_URL}/store/raffles/active`);
      return response.json();
    } catch (error) {
      console.error('Error fetching active raffles:', error);
      throw error;
    }
  },

  /**
   * Get raffle by ID
   */
  async getRaffle(id: string) {
    try {
      const response = await fetch(`${MEDUSA_BACKEND_URL}/store/raffles/${id}`);
      return response.json();
    } catch (error) {
      console.error(`Error fetching raffle ${id}:`, error);
      throw error;
    }
  },

  /**
   * Purchase raffle tickets
   */
  async purchaseTickets(raffleId: string, quantity: number, cartId: string) {
    try {
      const response = await fetch(`${MEDUSA_BACKEND_URL}/store/raffles/${raffleId}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity, cart_id: cartId }),
      });
      return response.json();
    } catch (error) {
      console.error('Error purchasing raffle tickets:', error);
      throw error;
    }
  },
};

// Blockchain Module
export const blockchainApi = {
  /**
   * Verify raffle on blockchain
   */
  async verifyRaffle(raffleId: string) {
    try {
      const response = await fetch(`${MEDUSA_BACKEND_URL}/store/blockchain/verify/${raffleId}`);
      return response.json();
    } catch (error) {
      console.error('Error verifying raffle:', error);
      throw error;
    }
  },

  /**
   * Get transaction status
   */
  async getTransactionStatus(txHash: string) {
    try {
      const response = await fetch(
        `${MEDUSA_BACKEND_URL}/store/blockchain/transaction/${txHash}`
      );
      return response.json();
    } catch (error) {
      console.error('Error fetching transaction status:', error);
      throw error;
    }
  },
};

export default medusaClient;
