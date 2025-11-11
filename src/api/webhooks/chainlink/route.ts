import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";

/**
 * Chainlink VRF Callback Webhook
 *
 * Este endpoint recebe callbacks do Chainlink VRF após a geração de randomness.
 * O Chainlink chama este endpoint com o requestId e os números aleatórios gerados.
 *
 * Fluxo:
 * 1. Chainlink VRF gera randomness on-chain
 * 2. Chainlink webhook chama POST /webhooks/chainlink
 * 3. Este endpoint valida e dispara evento interno
 * 4. Subscriber handleChainlinkVRFCallback processa o resultado
 * 5. Winner é calculado e anunciado
 *
 * URL a configurar no Chainlink:
 * https://your-domain.com/webhooks/chainlink
 *
 * Payload esperado:
 * {
 *   "requestId": "0x123...",
 *   "randomWords": ["12345678901234567890..."]
 * }
 */
export async function POST(
  req: MedusaRequest<{
    requestId: string;
    randomWords: string[];
  }>,
  res: MedusaResponse
) {
  const logger = req.scope.resolve("logger");
  const eventBusService = req.scope.resolve("eventBusService");

  try {
    const { requestId, randomWords } = req.body;

    // Validar payload
    if (!requestId || !randomWords || !Array.isArray(randomWords)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid payload: requestId and randomWords are required"
      );
    }

    if (randomWords.length === 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "randomWords array cannot be empty"
      );
    }

    logger.info(
      `[Chainlink Webhook] Received VRF callback for request: ${requestId}`
    );

    // TODO: Validar signature do Chainlink (security)
    // const isValid = await validateChainlinkSignature(req.headers, req.body);
    // if (!isValid) {
    //   throw new MedusaError(
    //     MedusaError.Types.UNAUTHORIZED,
    //     "Invalid Chainlink signature"
    //   );
    // }

    // Disparar evento interno para o subscriber processar
    await eventBusService.emit("raffle.chainlink_vrf_callback", {
      vrf_request_id: requestId,
      random_words: randomWords,
      received_at: new Date().toISOString(),
    });

    logger.info(
      `[Chainlink Webhook] Event emitted successfully for request: ${requestId}`
    );

    // Retornar sucesso para o Chainlink
    res.status(200).json({
      success: true,
      message: "VRF callback received and processed",
      requestId,
    });
  } catch (error) {
    logger.error(`[Chainlink Webhook] Error processing callback: ${error.message}`);

    // Retornar erro mas não expor detalhes internos
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}

/**
 * GET endpoint para health check do webhook
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.status(200).json({
    status: "ok",
    endpoint: "chainlink-vrf-webhook",
    message: "Webhook is ready to receive Chainlink VRF callbacks",
  });
}
