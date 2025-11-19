import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { RAFFLE_MODULE } from "../../../../../index";
import type RaffleTicketService from "../../../../../services/raffle-ticket";

/**
 * GET /store/raffles/me/tickets
 * Lista tickets do cliente autenticado
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const raffleTicketService: RaffleTicketService = req.scope.resolve(
    `${RAFFLE_MODULE}.raffle-ticket`
  );

  // Verificar autenticação
  const customerId = req.user?.customer_id;
  if (!customerId) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  // Query parameters
  const limit = Number(req.query.limit) || 20;
  const offset = Number(req.query.offset) || 0;
  const raffleId = req.query.raffle_id as string | undefined;

  // Buscar tickets do cliente
  const filters = {
    customer_id: customerId,
    ...(raffleId && { raffle_id: raffleId }),
  };

  const tickets = await raffleTicketService.listTickets(filters, {
    skip: offset,
    take: limit,
  });

  // TODO: Adicionar dados da rifa para cada ticket
  // const ticketsWithRaffle = await Promise.all(
  //   tickets.map(async (ticket) => {
  //     const raffle = await raffleService.getRaffle(ticket.raffle_id);
  //     return {
  //       ...ticket,
  //       raffle: {
  //         title: raffle.title,
  //         draw_date: raffle.draw_date,
  //         status: raffle.status,
  //       },
  //     };
  //   })
  // );

  res.json({
    tickets,
    count: tickets.length,
  });
}
