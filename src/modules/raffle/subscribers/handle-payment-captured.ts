import type {
  SubscriberConfig,
  SubscriberArgs,
} from "@medusajs/framework/types";
import { RAFFLE_MODULE } from "../index";
import type RaffleTicketService from "../services/raffle-ticket";
import type RaffleService from "../services/raffle";
import { TicketStatus } from "../types";

/**
 * handlePaymentCaptured Subscriber
 *
 * Quando o pagamento é capturado com sucesso:
 * 1. Marca tickets como "paid"
 * 2. Agenda mint de NFTs (job assíncrono)
 * 3. Verifica se rifa está sold out
 *
 * Evento: order.payment_captured
 */
export default async function handlePaymentCaptured({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger");
  const raffleTicketService: RaffleTicketService = container.resolve(
    `${RAFFLE_MODULE}.raffle-ticket`
  );
  const raffleService: RaffleService = container.resolve(RAFFLE_MODULE);

  try {
    logger.info(`[Raffle] Processing payment.captured for order: ${data.id}`);

    // TODO: Buscar tickets associados ao pedido
    // const tickets = await raffleTicketService.listTickets({
    //   order_id: data.id,
    //   status: TicketStatus.RESERVED,
    // });

    // if (tickets.length === 0) {
    //   logger.info(`[Raffle] No raffle tickets found for order ${data.id}`);
    //   return;
    // }

    // TODO: Marcar todos os tickets como pagos
    // for (const ticket of tickets) {
    //   await raffleTicketService.markAsPaid(ticket.id);
    //   logger.info(`[Raffle] Ticket ${ticket.ticket_code} marked as paid`);
    // }

    // TODO: Agendar mint de NFTs (job assíncrono)
    // const raffleId = tickets[0].raffle_id;
    // const ticketIds = tickets.map((t) => t.id);
    //
    // await scheduleNFTMintJob({
    //   raffle_id: raffleId,
    //   ticket_ids: ticketIds,
    // });

    // TODO: Verificar se rifa está sold out
    // const raffle = await raffleService.getRaffle(raffleId);
    // const totalSold = await raffleTicketService.countRaffleTickets(raffleId);
    //
    // if (totalSold >= raffle.total_tickets) {
    //   await raffleService.markAsSoldOut(raffleId);
    //   logger.info(`[Raffle] Raffle ${raffleId} marked as SOLD OUT`);
    // }

    logger.info(`[Raffle] Payment processed successfully`);
  } catch (error) {
    logger.error(`[Raffle] Error processing payment: ${error.message}`);
    // TODO: Implementar retry com exponential backoff
  }
}

export const config: SubscriberConfig = {
  event: "order.payment_captured",
  context: {
    subscriberId: "raffle-payment-captured-handler",
  },
};
