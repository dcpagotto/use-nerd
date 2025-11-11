import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { RAFFLE_MODULE } from "../../../../index";
import type RaffleService from "../../../../services/raffle";
import type RaffleTicketService from "../../../../services/raffle-ticket";

/**
 * GET /store/raffles/:id
 * Obtém detalhes completos de uma rifa
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const raffleService: RaffleService = req.scope.resolve(RAFFLE_MODULE);
  const raffleTicketService: RaffleTicketService = req.scope.resolve(
    `${RAFFLE_MODULE}.raffle-ticket`
  );

  const { id } = req.params;

  try {
    // Buscar rifa
    const raffle = await raffleService.getRaffle(id);

    // Buscar estatísticas
    const ticketCount = await raffleTicketService.countRaffleTickets(id);
    const recentTickets = await raffleTicketService.getRecentTickets(id, 10);

    res.json({
      raffle: {
        ...raffle,
        tickets_sold: ticketCount,
        tickets_available: raffle.total_tickets - ticketCount,
        recent_tickets: recentTickets,
      },
    });
  } catch (error) {
    res.status(404).json({
      message: "Raffle not found",
      error: error.message,
    });
  }
}
