import {
  createWorkflow,
  WorkflowResponse,
  transform,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  ExecuteRaffleDrawWorkflowInput,
  ExecuteRaffleDrawWorkflowOutput,
  DrawStatus,
} from "../types";

/**
 * validateRaffleForDrawStep
 * Valida se rifa pode ser sorteada
 */
const validateRaffleForDrawStep = createStep(
  "validate-raffle-for-draw",
  async (input: { raffle_id: string }) => {
    // TODO: Usar RaffleService e RaffleTicketService
    // const raffle = await raffleService.getRaffle(input.raffle_id);

    // Validações:
    // - Status deve ser active ou sold_out
    // - Deve ter pelo menos 1 ticket vendido
    // - Não pode ter sorteio pendente
    // - draw_date deve ter passado (ou ter aprovação admin)

    // Mock - assumir válido
    return new StepResponse({ valid: true });
  }
);

/**
 * updateRaffleStatusToDrawingStep
 * Atualiza status da rifa para "drawing"
 */
const updateRaffleStatusToDrawingStep = createStep(
  "update-raffle-status-to-drawing",
  async (input: { raffle_id: string }) => {
    // TODO: Usar RaffleService.startDraw
    console.log("Updating raffle status to drawing:", input.raffle_id);
    return new StepResponse({ updated: true });
  },
  async (compensationData) => {
    // Rollback: voltar status para active/sold_out
    console.log("Rolling back raffle status");
  }
);

/**
 * requestChainlinkVRFStep
 * Solicita número aleatório do Chainlink VRF
 */
const requestChainlinkVRFStep = createStep(
  "request-chainlink-vrf",
  async (input: { raffle_id: string }) => {
    // TODO: Integrar com smart contract e Chainlink VRF
    // const tx = await raffleContract.requestRandomness(raffleId);

    // Mock - simular requisição VRF
    const mockVRFRequest = {
      request_id: `vrf_${Date.now()}`,
      transaction_hash: `0x${Math.random().toString(16).substring(2)}`,
    };

    console.log("Chainlink VRF request:", mockVRFRequest);

    return new StepResponse(mockVRFRequest, {
      request_id: mockVRFRequest.request_id,
    });
  }
);

/**
 * createDrawRecordStep
 * Cria registro do sorteio no banco
 */
const createDrawRecordStep = createStep(
  "create-draw-record",
  async (input: {
    raffle_id: string;
    vrf_request_id: string;
    vrf_transaction_hash: string;
    executed_by: string;
  }) => {
    // TODO: Usar RaffleDrawService.createDraw
    const drawRecord = {
      id: `draw_${Date.now()}`,
      ...input,
      status: DrawStatus.REQUESTED,
      created_at: new Date(),
    };

    console.log("Created draw record:", drawRecord);

    return new StepResponse(drawRecord, {
      draw_id: drawRecord.id,
    });
  },
  async (compensationData) => {
    // Rollback: deletar registro do sorteio
    console.log("Rolling back draw record:", compensationData.draw_id);
  }
);

/**
 * emitDrawStartedEventStep
 * Dispara evento de início do sorteio
 */
const emitDrawStartedEventStep = createStep(
  "emit-draw-started-event",
  async (input: {
    raffle_id: string;
    draw_id: string;
    vrf_request_id: string;
  }) => {
    // TODO: Usar eventBusService
    console.log("Event: raffle.draw_started", input);
    return new StepResponse({ success: true });
  }
);

/**
 * executeRaffleDrawWorkflow
 *
 * Workflow de execução do sorteio:
 * 1. Valida se rifa pode ser sorteada
 * 2. Atualiza status para "drawing"
 * 3. Solicita randomness do Chainlink VRF
 * 4. Cria registro do sorteio
 * 5. Dispara eventos
 * 6. Aguarda callback do Chainlink (processado via webhook/subscriber)
 *
 * NOTA: O callback do Chainlink será processado separadamente
 * e completará o sorteio com o número vencedor
 */
export const executeRaffleDrawWorkflow = createWorkflow(
  "execute-raffle-draw",
  function (input: ExecuteRaffleDrawWorkflowInput) {
    // Step 1: Validar rifa
    const validation = validateRaffleForDrawStep({
      raffle_id: input.raffle_id,
    });

    // Step 2: Atualizar status
    updateRaffleStatusToDrawingStep({
      raffle_id: input.raffle_id,
    });

    // Step 3: Solicitar VRF
    const vrfRequest = requestChainlinkVRFStep({
      raffle_id: input.raffle_id,
    });

    // Step 4: Criar registro do sorteio
    const drawRecord = createDrawRecordStep({
      raffle_id: input.raffle_id,
      vrf_request_id: vrfRequest.request_id,
      vrf_transaction_hash: vrfRequest.transaction_hash,
      executed_by: input.executed_by,
    });

    // Step 5: Disparar evento
    emitDrawStartedEventStep({
      raffle_id: input.raffle_id,
      draw_id: drawRecord.id,
      vrf_request_id: vrfRequest.request_id,
    });

    // Retornar informações do sorteio
    return new WorkflowResponse({
      draw: drawRecord,
      winner_ticket: null, // Será preenchido após callback VRF
    } as ExecuteRaffleDrawWorkflowOutput);
  }
);

/**
 * completeRaffleDrawWorkflow
 *
 * Workflow chamado quando Chainlink VRF retorna o resultado
 * (Processado via webhook/subscriber)
 */
export const completeRaffleDrawWorkflow = createWorkflow(
  "complete-raffle-draw",
  function (input: {
    vrf_request_id: string;
    random_words: string[];
  }) {
    // Step 1: Buscar sorteio pelo VRF request ID
    // const draw = await raffleDrawService.getDrawByVRFRequest(vrf_request_id);

    // Step 2: Calcular número vencedor
    const winnerCalculation = transform({ input }, ({ input }) => {
      // TODO: Buscar total de tickets da rifa
      const totalTickets = 1000; // Mock

      // Usar primeiro random word para calcular vencedor
      const randomValue = BigInt(input.random_words[0]);
      const winnerNumber = Number(randomValue % BigInt(totalTickets)) + 1;

      return { winner_number: winnerNumber };
    });

    // Step 3: Buscar ticket vencedor
    // const winnerTicket = await raffleTicketService.getTicketByNumber(raffleId, winnerNumber);

    // Step 4: Atualizar ticket como vencedor
    // await raffleTicketService.markAsWinner(winnerTicket.id);

    // Step 5: Atualizar rifa com dados do vencedor
    // await raffleService.completeDraw(raffleId, { ... });

    // Step 6: Atualizar draw record
    // await raffleDrawService.completeDraw(drawId, randomWords, winnerData);

    // Step 7: Disparar eventos
    // eventBus.emit("raffle.draw_completed", { ... });
    // eventBus.emit("raffle.winner_announced", { ... });

    return new WorkflowResponse({
      winner_number: winnerCalculation.winner_number,
    });
  }
);
