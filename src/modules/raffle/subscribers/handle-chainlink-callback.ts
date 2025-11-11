import type {
  SubscriberConfig,
  SubscriberArgs,
} from "@medusajs/framework/types";
import { RAFFLE_MODULE } from "../index";
import type RaffleDrawService from "../services/raffle-draw";
import type RaffleTicketService from "../services/raffle-ticket";
import type RaffleService from "../services/raffle";
import { completeRaffleDrawWorkflow } from "../workflows";

/**
 * handleChainlinkVRFCallback Subscriber
 *
 * Processa o callback do Chainlink VRF quando o número aleatório é gerado.
 * Este evento pode vir de um webhook ou ser disparado manualmente.
 *
 * Evento: raffle.chainlink_vrf_callback (custom event)
 */
export default async function handleChainlinkVRFCallback({
  event: { data },
  container,
}: SubscriberArgs<{
  vrf_request_id: string;
  random_words: string[];
}>) {
  const logger = container.resolve("logger");
  const raffleDrawService: RaffleDrawService = container.resolve(
    `${RAFFLE_MODULE}.raffle-draw`
  );
  const raffleTicketService: RaffleTicketService = container.resolve(
    `${RAFFLE_MODULE}.raffle-ticket`
  );
  const raffleService: RaffleService = container.resolve(RAFFLE_MODULE);

  try {
    logger.info(`[Raffle] Processing Chainlink VRF callback: ${data.vrf_request_id}`);

    // Buscar sorteio pelo VRF request ID
    const draw = await raffleDrawService.getDrawByVRFRequest(data.vrf_request_id);

    if (!draw) {
      logger.error(`[Raffle] Draw not found for VRF request: ${data.vrf_request_id}`);
      return;
    }

    // Buscar rifa
    const raffle = await raffleService.getRaffle(draw.raffle_id);

    // Calcular número vencedor
    const totalTickets = raffle.total_tickets;
    const winnerNumber = raffleDrawService.calculateWinnerNumber(
      data.random_words,
      totalTickets
    );

    logger.info(`[Raffle] Winner number calculated: ${winnerNumber}`);

    // Buscar ticket vencedor
    const winnerTicket = await raffleTicketService.getTicketByNumber(
      draw.raffle_id,
      winnerNumber
    );

    if (!winnerTicket) {
      logger.error(`[Raffle] Winner ticket not found: ${winnerNumber}`);
      await raffleDrawService.markAsFailed(
        draw.id,
        `Winner ticket #${winnerNumber} not found`
      );
      return;
    }

    // Marcar ticket como vencedor
    await raffleTicketService.markAsWinner(winnerTicket.id);

    // Atualizar rifa com vencedor
    await raffleService.completeDraw(draw.raffle_id, {
      winner_ticket_number: winnerNumber,
      winner_customer_id: winnerTicket.customer_id,
      winner_wallet_address: winnerTicket.nft_metadata_uri, // TODO: pegar wallet real
    });

    // Atualizar draw record
    await raffleDrawService.completeDraw(draw.id, data.random_words, {
      winner_ticket_number: winnerNumber,
      winner_ticket_id: winnerTicket.id,
      winner_customer_id: winnerTicket.customer_id,
    });

    logger.info(
      `[Raffle] Draw completed successfully. Winner: ticket #${winnerNumber} (${winnerTicket.ticket_code})`
    );

    // Eventos serão disparados automaticamente pelos services
  } catch (error) {
    logger.error(`[Raffle] Error processing VRF callback: ${error.message}`);
    // TODO: Marcar draw como failed
  }
}

export const config: SubscriberConfig = {
  event: "raffle.chainlink_vrf_callback",
  context: {
    subscriberId: "raffle-chainlink-vrf-callback-handler",
  },
};
