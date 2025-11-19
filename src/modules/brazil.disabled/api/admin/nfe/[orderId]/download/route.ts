import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { BRAZIL_MODULE } from "../../../../../index";
import type NFeService from "../../../../../services/nfe";

/**
 * Type-safe interface for NFe entity
 * Workaround for DmlEntity not exposing properties directly
 */
interface NFeEntity {
  id: string;
  order_id: string;
  status: string;
  nfe_number?: string;
  nfe_key?: string;
  pdf_url?: string;
  xml_url?: string;
  protocol?: string;
  authorization_date?: Date;
  created_at: Date;
  updated_at?: Date;
}

/**
 * GET /admin/brazil/nfe/:orderId/download
 *
 * Busca URLs de download da NFe (PDF e XML)
 *
 * Query params:
 * - format: "pdf" | "xml" (padrão: "pdf")
 *
 * Response:
 * {
 *   nfe_id: string;
 *   nfe_number: string;
 *   pdf_url?: string;
 *   xml_url?: string;
 * }
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const { orderId } = req.params;
  const { format = "pdf" } = req.query;

  const nfeService: NFeService = req.scope.resolve(
    `${BRAZIL_MODULE}.nfe`
  );

  try {
    // Buscar NFe do pedido
    const nfe = await nfeService.getNFeByOrder(orderId) as unknown as NFeEntity;

    if (!nfe) {
      res.status(404).json({
        error: "NFe not found for this order",
      });
      return;
    }

    // Verificar se NFe está autorizada
    if (nfe.status !== "authorized") {
      res.status(400).json({
        error: `NFe is not authorized yet. Current status: ${nfe.status}`,
      });
      return;
    }

    const response: any = {
      nfe_id: nfe.id,
      nfe_number: nfe.nfe_number,
    };

    // Buscar URL específica
    if (format === "pdf") {
      response.pdf_url = await nfeService.downloadPDF(nfe.id);
    } else if (format === "xml") {
      response.xml_url = await nfeService.downloadXML(nfe.id);
    } else {
      // Retornar ambos
      response.pdf_url = nfe.pdf_url;
      response.xml_url = nfe.xml_url;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
