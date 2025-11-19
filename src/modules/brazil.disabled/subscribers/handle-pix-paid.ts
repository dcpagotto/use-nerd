import type {
  SubscriberConfig,
  SubscriberArgs,
} from "@medusajs/framework/types";

/**
 * handlePixPaid Subscriber
 *
 * Quando PIX é pago com sucesso:
 * 1. Marca order como "paid"
 * 2. Dispara evento order.payment_captured
 *
 * Evento: brazil.pix_paid
 */
export default async function handlePixPaid({
  event: { data },
  container,
}: SubscriberArgs<{ payment_id: string; order_id: string; paid_at: Date }>) {
  const logger = container.resolve("logger");

  try {
    logger.info(`[Brazil] Processing PIX paid: ${data.payment_id}`);

    // TODO: Atualizar status do pedido
    // const orderService = container.resolve("orderService");
    // const order = await orderService.retrieve(data.order_id);
    //
    // if (order.payment_status !== "captured") {
    //   await orderService.capturePayment(data.order_id);
    //   logger.info(`[Brazil] Order ${data.order_id} payment captured`);
    // }

    // TODO: Disparar evento order.payment_captured
    // const eventBus = container.resolve("eventBusModuleService");
    // await eventBus.emit("order.payment_captured", {
    //   id: data.order_id,
    // });

    logger.info(`[Brazil] PIX payment processed for order: ${data.order_id}`);
  } catch (error) {
    logger.error(`[Brazil] Error processing PIX paid: ${error.message}`);
    throw error;
  }
}

export const config: SubscriberConfig = {
  event: "brazil.pix_paid",
  context: {
    subscriberId: "brazil-pix-paid-handler",
  },
};
