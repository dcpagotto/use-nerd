import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { generateNFeWorkflow } from "../../../../../workflows";

/**
 * POST /admin/brazil/nfe/:orderId/generate
 *
 * Gera NFe manualmente para um pedido
 *
 * Response:
 * {
 *   nfe: NFe;
 *   pdf_url?: string;
 *   xml_url?: string;
 * }
 */
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const { orderId } = req.params;

  try {
    const { result } = await generateNFeWorkflow(req.scope).run({
      input: {
        order_id: orderId,
      },
    });

    res.status(200).json({
      nfe: result.nfe,
      pdf_url: result.pdf_url,
      xml_url: result.xml_url,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
