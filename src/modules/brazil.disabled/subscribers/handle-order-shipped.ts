import type {
  SubscriberConfig,
  SubscriberArgs,
} from "@medusajs/framework/types";
import { BRAZIL_MODULE } from "../index";
import type MelhorEnvioService from "../services/melhor-envio";
import { ShippingCompany } from "../types";

/**
 * handleOrderShipped Subscriber
 *
 * Quando order.fulfillment_created:
 * 1. Compra etiqueta no Melhor Envio
 * 2. Atualiza tracking code
 * 3. Envia email com rastreamento
 *
 * Evento: order.fulfillment_created
 */
export default async function handleOrderShipped({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; order_id: string }>) {
  const logger = container.resolve("logger");
  const melhorEnvioService: MelhorEnvioService = container.resolve(
    `${BRAZIL_MODULE}.melhor-envio`
  );

  try {
    logger.info(`[Brazil] Processing order shipped: ${data.order_id}`);

    // TODO: Buscar dados do fulfillment
    // const fulfillmentService = container.resolve("fulfillmentService");
    // const fulfillment = await fulfillmentService.retrieve(data.id);

    // TODO: Verificar se é pedido brasileiro (tem frete calculado)
    const shippingQuote = await melhorEnvioService.getShippingQuoteByOrder(
      data.order_id
    );

    if (!shippingQuote) {
      logger.info(
        `[Brazil] No shipping quote found for order ${data.order_id} - skipping`
      );
      return;
    }

    // Comprar etiqueta
    const { tracking_code } = await melhorEnvioService.purchaseShipping(
      data.order_id,
      {
        company: shippingQuote.shipping_company,
        service_name: shippingQuote.service_name,
        price: shippingQuote.price,
      }
    );

    logger.info(
      `[Brazil] Shipping purchased for order ${data.order_id}: ${tracking_code}`
    );

    // TODO: Enviar email com código de rastreamento
    // const notificationService = container.resolve("notificationService");
    // await notificationService.send("order.shipped", {
    //   to: order.customer.email,
    //   data: {
    //     order_id: data.order_id,
    //     tracking_code: tracking_code,
    //     tracking_url: `https://rastreamento.correios.com.br/${tracking_code}`,
    //   },
    // });
  } catch (error) {
    logger.error(`[Brazil] Error processing order shipped: ${error.message}`);
    // Não falhar - tentar novamente depois
  }
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
  context: {
    subscriberId: "brazil-order-shipped-handler",
  },
};
