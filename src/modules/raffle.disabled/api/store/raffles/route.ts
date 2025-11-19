import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { RAFFLE_MODULE } from "../../../index";
import type RaffleService from "../../../services/raffle";
import type RaffleTicketService from "../../../services/raffle-ticket";

/**
 * GET /store/raffles
 * Lista rifas ativas disponíveis para compra
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const raffleService: RaffleService = req.scope.resolve(RAFFLE_MODULE);

  // Query parameters
  const limit = Number(req.query.limit) || 20;
  const offset = Number(req.query.offset) || 0;

  // Listar rifas ativas
  const raffles = await raffleService.listActiveRaffles({
    skip: offset,
    take: limit,
  });

  // TODO: Adicionar contagem de tickets vendidos para cada rifa
  // const rafflesWithStats = await Promise.all(
  //   raffles.map(async (raffle) => {
    //   const ticketCount = await raffleTicketService.countRaffleTickets(raffle.id);
  //     return {
  //       ...raffle,
  //       tickets_sold: ticketCount,
  //       tickets_available: raffle.total_tickets - ticketCount,
  //     };
  //   })
  // );

  res.json({
    raffles,
    count: raffles.length,
    offset,
    limit,
  });
}
