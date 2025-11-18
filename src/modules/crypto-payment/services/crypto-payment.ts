import { MedusaService } from "@medusajs/framework/utils";
import CryptoPayment from "../models/crypto-payment";
import {
  CreateCryptoPaymentDTO,
  UpdateCryptoPaymentDTO,
  CryptoPaymentData,
  ICryptoPaymentService,
  CryptoPaymentStatus,
  PaymentProvider,
  CryptoCurrency,
  CoinbaseCommerceWebhook,
} from "../types";
import { createCoinbaseCommerceClient } from "../utils/coinbase-commerce-client";

/**
 * Crypto Payment Service
 *
 * Handles cryptocurrency payment processing via Coinbase Commerce.
 * Users pay through a secure gateway - NO wallet connection needed.
 *
 * Flow:
 * 1. Frontend calls createPayment()
 * 2. Service creates Coinbase Commerce charge
 * 3. User is redirected to hosted_url
 * 4. User pays with any supported cryptocurrency
 * 5. Coinbase sends webhook when payment is confirmed
 * 6. Service updates payment status and notifies order system
 */
export default class CryptoPaymentService
  extends MedusaService({})
  implements ICryptoPaymentService
{
  private coinbaseClient: any;

  constructor(container: any) {
    super(container);

    // Initialize Coinbase Commerce client
    const apiKey = process.env.COINBASE_COMMERCE_API_KEY || "";
    const webhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET || "";

    if (!apiKey || !webhookSecret) {
      console.warn(
        "⚠️  Coinbase Commerce credentials not configured. Crypto payments will not work."
      );
      console.warn(
        "   Set COINBASE_COMMERCE_API_KEY and COINBASE_COMMERCE_WEBHOOK_SECRET in .env"
      );
    } else {
      this.coinbaseClient = createCoinbaseCommerceClient(apiKey, webhookSecret);
      console.log("✅ Coinbase Commerce client initialized");
    }
  }

  /**
   * Create a new cryptocurrency payment
   *
   * Creates a Coinbase Commerce charge and returns checkout URL.
   *
   * @param data - Payment data
   * @returns Payment with checkout URL
   */
  async createPayment(
    data: CreateCryptoPaymentDTO
  ): Promise<CryptoPaymentData> {
    if (!this.coinbaseClient) {
      throw new Error(
        "Coinbase Commerce not configured. Set API key and webhook secret."
      );
    }

    this.validateCreateData(data);

    // Convert cents to decimal for Coinbase Commerce
    const amountDecimal = (data.amount_cents / 100).toFixed(2);

    // Create charge in Coinbase Commerce
    const charge = await this.coinbaseClient.createCharge({
      name: data.description,
      description: data.description,
      local_price: {
        amount: amountDecimal,
        currency: "BRL", // Brazilian Real
      },
      pricing_type: "fixed_price" as const,
      metadata: {
        order_id: data.order_id,
        customer_id: data.customer_id,
        customer_email: data.customer_email,
        customer_name: data.customer_name,
        ...data.metadata,
      },
    });

    // Calculate expiration (Coinbase defaults to 1 hour)
    const expiresAt = new Date(charge.expires_at);

    // Create payment record in database
    const payment = await this.create({
      order_id: data.order_id,
      customer_id: data.customer_id,
      provider: PaymentProvider.COINBASE_COMMERCE,
      provider_charge_id: charge.id,
      provider_checkout_url: charge.hosted_url,
      amount_cents: data.amount_cents,
      status: CryptoPaymentStatus.PENDING,
      expires_at: expiresAt,
      metadata: data.metadata,
    });

    console.log(`✅ Crypto payment created: ${payment.id} for order ${data.order_id}`);
    console.log(`   Coinbase charge: ${charge.id}`);
    console.log(`   Checkout URL: ${charge.hosted_url}`);

    return this.mapToPaymentData(payment);
  }

  /**
   * Get payment by ID
   */
  async getPayment(id: string): Promise<CryptoPaymentData | null> {
    const payment = await this.retrieve(id);
    return payment ? this.mapToPaymentData(payment) : null;
  }

  /**
   * Get payment by order ID
   */
  async getPaymentByOrderId(orderId: string): Promise<CryptoPaymentData | null> {
    const payments = await this.list({
      filters: { order_id: orderId },
    });

    if (payments.length === 0) {
      return null;
    }

    return this.mapToPaymentData(payments[0]);
  }

  /**
   * Update payment
   */
  async updatePayment(
    id: string,
    data: UpdateCryptoPaymentDTO
  ): Promise<CryptoPaymentData> {
    const payment = await this.update(id, data);
    return this.mapToPaymentData(payment);
  }

  /**
   * Cancel payment
   */
  async cancelPayment(id: string): Promise<CryptoPaymentData> {
    const payment = await this.retrieve(id);

    if (!payment) {
      throw new Error(`Payment ${id} not found`);
    }

    // Cancel in Coinbase Commerce if still pending
    if (
      payment.status === CryptoPaymentStatus.PENDING &&
      this.coinbaseClient
    ) {
      try {
        await this.coinbaseClient.cancelCharge(payment.provider_charge_id);
        console.log(`✅ Cancelled Coinbase charge: ${payment.provider_charge_id}`);
      } catch (error) {
        console.error("Failed to cancel Coinbase charge:", error);
      }
    }

    // Update status
    const updated = await this.update(id, {
      status: CryptoPaymentStatus.CANCELLED,
    });

    console.log(`✅ Payment cancelled: ${id}`);
    return this.mapToPaymentData(updated);
  }

  /**
   * Check payment status from provider
   */
  async checkPaymentStatus(id: string): Promise<CryptoPaymentData> {
    const payment = await this.retrieve(id);

    if (!payment) {
      throw new Error(`Payment ${id} not found`);
    }

    if (!this.coinbaseClient) {
      return this.mapToPaymentData(payment);
    }

    // Fetch latest status from Coinbase
    const charge = await this.coinbaseClient.getCharge(
      payment.provider_charge_id
    );

    // Update payment based on charge status
    const updates = this.mapChargeToPaymentUpdates(charge);

    if (Object.keys(updates).length > 0) {
      const updated = await this.update(id, updates);
      console.log(`✅ Payment status updated: ${id} -> ${updates.status}`);
      return this.mapToPaymentData(updated);
    }

    return this.mapToPaymentData(payment);
  }

  /**
   * Handle webhook from Coinbase Commerce
   *
   * Called when Coinbase sends payment confirmation.
   * Webhook events: charge:created, charge:confirmed, charge:failed, etc.
   *
   * @param provider - Payment provider
   * @param payload - Webhook payload
   */
  async handleWebhook(provider: PaymentProvider, payload: any): Promise<void> {
    if (provider !== PaymentProvider.COINBASE_COMMERCE) {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    const webhook = payload as CoinbaseCommerceWebhook;
    const event = webhook.event;
    const charge = event.data;

    console.log(`📨 Webhook received: ${event.type} for charge ${charge.id}`);

    // Find payment by charge ID
    const payments = await this.list({
      filters: { provider_charge_id: charge.id },
    });

    if (payments.length === 0) {
      console.warn(`⚠️  Payment not found for charge: ${charge.id}`);
      return;
    }

    const payment = payments[0];

    // Handle different event types
    switch (event.type) {
      case "charge:created":
        console.log(`   Payment created: ${payment.id}`);
        break;

      case "charge:pending":
        await this.update(payment.id, {
          status: CryptoPaymentStatus.PROCESSING,
        });
        console.log(`   Payment processing: ${payment.id}`);
        break;

      case "charge:confirmed":
        // Payment confirmed on blockchain
        const confirmedUpdates = this.mapChargeToPaymentUpdates(charge);
        await this.update(payment.id, {
          ...confirmedUpdates,
          status: CryptoPaymentStatus.COMPLETED,
          confirmed_at: new Date(),
        });
        console.log(`✅ Payment confirmed: ${payment.id}`);

        // TODO: Notify order service to complete order
        await this.notifyOrderCompletion(payment.order_id);
        break;

      case "charge:failed":
        await this.update(payment.id, {
          status: CryptoPaymentStatus.FAILED,
        });
        console.log(`❌ Payment failed: ${payment.id}`);
        break;

      case "charge:delayed":
        // Payment detected but waiting for confirmations
        await this.update(payment.id, {
          status: CryptoPaymentStatus.PROCESSING,
        });
        console.log(`   Payment delayed (waiting confirmations): ${payment.id}`);
        break;

      default:
        console.log(`   Unhandled event type: ${event.type}`);
    }
  }

  /**
   * Notify order service that payment is complete
   *
   * This should integrate with Medusa order system.
   */
  private async notifyOrderCompletion(orderId: string): Promise<void> {
    try {
      // TODO: Integrate with Medusa Order Service
      // Example:
      // const orderService = this.container.resolve("orderService");
      // await orderService.capturePayment(orderId);

      console.log(`✅ Order completion notified: ${orderId}`);
    } catch (error) {
      console.error(`Failed to notify order completion for ${orderId}:`, error);
    }
  }

  /**
   * Map Coinbase charge to payment updates
   */
  private mapChargeToPaymentUpdates(charge: any): UpdateCryptoPaymentDTO {
    const updates: UpdateCryptoPaymentDTO = {};

    // Check for confirmed payment
    const confirmedPayment = charge.payments?.find(
      (p: any) => p.status === "CONFIRMED"
    );

    if (confirmedPayment) {
      updates.amount_crypto = confirmedPayment.value.crypto.amount;
      updates.currency_crypto = confirmedPayment.value.crypto.currency as CryptoCurrency;
      updates.blockchain_network = confirmedPayment.network;
      updates.blockchain_tx_hash = confirmedPayment.transaction_id;
    }

    // Map timeline to status
    const latestTimeline = charge.timeline?.[charge.timeline.length - 1];
    if (latestTimeline) {
      updates.status = this.mapTimelineStatusToPaymentStatus(
        latestTimeline.status
      );
    }

    return updates;
  }

  /**
   * Map Coinbase timeline status to our payment status
   */
  private mapTimelineStatusToPaymentStatus(
    timelineStatus: string
  ): CryptoPaymentStatus {
    const statusMap: Record<string, CryptoPaymentStatus> = {
      NEW: CryptoPaymentStatus.PENDING,
      PENDING: CryptoPaymentStatus.PROCESSING,
      COMPLETED: CryptoPaymentStatus.COMPLETED,
      EXPIRED: CryptoPaymentStatus.FAILED,
      UNRESOLVED: CryptoPaymentStatus.PROCESSING,
      RESOLVED: CryptoPaymentStatus.COMPLETED,
      CANCELED: CryptoPaymentStatus.CANCELLED,
    };

    return statusMap[timelineStatus] || CryptoPaymentStatus.PENDING;
  }

  /**
   * Validate create payment data
   */
  private validateCreateData(data: CreateCryptoPaymentDTO): void {
    if (!data.order_id) {
      throw new Error("order_id is required");
    }

    if (!data.amount_cents || data.amount_cents <= 0) {
      throw new Error("amount_cents must be greater than 0");
    }

    if (!data.description) {
      throw new Error("description is required");
    }

    // Minimum amount: R$ 1.00 (100 cents)
    if (data.amount_cents < 100) {
      throw new Error("Minimum amount is R$ 1.00");
    }

    // Maximum amount: R$ 1,000,000.00 (100000000 cents)
    if (data.amount_cents > 100000000) {
      throw new Error("Maximum amount is R$ 1,000,000.00");
    }
  }

  /**
   * Map database model to payment data
   */
  private mapToPaymentData(payment: any): CryptoPaymentData {
    return {
      id: payment.id,
      order_id: payment.order_id,
      customer_id: payment.customer_id,
      provider: payment.provider,
      provider_charge_id: payment.provider_charge_id,
      provider_checkout_url: payment.provider_checkout_url,
      amount_cents: payment.amount_cents,
      amount_crypto: payment.amount_crypto,
      currency_crypto: payment.currency_crypto,
      status: payment.status,
      blockchain_network: payment.blockchain_network,
      blockchain_tx_hash: payment.blockchain_tx_hash,
      blockchain_confirmations: payment.blockchain_confirmations,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      expires_at: payment.expires_at,
      confirmed_at: payment.confirmed_at,
      metadata: payment.metadata,
    };
  }
}
