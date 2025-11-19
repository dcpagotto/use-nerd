import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PaymentProvider } from "../../../types";

/**
 * Coinbase Commerce Webhook Handler
 *
 * POST /crypto-payments/webhooks/coinbase
 *
 * This endpoint receives webhooks from Coinbase Commerce when:
 * - Payment is created
 * - Payment is pending (user initiated payment)
 * - Payment is confirmed (blockchain confirmed)
 * - Payment failed or expired
 *
 * Security:
 * - Webhook signature is verified using HMAC SHA-256
 * - Only processes requests with valid signatures
 *
 * Events handled:
 * - charge:created
 * - charge:pending
 * - charge:confirmed (PAYMENT COMPLETE)
 * - charge:failed
 * - charge:delayed (waiting for confirmations)
 */

/**
 * POST /crypto-payments/webhooks/coinbase
 *
 * Handle Coinbase Commerce webhook
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const cryptoPaymentService = req.scope.resolve("cryptoPaymentService");

    // Get signature from header
    const signature = req.headers["x-cc-webhook-signature"] as string;

    if (!signature) {
      console.error("⚠️  Webhook signature missing");
      return res.status(400).json({
        error: "Webhook signature missing",
      });
    }

    // Get raw body for signature verification
    // Note: Medusa should be configured to preserve raw body for webhooks
    const rawBody = JSON.stringify(req.body);

    // Verify signature before processing
    const coinbaseClient = (cryptoPaymentService as any).coinbaseClient;
    if (!coinbaseClient) {
      console.error("⚠️  Coinbase Commerce client not initialized");
      return res.status(500).json({
        error: "Coinbase Commerce not configured",
      });
    }

    const isValid = coinbaseClient.verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      console.error("⚠️  Invalid webhook signature");
      return res.status(401).json({
        error: "Invalid webhook signature",
      });
    }

    // Signature valid - process webhook
    console.log("✅ Webhook signature verified");

    await cryptoPaymentService.handleWebhook(
      PaymentProvider.COINBASE_COMMERCE,
      req.body
    );

    // Always return 200 to Coinbase (they'll retry on error)
    res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    console.error("Error processing Coinbase webhook:", error);

    // Return 200 to prevent retries for our internal errors
    // Log the error for debugging
    res.status(200).json({
      success: false,
      error: error.message,
    });
  }
}
