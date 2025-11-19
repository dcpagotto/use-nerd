import crypto from "crypto";
import {
  CoinbaseCommerceCharge,
  ICoinbaseCommerceClient,
} from "../types";

/**
 * Coinbase Commerce API Client
 *
 * Handles communication with Coinbase Commerce API for cryptocurrency payments.
 *
 * Docs: https://docs.cloud.coinbase.com/commerce/docs
 */
export class CoinbaseCommerceClient implements ICoinbaseCommerceClient {
  private apiKey: string;
  private baseUrl: string = "https://api.commerce.coinbase.com";
  private apiVersion: string = "2018-03-22";
  private webhookSecret: string;

  constructor(apiKey: string, webhookSecret: string) {
    if (!apiKey) {
      throw new Error("Coinbase Commerce API key is required");
    }
    if (!webhookSecret) {
      throw new Error("Coinbase Commerce webhook secret is required");
    }

    this.apiKey = apiKey;
    this.webhookSecret = webhookSecret;
  }

  /**
   * Make request to Coinbase Commerce API
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-CC-Api-Key": this.apiKey,
      "X-CC-Version": this.apiVersion,
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          `Coinbase Commerce API error: ${response.status} - ${
            error.error?.message || response.statusText
          }`
        );
      }

      const result = await response.json();
      return result.data as T;
    } catch (error) {
      console.error("Coinbase Commerce request failed:", error);
      throw error;
    }
  }

  /**
   * Create a charge (payment)
   *
   * @param params - Charge parameters
   * @returns Created charge
   */
  async createCharge(params: {
    name: string;
    description: string;
    local_price: {
      amount: string;
      currency: string;
    };
    pricing_type: "fixed_price";
    metadata?: Record<string, any>;
    redirect_url?: string;
    cancel_url?: string;
  }): Promise<CoinbaseCommerceCharge> {
    return this.request<CoinbaseCommerceCharge>("POST", "/charges", params);
  }

  /**
   * Get charge by ID
   *
   * @param chargeId - Charge ID
   * @returns Charge data
   */
  async getCharge(chargeId: string): Promise<CoinbaseCommerceCharge> {
    return this.request<CoinbaseCommerceCharge>("GET", `/charges/${chargeId}`);
  }

  /**
   * Cancel charge
   *
   * @param chargeId - Charge ID
   * @returns Cancelled charge
   */
  async cancelCharge(chargeId: string): Promise<CoinbaseCommerceCharge> {
    return this.request<CoinbaseCommerceCharge>(
      "POST",
      `/charges/${chargeId}/cancel`
    );
  }

  /**
   * List all charges
   *
   * @param options - Pagination options
   * @returns List of charges
   */
  async listCharges(options?: {
    limit?: number;
    starting_after?: string;
  }): Promise<{ data: CoinbaseCommerceCharge[]; pagination: any }> {
    const params = new URLSearchParams();
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.starting_after)
      params.append("starting_after", options.starting_after);

    const queryString = params.toString();
    const endpoint = queryString ? `/charges?${queryString}` : "/charges";

    return this.request<any>("GET", endpoint);
  }

  /**
   * Verify webhook signature
   *
   * Coinbase Commerce signs webhook events with your webhook secret.
   * Always verify the signature before processing webhook events.
   *
   * @param payload - Raw webhook payload (string)
   * @param signature - X-CC-Webhook-Signature header value
   * @returns True if signature is valid
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const hmac = crypto.createHmac("sha256", this.webhookSecret);
      hmac.update(payload);
      const digest = hmac.digest("hex");

      // Constant-time comparison to prevent timing attacks
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
      );
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return false;
    }
  }

  /**
   * Parse webhook payload safely
   *
   * @param payload - Raw webhook payload
   * @param signature - Webhook signature
   * @returns Parsed webhook data or null if invalid
   */
  parseWebhook(payload: string, signature: string): any | null {
    if (!this.verifyWebhookSignature(payload, signature)) {
      console.error("Invalid webhook signature");
      return null;
    }

    try {
      return JSON.parse(payload);
    } catch (error) {
      console.error("Failed to parse webhook payload:", error);
      return null;
    }
  }
}

/**
 * Create Coinbase Commerce client instance
 *
 * @param apiKey - Coinbase Commerce API key
 * @param webhookSecret - Webhook shared secret
 * @returns Client instance
 */
export function createCoinbaseCommerceClient(
  apiKey: string,
  webhookSecret: string
): CoinbaseCommerceClient {
  return new CoinbaseCommerceClient(apiKey, webhookSecret);
}

export default CoinbaseCommerceClient;
