import { model } from "@medusajs/framework/utils";
import { CryptoPaymentStatus, PaymentProvider, CryptoCurrency } from "../types";

/**
 * CryptoPayment Model
 *
 * Stores cryptocurrency payment information processed via
 * Coinbase Commerce or other payment gateways.
 *
 * Users DON'T connect wallets - payments go through secure gateways.
 */
const CryptoPayment = model.define("crypto_payment", {
  id: model.id().primaryKey(),

  // Relations
  order_id: model.text(),
  customer_id: model.text().nullable(),

  // Provider information
  provider: model.enum(PaymentProvider).default(PaymentProvider.COINBASE_COMMERCE),
  provider_charge_id: model.text(), // Coinbase Commerce charge ID
  provider_checkout_url: model.text(), // URL to redirect user for payment

  // Payment amounts
  amount_cents: model.number(), // Amount in cents (BRL or USD)
  amount_crypto: model.text().nullable(), // Amount in cryptocurrency (e.g., "0.0012 BTC")
  currency_crypto: model.enum(CryptoCurrency).nullable(), // Cryptocurrency used

  // Status
  status: model.enum(CryptoPaymentStatus).default(CryptoPaymentStatus.PENDING),

  // Blockchain information (filled after payment confirmation)
  blockchain_network: model.text().nullable(), // e.g., "ethereum", "bitcoin", "polygon"
  blockchain_tx_hash: model.text().nullable(), // Transaction hash on blockchain
  blockchain_confirmations: model.number().nullable(), // Number of block confirmations

  // Timestamps
  expires_at: model.dateTime(), // Payment expiration (usually 1 hour from creation)
  confirmed_at: model.dateTime().nullable(), // When payment was confirmed

  // Additional metadata
  metadata: model.json().nullable(),
})
  .indexes([
    {
      on: ["order_id"],
      name: "IDX_crypto_payment_order",
    },
    {
      on: ["customer_id"],
      name: "IDX_crypto_payment_customer",
    },
    {
      on: ["provider_charge_id"],
      unique: true,
      name: "IDX_crypto_payment_provider_charge",
    },
    {
      on: ["status"],
      name: "IDX_crypto_payment_status",
    },
    {
      on: ["blockchain_tx_hash"],
      name: "IDX_crypto_payment_tx_hash",
    },
  ]);

export default CryptoPayment;
