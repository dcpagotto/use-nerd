import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createPixPaymentWorkflow } from "../../../../workflows";

/**
 * POST /store/brazil/pix/create
 *
 * Cria um pagamento PIX para um pedido
 *
 * Body:
 * {
 *   order_id: string;
 *   amount: number;
 *   payer_name: string;
 *   payer_email: string;
 *   payer_cpf_cnpj: string;
 *   description?: string;
 *   expires_in_minutes?: number;
 * }
 *
 * Response:
 * {
 *   payment: PixPayment;
 *   qr_code: string;
 *   qr_code_text: string;
 * }
 */
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const {
    order_id,
    amount,
    payer_name,
    payer_email,
    payer_cpf_cnpj,
    description,
    expires_in_minutes,
  } = req.body;

  // Validar campos obrigatórios
  if (!order_id || !amount || !payer_name || !payer_email || !payer_cpf_cnpj) {
    res.status(400).json({
      error: "Missing required fields",
    });
    return;
  }

  try {
    const { result } = await createPixPaymentWorkflow(req.scope).run({
      input: {
        order_id,
        amount,
        payer_name,
        payer_email,
        payer_cpf_cnpj,
        description,
        expires_in_minutes,
      },
    });

    res.status(200).json({
      payment: result.payment,
      qr_code: result.qr_code,
      qr_code_text: result.qr_code_text,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
