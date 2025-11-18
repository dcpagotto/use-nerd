/**
 * Medusa API Service
 *
 * Unified API service that works with or without publishable key.
 * Falls back to direct fetch calls when SDK is not configured.
 */

import { medusaClient, getMedusaBackendUrl, isMedusaConfigured } from './medusa-client';

const BACKEND_URL = getMedusaBackendUrl();

/**
 * Generic fetch wrapper for Medusa API
 */
async function medusaFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BACKEND_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add publishable key if available
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
  if (publishableKey) {
    headers['x-publishable-api-key'] = publishableKey;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Products API
 */
export const productsApi = {
  /**
   * List all products
   */
  async list(params?: {
    limit?: number;
    offset?: number;
    category_id?: string[];
    collection_id?: string[];
    tags?: string[];
    q?: string; // search query
  }) {
    try {
      const queryParams = new URLSearchParams();

      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      if (params?.q) queryParams.append('q', params.q);
      if (params?.category_id) {
        params.category_id.forEach(id => queryParams.append('category_id[]', id));
      }
      if (params?.collection_id) {
        params.collection_id.forEach(id => queryParams.append('collection_id[]', id));
      }
      if (params?.tags) {
        params.tags.forEach(tag => queryParams.append('tags[]', tag));
      }

      const query = queryParams.toString();
      const endpoint = `/store/products${query ? `?${query}` : ''}`;

      return await medusaFetch<{ products: any[]; count: number; offset: number; limit: number }>(endpoint);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Get single product by ID or handle
   */
  async retrieve(idOrHandle: string) {
    try {
      // Detect if it's an ID (starts with prod_) or a handle
      const endpoint = idOrHandle.startsWith('prod_')
        ? `/store/products/${idOrHandle}`
        : `/store/products/by-handle/${idOrHandle}`;

      return await medusaFetch<{ product: any }>(endpoint);
    } catch (error) {
      console.error(`Error fetching product ${idOrHandle}:`, error);
      throw error;
    }
  },

  /**
   * Get featured products
   * Uses products tagged with "destaque" or "featured", or random products as fallback
   */
  async getFeatured(params?: { limit?: number; random?: boolean }) {
    try {
      const queryParams = new URLSearchParams();

      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.random) queryParams.append('random', 'true');

      const query = queryParams.toString();
      const endpoint = `/store/products/featured${query ? `?${query}` : ''}`;

      return await medusaFetch<{
        products: any[];
        count: number;
        strategy: 'tagged' | 'random' | 'random_fallback';
      }>(endpoint);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },
};

/**
 * Regions API
 */
export const regionsApi = {
  /**
   * List all regions
   */
  async list() {
    try {
      return await medusaFetch<{ regions: any[] }>('/store/regions');
    } catch (error) {
      console.error('Error fetching regions:', error);
      throw error;
    }
  },

  /**
   * Get single region by ID
   */
  async retrieve(id: string) {
    try {
      return await medusaFetch<{ region: any }>(`/store/regions/${id}`);
    } catch (error) {
      console.error(`Error fetching region ${id}:`, error);
      throw error;
    }
  },
};

/**
 * Collections API
 */
export const collectionsApi = {
  /**
   * List all collections
   */
  async list(params?: { limit?: number; offset?: number }) {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const query = queryParams.toString();
      const endpoint = `/store/collections${query ? `?${query}` : ''}`;

      return await medusaFetch<{ collections: any[]; count: number }>(endpoint);
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  },

  /**
   * Get single collection by ID
   */
  async retrieve(id: string, params?: { fields?: string }) {
    try {
      const queryParams = new URLSearchParams();
      if (params?.fields) queryParams.append('fields', params.fields);

      const query = queryParams.toString();
      const endpoint = `/store/collections/${id}${query ? `?${query}` : ''}`;

      return await medusaFetch<{ collection: any }>(endpoint);
    } catch (error) {
      console.error(`Error fetching collection ${id}:`, error);
      throw error;
    }
  },
};

/**
 * Categories API
 */
export const categoriesApi = {
  /**
   * List all categories
   */
  async list(params?: { limit?: number; offset?: number; parent_category_id?: string }) {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      if (params?.parent_category_id) queryParams.append('parent_category_id', params.parent_category_id);

      const query = queryParams.toString();
      const endpoint = `/store/categories${query ? `?${query}` : ''}`;

      return await medusaFetch<{ product_categories: any[]; count: number }>(endpoint);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Get single category by ID
   */
  async retrieve(id: string) {
    try {
      return await medusaFetch<{ product_category: any }>(`/store/categories/${id}`);
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },
};

/**
 * Cart API
 */
export const cartApi = {
  /**
   * Create a new cart
   */
  async create(data?: { region_id?: string; sales_channel_id?: string }) {
    try {
      return await medusaFetch<{ cart: any }>('/store/carts', {
        method: 'POST',
        body: JSON.stringify(data || {}),
      });
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  },

  /**
   * Retrieve cart by ID
   */
  async retrieve(id: string) {
    try {
      return await medusaFetch<{ cart: any }>(`/store/carts/${id}`);
    } catch (error) {
      console.error(`Error fetching cart ${id}:`, error);
      throw error;
    }
  },

  /**
   * Add line item to cart
   */
  async addLineItem(cartId: string, data: { variant_id: string; quantity: number }) {
    try {
      return await medusaFetch<{ cart: any }>(`/store/carts/${cartId}/line-items`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },

  /**
   * Update line item quantity
   */
  async updateLineItem(cartId: string, lineId: string, data: { quantity: number }) {
    try {
      return await medusaFetch<{ cart: any }>(`/store/carts/${cartId}/line-items/${lineId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  /**
   * Remove line item from cart
   */
  async deleteLineItem(cartId: string, lineId: string) {
    try {
      return await medusaFetch<{ cart: any }>(`/store/carts/${cartId}/line-items/${lineId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  },

  /**
   * Complete cart (checkout)
   */
  async complete(cartId: string) {
    try {
      return await medusaFetch<{ type: string; data: any }>(`/store/carts/${cartId}/complete`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error completing cart:', error);
      throw error;
    }
  },

  /**
   * Add shipping address
   */
  async updateShippingAddress(cartId: string, address: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    country_code: string;
    province?: string;
    postal_code: string;
    phone?: string;
  }) {
    try {
      return await medusaFetch<{ cart: any }>(`/store/carts/${cartId}`, {
        method: 'POST',
        body: JSON.stringify({ shipping_address: address }),
      });
    } catch (error) {
      console.error('Error updating shipping address:', error);
      throw error;
    }
  },

  /**
   * Add billing address
   */
  async updateBillingAddress(cartId: string, address: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    country_code: string;
    province?: string;
    postal_code: string;
    phone?: string;
  }) {
    try {
      return await medusaFetch<{ cart: any }>(`/store/carts/${cartId}`, {
        method: 'POST',
        body: JSON.stringify({ billing_address: address }),
      });
    } catch (error) {
      console.error('Error updating billing address:', error);
      throw error;
    }
  },

  /**
   * Add email to cart
   */
  async updateEmail(cartId: string, email: string) {
    try {
      return await medusaFetch<{ cart: any }>(`/store/carts/${cartId}`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      console.error('Error updating cart email:', error);
      throw error;
    }
  },

  /**
   * Initialize payment sessions
   */
  async createPaymentSessions(cartId: string) {
    try {
      return await medusaFetch<{ cart: any }>(`/store/carts/${cartId}/payment-sessions`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error creating payment sessions:', error);
      throw error;
    }
  },

  /**
   * Select payment session
   */
  async selectPaymentSession(cartId: string, providerId: string) {
    try {
      return await medusaFetch<{ cart: any }>(`/store/carts/${cartId}/payment-session`, {
        method: 'POST',
        body: JSON.stringify({ provider_id: providerId }),
      });
    } catch (error) {
      console.error('Error selecting payment session:', error);
      throw error;
    }
  },
};

/**
 * Orders API
 */
export const ordersApi = {
  /**
   * Retrieve order by ID
   */
  async retrieve(id: string) {
    try {
      return await medusaFetch<{ order: any }>(`/store/orders/${id}`);
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },

  /**
   * Lookup order by cart ID
   */
  async lookupByCartId(cartId: string) {
    try {
      return await medusaFetch<{ order: any }>(`/store/orders/cart/${cartId}`);
    } catch (error) {
      console.error(`Error looking up order for cart ${cartId}:`, error);
      throw error;
    }
  },
};

/**
 * Export unified API
 */
export const medusaApi = {
  products: productsApi,
  regions: regionsApi,
  collections: collectionsApi,
  categories: categoriesApi,
  cart: cartApi,
  orders: ordersApi,
};

export default medusaApi;
