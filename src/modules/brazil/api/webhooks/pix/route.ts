import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

/**
 * POST /webhooks/brazil/pix
 *
 * Recebe webhook do Mercado Pago sobre pagamentos PIX
 *
 * Mercado Pago envia notificações quando:
 * - PIX é pago
 * - PIX expira
 * - PIX é cancelado
 */
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const logger = req.scope.resolve("logger");
  const eventBus = req.scope.resolve("eventBusModuleService");

  try {
    logger.info("[Brazil] Received PIX webhook");
    logger.debug("[Brazil] Webhook data:", req.body);

    // Validar webhook (opcional: verificar signature do Mercado Pago)
    // TODO: Implementar validação de assinatura
    // const isValid = validateMercadoPagoSignature(req.headers, req.body);
    // if (!isValid) {
    //   res.status(401).json({ error: "Invalid signature" });
    //   return;
    // }

    // Emitir evento para ser processado pelo subscriber
    await eventBus.emit("brazil.pix_webhook", {
      webhookData: req.body,
    });

    // Responder imediatamente (202 Accepted)
    res.status(202).json({
      received: true,
    });
  } catch (error) {
    logger.error(`[Brazil] Error processing PIX webhook: ${error.message}`);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
