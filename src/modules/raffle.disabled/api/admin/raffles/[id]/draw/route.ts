import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { executeRaffleDrawWorkflow } from "../../../../../workflows";

/**
 * POST /admin/raffles/:id/draw
 * Executa o sorteio de uma rifa via Chainlink VRF
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id } = req.params;

  // Pegar ID do usuário admin
  const executedBy = req.user?.id || "system";

  try {
    // Executar workflow de sorteio
    const { result } = await executeRaffleDrawWorkflow(req.scope).run({
      input: {
        raffle_id: id,
        executed_by: executedBy,
      },
    });

    res.json({
      draw: result.draw,
      message: "Draw initiated successfully. Awaiting Chainlink VRF response.",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to execute draw",
      error: error.message,
    });
  }
}
