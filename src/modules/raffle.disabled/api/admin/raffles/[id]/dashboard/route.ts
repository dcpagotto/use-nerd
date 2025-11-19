import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { RAFFLE_MODULE } from "../../../../../index";
import type RaffleService from "../../../../../services/raffle";
import type RaffleTicketService from "../../../../../services/raffle-ticket";

/**
 * GET /admin/raffles/:id/dashboard
 * Obtém dashboard completo de uma rifa com estatísticas
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

    // Buscar tickets
    const allTickets = await raffleTicketService.getRaffleTickets(id);
    const totalTicketsSold = allTickets.length;

    // Calcular receita total
    const totalRevenue = allTickets.reduce(
      (sum, ticket) => sum + ticket.price_paid,
      0
    );

    // Contar clientes únicos
    const uniqueCustomers = new Set(allTickets.map((t) => t.customer_id)).size;

    // Média de tickets por cliente
    const avgTicketsPerCustomer =
      uniqueCustomers > 0 ? totalTicketsSold / uniqueCustomers : 0;

    // Tickets recentes
    const recentTickets = await raffleTicketService.getRecentTickets(id, 20);

    // TODO: Implementar vendas por dia
    // TODO: Implementar top customers

    res.json({
      raffle,
      stats: {
        total_tickets: raffle.total_tickets,
        tickets_sold: totalTicketsSold,
        tickets_available: raffle.total_tickets - totalTicketsSold,
        total_revenue: totalRevenue,
        unique_customers: uniqueCustomers,
        average_tickets_per_customer: Number(avgTicketsPerCustomer.toFixed(2)),
        // sales_by_day: [],
        // top_customers: [],
      },
      recent_tickets: recentTickets,
    });
  } catch (error) {
    res.status(404).json({
      message: "Raffle not found",
      error: error.message,
    });
  }
}
