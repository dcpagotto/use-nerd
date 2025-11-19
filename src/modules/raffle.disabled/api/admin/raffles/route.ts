import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { RAFFLE_MODULE } from "../../../index";
import type RaffleService from "../../../services/raffle";
import { createRaffleWorkflow } from "../../../workflows";
import { CreateRaffleDTO } from "../../../types";

/**
 * GET /admin/raffles
 * Lista todas as rifas (com filtros)
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const raffleService: RaffleService = req.scope.resolve(RAFFLE_MODULE);

  // Query parameters
  const limit = Number(req.query.limit) || 20;
  const offset = Number(req.query.offset) || 0;
  const status = req.query.status as string | undefined;

  const filters = {
    ...(status && { status }),
  };

  const raffles = await raffleService.listRaffles(filters, {
    skip: offset,
    take: limit,
    order: { created_at: "DESC" },
  });

  res.json({
    raffles,
    count: raffles.length,
    offset,
    limit,
  });
}

/**
 * POST /admin/raffles
 * Cria uma nova rifa
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    // Validar body
    const raffleData = req.body as CreateRaffleDTO;

    // Executar workflow
    const { result } = await createRaffleWorkflow(req.scope).run({
      input: {
        raffle: raffleData,
        auto_publish: false, // Publicação manual por padrão
      },
    });

    res.status(201).json({
      raffle: result.raffle,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create raffle",
      error: error.message,
    });
  }
}
