import type {
  SubscriberConfig,
  SubscriberArgs,
} from "@medusajs/framework/types";

/**
 * handleOrderPlaced Subscriber
 *
 * Detecta quando um pedido é criado e verifica se contém tickets de rifa.
 * Se sim, cria os registros de tickets no módulo Raffle.
 *
 * Evento: order.placed
 */
export default async function handleOrderPlaced({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger");

  try {
    logger.info(`[Raffle] Processing order.placed event for order: ${data.id}`);

    // TODO: Buscar pedido completo com line items
    // const orderService = container.resolve("orderService");
    // const order = await orderService.retrieve(data.id, {
    //   relations: ["items", "items.variant", "items.variant.product"],
    // });

    // TODO: Filtrar line items que são tickets de rifa
    // const raffleItems = order.items.filter((item) => {
    //   return item.metadata?.raffle_id && item.metadata?.raffle_ticket === true;
    // });

    // TODO: Para cada item de rifa, processar compra
    // for (const item of raffleItems) {
    //   const raffleId = item.metadata.raffle_id as string;
    //   const quantity = item.quantity;
    //
    //   // Executar workflow de compra de tickets
    //   await purchaseRaffleTicketsWorkflow(container).run({
    //     input: {
    //       raffle_id: raffleId,
    //       customer_id: order.customer_id,
    //       order_id: order.id,
    //       line_item_id: item.id,
    //       quantity: quantity,
    //       price_paid: item.unit_price,
    //     },
    //   });
    //
    //   logger.info(`[Raffle] Created ${quantity} tickets for raffle ${raffleId}`);
    // }

    logger.info(`[Raffle] Order processed successfully`);
  } catch (error) {
    logger.error(`[Raffle] Error processing order: ${error.message}`);
    // Não propagar erro para não bloquear o checkout
    // TODO: Adicionar retry mechanism
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
  context: {
    subscriberId: "raffle-order-placed-handler",
  },
};
