import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { RAFFLE_MODULE } from "../../../../index";
import type RaffleService from "../../../../services/raffle";
import { UpdateRaffleDTO } from "../../../../types";

/**
 * GET /admin/raffles/:id
 * Obtém detalhes de uma rifa
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const raffleService: RaffleService = req.scope.resolve(RAFFLE_MODULE);
  const { id } = req.params;

  try {
    const raffle = await raffleService.getRaffle(id);

    res.json({
      raffle,
    });
  } catch (error) {
    res.status(404).json({
      message: "Raffle not found",
      error: error.message,
    });
  }
}

/**
 * POST /admin/raffles/:id
 * Atualiza uma rifa existente
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const raffleService: RaffleService = req.scope.resolve(RAFFLE_MODULE);
  const { id } = req.params;

  try {
    const updateData = req.body as UpdateRaffleDTO;

    const updatedRaffle = await raffleService.updateRaffle(id, updateData);

    res.json({
      raffle: updatedRaffle,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update raffle",
      error: error.message,
    });
  }
}

/**
 * DELETE /admin/raffles/:id
 * Cancela uma rifa
 */
export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const raffleService: RaffleService = req.scope.resolve(RAFFLE_MODULE);
  const { id } = req.params;

  try {
    const cancelledRaffle = await raffleService.cancelRaffle(id);

    res.json({
      raffle: cancelledRaffle,
      message: "Raffle cancelled successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to cancel raffle",
      error: error.message,
    });
  }
}
