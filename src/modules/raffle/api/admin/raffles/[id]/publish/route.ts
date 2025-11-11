import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { publishRaffleWorkflow } from "../../../../../workflows";

/**
 * POST /admin/raffles/:id/publish
 * Publica uma rifa (draft → active) fazendo deploy na blockchain
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id } = req.params;

  try {
    // Executar workflow de publicação
    const { result } = await publishRaffleWorkflow(req.scope).run({
      input: {
        raffle_id: id,
      },
    });

    res.json({
      raffle: result.raffle,
      contract_address: result.contract_address,
      transaction_hash: result.transaction_hash,
      message: "Raffle published successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to publish raffle",
      error: error.message,
    });
  }
}
