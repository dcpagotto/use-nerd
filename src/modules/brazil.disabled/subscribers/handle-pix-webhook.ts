import type {
  SubscriberConfig,
  SubscriberArgs,
} from "@medusajs/framework/types";
import { BRAZIL_MODULE } from "../index";
import type PixPaymentService from "../services/pix-payment";

/**
 * handlePixWebhook Subscriber
 *
 * Processa webhooks do Mercado Pago PIX
 *
 * Quando o PIX é pago:
 * 1. Atualiza status do pagamento para "paid"
 * 2. Dispara evento order.payment_captured
 * 3. Notifica cliente
 *
 * Evento: brazil.pix_webhook
 */
export default async function handlePixWebhook({
  event: { data },
  container,
}: SubscriberArgs<{ webhookData: any }>) {
  const logger = container.resolve("logger");
  const pixPaymentService: PixPaymentService = container.resolve(
    `${BRAZIL_MODULE}.pix-payment`
  );

  try {
    logger.info("[Brazil] Processing PIX webhook");

    // Processar webhook
    await pixPaymentService.processWebhook(data.webhookData);

    logger.info("[Brazil] PIX webhook processed successfully");
  } catch (error) {
    logger.error(`[Brazil] Error processing PIX webhook: ${error.message}`);
    // TODO: Implementar retry com exponential backoff
    throw error;
  }
}

export const config: SubscriberConfig = {
  event: "brazil.pix_webhook",
  context: {
    subscriberId: "brazil-pix-webhook-handler",
  },
};
