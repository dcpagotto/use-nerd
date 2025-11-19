import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { calculateShippingWorkflow } from "../../../../workflows";

/**
 * POST /store/brazil/shipping/calculate
 *
 * Calcula frete para múltiplas transportadoras
 *
 * Body:
 * {
 *   from_postal_code: string;
 *   to_postal_code: string;
 *   packages: Array<{
 *     height: number;
 *     width: number;
 *     length: number;
 *     weight: number;
 *     insurance_value?: number;
 *   }>;
 * }
 *
 * Response:
 * {
 *   quotes: Array<{
 *     company: ShippingCompany;
 *     service_name: string;
 *     price: number;
 *     delivery_min: number;
 *     delivery_max: number;
 *   }>;
 * }
 */
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const { from_postal_code, to_postal_code, packages } = req.body;

  // Validar campos obrigatórios
  if (!from_postal_code || !to_postal_code || !packages || packages.length === 0) {
    res.status(400).json({
      error: "Missing required fields",
    });
    return;
  }

  try {
    const { result } = await calculateShippingWorkflow(req.scope).run({
      input: {
        from_postal_code,
        to_postal_code,
        packages,
      },
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
