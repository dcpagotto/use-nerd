import { Module } from "@medusajs/framework/utils";
import CryptoPaymentService from "./services/crypto-payment";
import CryptoPayment from "./models/crypto-payment";

/**
 * Crypto Payment Module
 *
 * Phase 1: Cryptocurrency Payment Gateway Integration
 *
 * This module enables cryptocurrency payments via Coinbase Commerce.
 * Users don't need to connect wallets - they pay through a secure gateway.
 *
 * Features:
 * - Create crypto payment charges
 * - Redirect users to hosted checkout
 * - Accept Bitcoin, Ethereum, USDT, MATIC, and more
 * - Receive webhook confirmations
 * - Track payment status
 * - Integrate with Medusa orders
 *
 * Setup:
 * 1. Create account at commerce.coinbase.com
 * 2. Get API key and webhook secret
 * 3. Set environment variables:
 *    - COINBASE_COMMERCE_API_KEY
 *    - COINBASE_COMMERCE_WEBHOOK_SECRET
 * 4. Configure webhook URL: https://your-domain.com/crypto-payments/webhooks/coinbase
 *
 * Usage:
 * const cryptoPaymentService = req.scope.resolve("cryptoPaymentService");
 * const payment = await cryptoPaymentService.createPayment({
 *   order_id: "order_123",
 *   amount_cents: 10000, // R$ 100.00
 *   description: "Order #123",
 * });
 * // Redirect user to: payment.provider_checkout_url
 */

export const CRYPTO_PAYMENT_MODULE = "cryptoPaymentModule";

export default Module(CRYPTO_PAYMENT_MODULE, {
  service: CryptoPaymentService,
});

// Export types
export * from "./types";

// Export models
export { CryptoPayment };

// Export service
export { CryptoPaymentService };
