import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { BRAZIL_MODULE } from "../../../../../index";
import type PixPaymentService from "../../../../../services/pix-payment";

/**
 * GET /store/brazil/pix/:id/status
 *
 * Verifica status de um pagamento PIX
 *
 * Response:
 * {
 *   payment_id: string;
 *   status: PixPaymentStatus;
 *   paid_at?: Date;
 * }
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const { id } = req.params;

  const pixPaymentService: PixPaymentService = req.scope.resolve(
    `${BRAZIL_MODULE}.pix-payment`
  );

  try {
    const payment = await pixPaymentService.getPixPayment(id);

    if (!payment) {
      res.status(404).json({
        error: "Payment not found",
      });
      return;
    }

    res.status(200).json({
      payment_id: payment.id,
      status: payment.status,
      paid_at: payment.paid_at,
      expires_at: payment.expires_at,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
