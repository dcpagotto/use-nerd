import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { CreateCryptoPaymentDTO } from "../../../types";

/**
 * Admin API Routes for Crypto Payments
 *
 * POST /admin/crypto-payments - Create new crypto payment
 * GET /admin/crypto-payments/:id - Get payment by ID
 * GET /admin/crypto-payments/order/:orderId - Get payment by order ID
 * DELETE /admin/crypto-payments/:id - Cancel payment
 */

/**
 * POST /admin/crypto-payments
 *
 * Create a new cryptocurrency payment.
 * Returns checkout URL where user can pay.
 *
 * @param req - Request with CreateCryptoPaymentDTO in body
 * @param res - Response with payment data
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const cryptoPaymentService = req.scope.resolve("cryptoPaymentService");
    const data = req.body as CreateCryptoPaymentDTO;

    const payment = await cryptoPaymentService.createPayment(data);

    res.json({
      payment,
    });
  } catch (error: any) {
    console.error("Error creating crypto payment:", error);
    res.status(400).json({
      error: error.message || "Failed to create crypto payment",
    });
  }
}

/**
 * GET /admin/crypto-payments/:id
 *
 * Get payment by ID.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const cryptoPaymentService = req.scope.resolve("cryptoPaymentService");
    const { id } = req.params;

    const payment = await cryptoPaymentService.getPayment(id);

    if (!payment) {
      return res.status(404).json({
        error: "Payment not found",
      });
    }

    res.json({
      payment,
    });
  } catch (error: any) {
    console.error("Error fetching crypto payment:", error);
    res.status(500).json({
      error: error.message || "Failed to fetch crypto payment",
    });
  }
}
