/**
 * Crypto Payment Module Types
 *
 * Phase 1: Cryptocurrency Payment Gateway Integration
 *
 * This module handles cryptocurrency payments via Coinbase Commerce.
 * Users DON'T need to connect their wallets - payments are processed
 * through a secure gateway that accepts multiple cryptocurrencies.
 */

/**
 * Crypto Payment Status
 */
export enum CryptoPaymentStatus {
  PENDING = "pending",           // Payment created, waiting for user
  PROCESSING = "processing",     // User is paying
  COMPLETED = "completed",       // Payment confirmed on blockchain
  FAILED = "failed",            // Payment failed or expired
  CANCELLED = "cancelled",      // User cancelled
  REFUNDED = "refunded",        // Payment refunded
}

/**
 * Supported Cryptocurrencies
 * (Coinbase Commerce accepts these automatically)
 */
export enum CryptoCurrency {
  BTC = "BTC",       // Bitcoin
  ETH = "ETH",       // Ethereum
  USDT = "USDT",     // Tether (ERC-20)
  USDC = "USDC",     // USD Coin
  DAI = "DAI",       // Dai Stablecoin
  LTC = "LTC",       // Litecoin
  BCH = "BCH",       // Bitcoin Cash
  MATIC = "MATIC",   // Polygon
  DOGE = "DOGE",     // Dogecoin
}

/**
 * Payment Provider
 */
export enum PaymentProvider {
  COINBASE_COMMERCE = "coinbase_commerce",
  BITPAY = "bitpay",  // Future support
}

/**
 * Crypto Payment Data
 */
export interface CryptoPaymentData {
  id: string;
  order_id: string;
  customer_id?: string;

  // Provider info
  provider: PaymentProvider;
  provider_charge_id: string;        // Coinbase Commerce charge ID
  provider_checkout_url: string;     // URL to redirect user

  // Payment details
  amount_cents: number;              // Amount in cents (BRL)
  amount_crypto?: string;            // Amount in cryptocurrency
  currency_crypto?: CryptoCurrency;  // Cryptocurrency used

  // Status
  status: CryptoPaymentStatus;

  // Blockchain info (filled after payment)
  blockchain_network?: string;       // e.g., "ethereum", "bitcoin", "polygon"
  blockchain_tx_hash?: string;       // Transaction hash
  blockchain_confirmations?: number; // Number of confirmations

  // Timestamps
  created_at: Date;
  updated_at: Date;
  expires_at: Date;                  // Payment expiration (usually 1 hour)
  confirmed_at?: Date;               // When payment was confirmed

  // Metadata
  metadata?: Record<string, any>;
}

/**
 * DTO: Create Crypto Payment
 */
export interface CreateCryptoPaymentDTO {
  order_id: string;
  customer_id?: string;
  amount_cents: number;
  description: string;
  customer_email?: string;
  customer_name?: string;
  metadata?: Record<string, any>;
}

/**
 * DTO: Update Crypto Payment
 */
export interface UpdateCryptoPaymentDTO {
  status?: CryptoPaymentStatus;
  amount_crypto?: string;
  currency_crypto?: CryptoCurrency;
  blockchain_network?: string;
  blockchain_tx_hash?: string;
  blockchain_confirmations?: number;
  confirmed_at?: Date;
  metadata?: Record<string, any>;
}

/**
 * Coinbase Commerce Charge (external API response)
 */
export interface CoinbaseCommerceCharge {
  id: string;
  resource: string;
  code: string;
  name: string;
  description: string;
  pricing_type: string;

  local_price: {
    amount: string;
    currency: string;
  };

  pricing: {
    [key: string]: {
      amount: string;
      currency: string;
    };
  };

  payments: Array<{
    network: string;
    transaction_id: string;
    status: string;
    value: {
      local: {
        amount: string;
        currency: string;
      };
      crypto: {
        amount: string;
        currency: string;
      };
    };
  }>;

  timeline: Array<{
    time: string;
    status: string;
    context?: string;
  }>;

  hosted_url: string;
  expires_at: string;
  created_at: string;
  updated_at: string;

  metadata?: Record<string, any>;
}

/**
 * Coinbase Commerce Webhook Event
 */
export interface CoinbaseCommerceWebhook {
  id: string;
  scheduled_for: string;
  attempt_number: number;
  event: {
    id: string;
    resource: string;
    type: string;  // e.g., "charge:confirmed", "charge:failed"
    api_version: string;
    created_at: string;
    data: CoinbaseCommerceCharge;
  };
}

/**
 * Crypto Payment Service Interface
 */
export interface ICryptoPaymentService {
  /**
   * Create a new cryptocurrency payment
   */
  createPayment(data: CreateCryptoPaymentDTO): Promise<CryptoPaymentData>;

  /**
   * Get payment by ID
   */
  getPayment(id: string): Promise<CryptoPaymentData | null>;

  /**
   * Get payment by order ID
   */
  getPaymentByOrderId(orderId: string): Promise<CryptoPaymentData | null>;

  /**
   * Update payment status
   */
  updatePayment(id: string, data: UpdateCryptoPaymentDTO): Promise<CryptoPaymentData>;

  /**
   * Cancel payment
   */
  cancelPayment(id: string): Promise<CryptoPaymentData>;

  /**
   * Handle webhook from payment provider
   */
  handleWebhook(provider: PaymentProvider, payload: any): Promise<void>;

  /**
   * Check payment status from provider
   */
  checkPaymentStatus(id: string): Promise<CryptoPaymentData>;
}

/**
 * Coinbase Commerce Client Interface
 */
export interface ICoinbaseCommerceClient {
  /**
   * Create a charge (payment)
   */
  createCharge(params: {
    name: string;
    description: string;
    local_price: {
      amount: string;
      currency: string;
    };
    pricing_type: "fixed_price";
    metadata?: Record<string, any>;
  }): Promise<CoinbaseCommerceCharge>;

  /**
   * Get charge by ID
   */
  getCharge(chargeId: string): Promise<CoinbaseCommerceCharge>;

  /**
   * Cancel charge
   */
  cancelCharge(chargeId: string): Promise<CoinbaseCommerceCharge>;

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean;
}

export default {
  CryptoPaymentStatus,
  CryptoCurrency,
  PaymentProvider,
};
