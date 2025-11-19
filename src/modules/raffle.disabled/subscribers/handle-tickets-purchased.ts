import type {
  SubscriberConfig,
  SubscriberArgs,
} from "@medusajs/framework/types";
import { mintTicketNFTsWorkflow } from "../workflows";

/**
 * handleTicketsPurchased Subscriber
 *
 * Quando tickets são comprados (evento interno do módulo):
 * 1. Agenda mint de NFTs em background
 * 2. Envia notificação para o cliente
 * 3. Atualiza estatísticas da rifa
 *
 * Evento: raffle.tickets_purchased
 */
export default async function handleTicketsPurchased({
  event: { data },
  container,
}: SubscriberArgs<{
  raffle_id: string;
  ticket_ids: string[];
  customer_id: string;
  quantity: number;
}>) {
  const logger = container.resolve("logger");

  try {
    logger.info(
      `[Raffle] Processing tickets_purchased: ${data.quantity} tickets for raffle ${data.raffle_id}`
    );

    // TODO: Buscar dados da rifa
    // const raffleService = container.resolve(RAFFLE_MODULE);
    // const raffle = await raffleService.getRaffle(data.raffle_id);

    // TODO: Agendar mint de NFTs (após pagamento ser confirmado)
    // Este workflow será executado quando o status dos tickets mudar para "paid"
    // const mintWorkflow = mintTicketNFTsWorkflow(container);
    // await mintWorkflow.run({
    //   input: {
    //     raffle_id: data.raffle_id,
    //     raffle_title: raffle.title,
    //     ticket_ids: data.ticket_ids,
    //   },
    // });

    // TODO: Enviar notificação para o cliente
    // const notificationService = container.resolve("notificationService");
    // await notificationService.send({
    //   to: data.customer_id,
    //   template: "raffle-tickets-purchased",
    //   data: {
    //     raffle_title: raffle.title,
    //     quantity: data.quantity,
    //     ticket_ids: data.ticket_ids,
    //   },
    // });

    logger.info(`[Raffle] Tickets purchase processed successfully`);
  } catch (error) {
    logger.error(`[Raffle] Error processing tickets purchase: ${error.message}`);
  }
}

export const config: SubscriberConfig = {
  event: "raffle.tickets_purchased",
  context: {
    subscriberId: "raffle-tickets-purchased-handler",
  },
};
