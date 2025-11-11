import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";
import { RAFFLE_MODULE } from "../../../../../modules/raffle";
import type RaffleService from "../../../../../modules/raffle/services/raffle";
import type RaffleDrawService from "../../../../../modules/raffle/services/raffle-draw";

/**
 * Test Draw Endpoint - APENAS PARA DESENVOLVIMENTO
 *
 * Este endpoint simula o fluxo completo de sorteio incluindo:
 * 1. Solicitar "randomness" (simulado)
 * 2. Criar registro do draw
 * 3. Simular callback do Chainlink VRF
 * 4. Processar vencedor
 *
 * ⚠️ IMPORTANTE: Desabilitar em produção!
 * Este endpoint bypassa o Chainlink VRF real e gera números pseudo-aleatórios.
 *
 * Uso:
 * POST /admin/raffles/:id/test-draw
 *
 * Resposta:
 * {
 *   "draw": {...},
 *   "winner_number": 42,
 *   "vrf_request_id": "test-123...",
 *   "random_words": ["123..."]
 * }
 */
export async function POST(
  req: MedusaRequest<{ id: string }>,
  res: MedusaResponse
) {
  // Verificar se está em ambiente de desenvolvimento
  if (process.env.NODE_ENV === "production") {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Test draw endpoint is disabled in production"
    );
  }

  const logger = req.scope.resolve("logger");
  const raffleService: RaffleService = req.scope.resolve(RAFFLE_MODULE);
  const raffleDrawService: RaffleDrawService = req.scope.resolve(
    `${RAFFLE_MODULE}.raffle-draw`
  );
  const eventBusService = req.scope.resolve("eventBusService");

  const raffleId = req.params.id;

  try {
    logger.info(`[Test Draw] Initiating test draw for raffle: ${raffleId}`);

    // 1. Buscar rifa e validar
    const raffle = await raffleService.getRaffle(raffleId);

    if (raffle.status !== "active" && raffle.status !== "sold_out") {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Raffle must be active or sold_out to execute draw. Current status: ${raffle.status}`
      );
    }

    // 2. Atualizar status da rifa para "drawing"
    await raffleService.startDraw(raffleId);

    // 3. Gerar VRF request ID simulado
    const vrfRequestId = `test-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const transactionHash = `0xtest${Date.now().toString(16)}`;

    // 4. Criar registro do draw
    const draw = await raffleDrawService.createDraw({
      raffle_id: raffleId,
      vrf_request_id: vrfRequestId,
      transaction_hash: transactionHash,
    });

    logger.info(`[Test Draw] Draw record created: ${draw.id}`);

    // 5. Gerar números aleatórios simulados (similar ao Chainlink VRF)
    // Chainlink VRF retorna uint256, então simulamos um número grande
    const randomWords = [
      BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).toString(),
    ];

    logger.info(`[Test Draw] Generated random words: ${randomWords[0]}`);

    // 6. Simular callback do Chainlink VRF (assíncrono)
    setTimeout(async () => {
      try {
        logger.info(
          `[Test Draw] Simulating Chainlink VRF callback for: ${vrfRequestId}`
        );

        await eventBusService.emit("raffle.chainlink_vrf_callback", {
          vrf_request_id: vrfRequestId,
          random_words: randomWords,
          received_at: new Date().toISOString(),
        });

        logger.info(`[Test Draw] VRF callback event emitted successfully`);
      } catch (callbackError) {
        logger.error(
          `[Test Draw] Error emitting VRF callback: ${callbackError.message}`
        );
      }
    }, 2000); // Simula delay de 2 segundos (similar ao tempo real do Chainlink)

    // 7. Calcular número vencedor para preview
    const totalTickets = raffle.total_tickets;
    const winnerNumber = raffleDrawService.calculateWinnerNumber(
      randomWords,
      totalTickets
    );

    logger.info(`[Test Draw] Winner number calculated: ${winnerNumber}`);

    // Retornar resposta imediata (antes do callback ser processado)
    res.status(200).json({
      message: "Test draw initiated successfully",
      draw: {
        id: draw.id,
        raffle_id: raffleId,
        vrf_request_id: vrfRequestId,
        transaction_hash: transactionHash,
        status: "requested",
        created_at: draw.created_at,
      },
      preview: {
        winner_number: winnerNumber,
        total_tickets: totalTickets,
        random_words: randomWords,
      },
      note: "VRF callback will be processed in ~2 seconds. Check raffle status after.",
    });
  } catch (error) {
    logger.error(`[Test Draw] Error executing test draw: ${error.message}`);
    throw error;
  }
}

/**
 * GET endpoint para verificar se test draw está disponível
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const isProduction = process.env.NODE_ENV === "production";

  res.status(200).json({
    available: !isProduction,
    environment: process.env.NODE_ENV,
    message: isProduction
      ? "Test draw is disabled in production"
      : "Test draw is available. Use POST to execute.",
  });
}
