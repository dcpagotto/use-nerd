import type {
  SubscriberConfig,
  SubscriberArgs,
} from "@medusajs/framework/types";
import { RAFFLE_MODULE } from "../index";
import type RaffleService from "../services/raffle";
import type RaffleTicketService from "../services/raffle-ticket";

/**
 * notifyWinner Subscriber
 *
 * Quando um vencedor é anunciado:
 * 1. Envia email de parabéns ao vencedor
 * 2. Envia notificação in-app
 * 3. Cria task para entrega do prêmio
 * 4. Notifica admin
 *
 * Evento: raffle.winner_announced
 */
export default async function notifyWinner({
  event: { data },
  container,
}: SubscriberArgs<{
  raffle_id: string;
  winner_ticket_id: string;
  winner_customer_id: string;
  winner_ticket_number: number;
}>) {
  const logger = container.resolve("logger");
  const raffleService: RaffleService = container.resolve(RAFFLE_MODULE);
  const raffleTicketService: RaffleTicketService = container.resolve(
    `${RAFFLE_MODULE}.raffle-ticket`
  );

  try {
    logger.info(
      `[Raffle] Notifying winner for raffle ${data.raffle_id}, ticket #${data.winner_ticket_number}`
    );

    // Buscar rifa e ticket
    const raffle = await raffleService.getRaffle(data.raffle_id);
    const winnerTicket = await raffleTicketService.retrieve(data.winner_ticket_id);

    // TODO: Buscar dados do cliente
    // const customerService = container.resolve("customerService");
    // const customer = await customerService.retrieve(data.winner_customer_id);

    // TODO: Enviar email para o vencedor
    // const emailService = container.resolve("emailService");
    // await emailService.send({
    //   to: customer.email,
    //   subject: `🎉 Parabéns! Você ganhou: ${raffle.prize_description}`,
    //   template: "raffle-winner",
    //   data: {
    //     customer_name: customer.first_name,
    //     raffle_title: raffle.title,
    //     prize_description: raffle.prize_description,
    //     ticket_number: data.winner_ticket_number,
    //     ticket_code: winnerTicket.ticket_code,
    //     draw_date: raffle.winner_drawn_at,
    //   },
    // });

    // TODO: Criar notificação in-app
    // const notificationService = container.resolve("notificationService");
    // await notificationService.create({
    //   recipient_id: data.winner_customer_id,
    //   type: "raffle_winner",
    //   title: "🎉 Você ganhou!",
    //   message: `Parabéns! Você ganhou ${raffle.prize_description}`,
    //   data: {
    //     raffle_id: data.raffle_id,
    //     ticket_id: data.winner_ticket_id,
    //   },
    // });

    // TODO: Notificar admin sobre vencedor
    // await emailService.send({
    //   to: process.env.ADMIN_EMAIL,
    //   subject: `Raffle Winner: ${raffle.title}`,
    //   template: "raffle-winner-admin",
    //   data: {
    //     raffle_title: raffle.title,
    //     winner_name: `${customer.first_name} ${customer.last_name}`,
    //     winner_email: customer.email,
    //     ticket_number: data.winner_ticket_number,
    //     prize_description: raffle.prize_description,
    //   },
    // });

    // TODO: Criar task para entrega do prêmio
    // const taskService = container.resolve("taskService");
    // await taskService.create({
    //   type: "prize_delivery",
    //   title: `Entregar prêmio: ${raffle.prize_description}`,
    //   description: `Vencedor: ${customer.email}, Ticket: #${data.winner_ticket_number}`,
    //   assigned_to: "fulfillment_team",
    //   due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    //   metadata: {
    //     raffle_id: data.raffle_id,
    //     winner_customer_id: data.winner_customer_id,
    //     ticket_id: data.winner_ticket_id,
    //   },
    // });

    logger.info(`[Raffle] Winner notifications sent successfully`);
  } catch (error) {
    logger.error(`[Raffle] Error notifying winner: ${error.message}`);
    // Não propagar erro - notificação pode ser reprocessada
  }
}

export const config: SubscriberConfig = {
  event: "raffle.winner_announced",
  context: {
    subscriberId: "raffle-winner-notifier",
  },
};
