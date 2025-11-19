import type {
  SubscriberConfig,
  SubscriberArgs,
} from "@medusajs/framework/types";
import { generateNFeWorkflow } from "../workflows";

/**
 * handleOrderCompleted Subscriber
 *
 * Quando order.completed:
 * 1. Gera NFe automaticamente
 * 2. Envia NFe por email
 * 3. Atualiza metadata do order
 *
 * Evento: order.completed
 */
export default async function handleOrderCompleted({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger");

  try {
    logger.info(`[Brazil] Processing order completed: ${data.id}`);

    // TODO: Verificar se é pedido brasileiro (tem CPF/CNPJ)
    // const orderService = container.resolve("orderService");
    // const order = await orderService.retrieve(data.id, {
    //   relations: ["customer"],
    // });
    //
    // const customerCpfCnpj = order.customer.metadata?.cpf_cnpj;
    // if (!customerCpfCnpj) {
    //   logger.info(
    //     `[Brazil] Order ${data.id} has no CPF/CNPJ - skipping NFe generation`
    //   );
    //   return;
    // }

    // Executar workflow de geração de NFe
    const { result } = await generateNFeWorkflow(container).run({
      input: {
        order_id: data.id,
      },
    });

    logger.info(
      `[Brazil] NFe generated for order ${data.id}: ${result.nfe.id}`
    );

    // TODO: Enviar email com NFe
    // const notificationService = container.resolve("notificationService");
    // await notificationService.send("order.nfe_issued", {
    //   to: order.customer.email,
    //   data: {
    //     order_id: data.id,
    //     nfe_number: result.nfe.nfe_number,
    //     pdf_url: result.pdf_url,
    //     xml_url: result.xml_url,
    //   },
    // });

    // TODO: Atualizar metadata do order
    // await orderService.update(data.id, {
    //   metadata: {
    //     ...order.metadata,
    //     nfe_id: result.nfe.id,
    //     nfe_number: result.nfe.nfe_number,
    //   },
    // });
  } catch (error) {
    logger.error(`[Brazil] Error generating NFe: ${error.message}`);
    // Não falhar o subscriber - NFe pode ser gerada manualmente depois
  }
}

export const config: SubscriberConfig = {
  event: "order.completed",
  context: {
    subscriberId: "brazil-order-completed-handler",
  },
};
